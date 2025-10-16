"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function Leaderboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // fetch("http://localhost:4000/api/leaderboard").then((res) =>{
    //   console.log(res.data)
    // }).catch((err)=>{
    //    console.log(err)
    // })
    
    axios
      .get("http://localhost:4000/api/leaderboard")
      .then((res) => {
        // console.log("amar --- ",res.data)
        setData(res.data)
    })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Leaderboard (Top 10)</h1>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Username</th>
            <th>Score</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r, i) => (
            <tr key={i}>
              <td>{r.username}</td>
              <td>{r.score}</td>
              <td>{r.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link href="/">Back to Upload</Link>
    </div>
  );
}
