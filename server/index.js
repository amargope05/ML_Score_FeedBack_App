const express = require("express");
const multer = require("multer");
const { spawn } = require("child_process");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const cors = require("cors"); 

const app = express();
app.use(cors());

app.use(cors({
    origin: "http://localhost:3000", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json());
const PORT = process.env.PORT || 4000;

const db = new sqlite3.Database("./db.sqlite");
db.run(`CREATE TABLE IF NOT EXISTS submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    file TEXT,
    score INTEGER,
    feedback TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);


const upload = multer({ dest: "uploads/" });

app.post("/api/submissions", upload.single("file"), (req, res) => {
    const username = req.body.username;
    const filePath = req.file.path;
    // console.log("---> ",username,filePath)
    // const demo = spawn("python", [path.join(__dirname, "../scorer/scorer.py"), filePath]);

    const python = spawn("python3", [path.join(__dirname, "../scorer/scorer.py"), filePath]);

    let output = "";
    python.stdout.on("data", (data) => {
        output += data.toString();
    });

    python.stderr.on("data", (data) => {
        console.error("Python error:", data.toString());
    });

    python.on("close", () => {
        try {
            const result = JSON.parse(output);
            const { score, feedback } = result;

            db.run(
                `INSERT INTO submissions (username, file, score, feedback) VALUES (?, ?, ?, ?)`,
                [username, req.file.originalname, score, feedback],
                () => res.json({ score, feedback })
            );
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Scorer failed" });
        }
    });
});

app.get("/api/leaderboard", (req, res) => {
    db.all(
        `SELECT username, score, created_at FROM submissions ORDER BY score DESC, created_at ASC LIMIT 10`,
        (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        }
    );
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
