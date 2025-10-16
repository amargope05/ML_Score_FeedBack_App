"use client";

import { useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function Home() {
  const [file, setFile] = useState(null);
  const [username, setUsername] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async () => {
    if (!file || !username) return alert("Enter username and select file");
    const formData = new FormData();
    // formData.onClick()
    formData.append("username", username);
    formData.append("file", file);
    // console.log("formData -- ",formData)

    try {
      const res = await axios.post("http://localhost:4000/api/submissions", formData);
      setResult(res.data);
    } catch (err) {
      console.log("Submission failed :",err);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Upload CSV/JSON</h1>
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
      <input type="file" onChange={e => setFile(e.target.files[0])} />
      <button onClick={handleSubmit}>Submit</button>

      {result && (
        <div>
          <h2>Score: {result.score}</h2>
          <p>Feedback: {result.feedback}</p>
          <Link href="/leaderboard">View Leaderboard</Link>
        </div>
      )}
    </div>
  );
}
