import React, { useState } from 'react';
import axios from 'axios';
import './styles/tavern.css';
import DiceRoller from './components/DiceRoller';

function App() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // API URLs - use environment variables or fall back to localhost
  const ollamaUrl = process.env.REACT_APP_OLLAMA_URL || "http://localhost:11434";
  const sdUrl = process.env.REACT_APP_SD_URL || "http://localhost:7860";

  // Call Ollama for text generation
  const generateText = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${ollamaUrl}/api/generate`, {
        model: "qwen3:7b",
        prompt: `Describe a tavern scene for a D&D game: ${prompt}`,
        stream: false,
      });
      setResponse(res.data.response);
    } catch (error) {
      console.error("Error generating text:", error);
      setError(`Failed to generate text: ${error.message}`);
    }
    setLoading(false);
  };

  // Call Stable Diffusion for image generation
  const generateImage = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${sdUrl}/sdapi/v1/txt2img`, {
        prompt: `A fantasy tavern, ${prompt}, detailed, 4k, art by Greg Rutkowski`,
        negative_prompt: "blurry, low quality",
        steps: 20,
      });
      const base64Image = res.data.images[0];
      setImageUrl(`data:image/png;base64,${base64Image}`);
    } catch (error) {
      console.error("Error generating image:", error);
      setError(`Failed to generate image: ${error.message}`);
    }
    setLoading(false);
  };

  return (
    <div className="tavern-container">
      <h1>🏰 The Tavern of Tales</h1>
      
      {/* Dice Roller Component */}
      <DiceRoller />
      
      <div className="parchment">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your tavern scene..."
        />
        <div className="button-group">
          <button onClick={generateText} disabled={loading}>
            {loading ? "Brewing..." : "Tell a Tale"}
          </button>
          <button onClick={generateImage} disabled={loading}>
            {loading ? "Painting..." : "Paint the Scene"}
          </button>
        </div>
        {error && (
          <div className="tavern-error">
            <p>⚠️ {error}</p>
          </div>
        )}
        {response && (
          <div className="tavern-text">
            <h3>✨ The Tale Unfolds...</h3>
            <p>{response}</p>
          </div>
        )}
        {imageUrl && (
          <div className="tavern-image">
            <img src={imageUrl} alt="Tavern Scene" />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
