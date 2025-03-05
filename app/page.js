"use client";

import { useState } from "react";
import axios from "axios";
import "../app/css/styles.css";

export default function Home() {
  const [text, setText] = useState("");
  const [key, setKey] = useState("");
  const [cipher, setCipher] = useState("caesar");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone_number: "",
    user_submitted_code: "",
  });

  const handleEncrypt = async () => {
    try {
      if (!text || !key) {
        setError("Text and key are required for encryption");
        return;
      }
      const response = await axios.post("http://localhost:5000/encrypt", { text, key, cipher });
      setResult(response.data.encryptedText);
      setError("");
    } catch (error) {
      console.error("Encryption error:", error);
      setError("Error encrypting text");
      setResult("");
    }
  };

  const handleDecrypt = async () => {
    try {
      if (!text || !key) {
        setError("Text and key are required for decryption");
        return;
      }
      const response = await axios.post("http://localhost:5000/decrypt", { text, key, cipher });
      setResult(response.data.decryptedText);
      setError("");
    } catch (error) {
      console.error("Decryption error:", error);
      setError("Error decrypting text");
      setResult("");
    }
  };

  const handleVerify = async () => {
    try {
      if (!result || !userData.name || !userData.email || !userData.phone_number || !userData.user_submitted_code) {
        setError("All fields and a decrypted text are required for verification");
        return;
      }
      const response = await axios.post("http://localhost:5000/verify", {
        decrypted_text: result,
        ...userData,
      });
      setSuccess(response.data.message);
      setError("");
    } catch (error) {
      console.error("Verification error:", error);
      setError("Error verifying text");
    }
  };

  return (
    <div className="container">
      <h1>Cryptic Riddle Challenge</h1>
      <textarea
        placeholder="Enter text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter key (for Vigenère/XOR)"
        value={key}
        onChange={(e) => setKey(e.target.value)}
      />
      <select value={cipher} onChange={(e) => setCipher(e.target.value)}>
        <option value="caesar">Caesar Cipher</option>
        <option value="vigenere">Vigenère Cipher</option>
        <option value="xor">XOR Cipher</option>
      </select>
      <button onClick={handleEncrypt}>Encrypt</button>
      <button onClick={handleDecrypt}>Decrypt</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <h3>Result:</h3>
      <p>{result}</p>
      <h2>Verify Decryption</h2>
      <input
        type="text"
        placeholder="Your Name"
        value={userData.name}
        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
      />
      <input
        type="email"
        placeholder="Your Email"
        value={userData.email}
        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
      />
      <input
        type="tel"
        placeholder="Your Phone Number"
        value={userData.phone_number}
        onChange={(e) => setUserData({ ...userData, phone_number: e.target.value })}
      />
      <input
        type="text"
        placeholder="Your Submitted Code Github Link"
        value={userData.user_submitted_code}
        onChange={(e) => setUserData({ ...userData, user_submitted_code: e.target.value })}
      />
      <button onClick={handleVerify}>Verify</button>
    </div>
  );
}
