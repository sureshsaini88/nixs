"use client";

import { useState } from "react";
import { FiCopy } from "react-icons/fi";
import "./2fa.css";

export default function TwoFAPage() {
  const [twoFAInput, setTwoFAInput] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [expiresIn, setExpiresIn] = useState(30);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGetCode = () => {
    if (!twoFAInput.trim()) return;
    
    setIsGenerating(true);
    // Generate a random 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    setExpiresIn(30);
    setIsGenerating(false);
    
    // Start countdown
    const timer = setInterval(() => {
      setExpiresIn((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
  };

  return (
    <div className="twoFAPage">
      <div className="twoFAContainer">
        <h1 className="twoFATitle">Security Code Generator 2FA</h1>
        
        <div className="inputSection">
          <input
            type="text"
            className="twoFAInput"
            placeholder="please fill 2fa here"
            value={twoFAInput}
            onChange={(e) => setTwoFAInput(e.target.value)}
          />
          
          <button 
            className="getCodeBtn"
            onClick={handleGetCode}
            disabled={isGenerating || !twoFAInput.trim()}
          >
            Get Code
          </button>
        </div>
        
        {generatedCode && (
          <div className="resultSection">
            <div className="expiresText">
              Expires later: <span className="timer">{expiresIn}</span> second
            </div>
            
            <div className="codeBox">
              <span className="generatedCode">{generatedCode}</span>
              <button className="copyBtn" onClick={handleCopy}>
                <FiCopy size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
