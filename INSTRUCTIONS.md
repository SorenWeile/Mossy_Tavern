# Tavern LLM UI Setup Guide

This guide will help you set up a custom, tavern-themed UI for local LLM (Ollama) and image generation (Stable Diffusion) for tabletop games like Dungeons &amp; Dragons or Magic.

---

## **1. Project Structure**

```
tavern-llm-ui/
├── docker-compose.yml       # Docker configuration for Ollama + Stable Diffusion + UI
├── tavern-ui/               # Your custom frontend (React/Vue/HTML)
│   ├── src/
│   │   ├── App.js           # Main app component
│   │   ├── styles/          # CSS for tavern theme
│   │   └── ...
│   ├── package.json
│   └── ...
└── README.md
```

---

## **2. Docker Setup**

### **A. `docker-compose.yml`**

Use this to run Ollama, Stable Diffusion, and your custom UI:

```yaml
version: "3.8"
services:
  ollama:
    image: ollama/ollama:latest
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]

  stable-diffusion:
    image: ghcr.io/automatic1111/stable-diffusion-webui:latest
    ports:
      - "7860:7860"
    environment:
      - COMMANDLINE_ARGS=--api --listen
    volumes:
      - sd_data:/stable-diffusion-webui
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 1
              capabilities: [gpu]

  tavern-ui:
    build: ./tavern-ui
    ports:
      - "3000:3000"
    depends_on:
      - ollama
      - stable-diffusion

volumes:
  ollama_data:
  sd_data:
```

### **B. Start the Stack**

1. Save the above as \`docker-compose.yml\`.
2. Run:
  ```bash
  docker-compose up -d
  ```
3. Access:
  - Ollama API: `http://localhost:11434`
  - Stable Diffusion API: `http://localhost:7860`
  - Your UI: `http://localhost:3000`

---

## **3. Custom UI Development**

### **A. Basic React Template**

1. Initialize a React app in the `tavern-ui` folder:
  ```bash
  npx create-react-app tavern-ui
  cd tavern-ui
  npm install axios
  ```
2. **`src/App.js` (Starter Code)**
  ```javascript
  import React, { useState } from 'react';
  import axios from 'axios';
  import './styles/tavern.css';
  
  function App() {
    const [prompt, setPrompt] = useState("");
    const [response, setResponse] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [loading, setLoading] = useState(false);
  
    // Call Ollama for text generation
    const generateText = async () => {
      setLoading(true);
      try {
        const res = await axios.post("http://localhost:11434/api/generate", {
          model: "qwen3:7b",
          prompt: `Describe a tavern scene for a D&D game: ${prompt}`,
          stream: false,
        });
        setResponse(res.data.response);
      } catch (error) {
        console.error("Error generating text:", error);
      }
      setLoading(false);
    };
  
    // Call Stable Diffusion for image generation
    const generateImage = async () => {
      setLoading(true);
      try {
        const res = await axios.post("http://localhost:7860/sdapi/v1/txt2img", {
          prompt: `A fantasy tavern, ${prompt}, detailed, 4k, art by Greg Rutkowski`,
          negative_prompt: "blurry, low quality",
          steps: 20,
        });
        const base64Image = res.data.images[0];
        setImageUrl(`data:image/png;base64,${base64Image}`);
      } catch (error) {
        console.error("Error generating image:", error);
      }
      setLoading(false);
    };
  
    return (
      <div className="tavern-container">
        <h1>🏰 The Tavern of Tales</h1>
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
  ```

---

### **B. Tavern-Themed CSS**

1. Create `src/styles/tavern.css`:
  ```css
  body {
    background-color: #1a120b;
    color: #f5e7d3;
    font-family: 'Cinzel', serif;
    margin: 0;
    padding: 20px;
  }
  
  .tavern-container {
    max-width: 800px;
    margin: 0 auto;
    background-image: url('https://www.transparenttextures.com/patterns/parchment.png');
    padding: 20px;
    border: 3px solid #8b4513;
    border-radius: 10px;
  }
  
  .parchment {
    background-color: rgba(245, 235, 211, 0.8);
    padding: 20px;
    border: 1px solid #8b4513;
    border-radius: 5px;
  }
  
  textarea {
    width: 100%;
    min-height: 100px;
    padding: 10px;
    border: 2px solid #8b4513;
    border-radius: 5px;
    background-color: #f5e7d3;
    color: #1a120b;
    font-family: 'Cinzel', serif;
    resize: vertical;
  }
  
  .button-group {
    display: flex;
    gap: 10px;
    margin: 15px 0;
  }
  
  button {
    padding: 10px 20px;
    background-color: #8b4513;
    color: #f5e7d3;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-family: 'Cinzel', serif;
    transition: background-color 0.3s;
  }
  
  button:hover {
    background-color: #a0522d;
  }
  
  button:disabled {
    background-color: #654321;
    cursor: not-allowed;
  }
  
  .tavern-text {
    margin: 20px 0;
    padding: 15px;
    background-color: rgba(245, 235, 211, 0.5);
    border-left: 4px solid #8b4513;
  }
  
  .tavern-image {
    margin: 20px 0;
    text-align: center;
  }
  
  .tavern-image img {
    max-width: 100%;
    border: 2px solid #8b4513;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(139, 69, 19, 0.5);
  }
  ```
2. Add the font to `public/index.html`:
  ```html
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&display=swap" rel="stylesheet" />
  ```

---

## **4. Run Your UI**

1. Start the React app:
  ```bash
  cd tavern-ui
  npm start
  ```
2. Your UI will be available at \`http://localhost:3000\`.

---

## **5. Tavern-Themed Features to Add**

- **Dice Roller:** Add a button to simulate dice rolls (e.g., d20, d6).
- **Character Sheets:** Create a form to generate and save NPC/player character descriptions.
- **Lore Book:** Save chat history as "tavern tales" in a scrollable list.
- **Map Generator:** Use Stable Diffusion to generate fantasy maps with prompts like "a dungeon map, ink on parchment, detailed".
- **Tavern Keeper Persona:** Customize the LLM prompt to act as a tavern keeper (e.g., "You are a wise old innkeeper in a fantasy tavern. Respond in a medieval tone.").

---

## **6. Deployment for Your Friend**

### **Option 1: Docker Image**

1. Build your custom UI Docker image:
  ```bash
  docker build -t tavern-ui ./tavern-ui
  ```
2. Update \`docker-compose.yml\` to use your built image:
  ```yaml
  tavern-ui:
    image: tavern-ui
    ports:
      - "3000:3000"
  ```
3. Provide your friend with the \`docker-compose.yml\` and instructions:
  - Install Docker.
  - Run `docker-compose up -d`.
  - Open `http://localhost:3000`.

### **Option 2: Batch/PowerShell Script**

Create a script to start everything with one click. Example (`start_tavern.bat`):

```batch
@echo off
docker-compose up -d
echo Tavern UI is running at http://localhost:3000
pause
```

---

## **7. Example Prompts for Tavern Theme**

- **Text:**
  - "Describe a bustling tavern in Waterdeep, filled with adventurers and mysterious figures."
  - "Tell me a rumor about the local dragon, as if whispered by a drunk patron."
- **Image:**
  - "A cozy fantasy tavern interior, warm lighting, wooden tables, medieval style, 4k, art by John Howe"
  - "A halfling bard playing a lute, fantasy art, detailed, cinematic lighting"

---

## **8. Resources**

- [Ollama API Docs](https://github.com/ollama/ollama/blob/main/docs/api.md)
- [Stable Diffusion API Docs](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/API)
- [Fantasy Fonts](https://fonts.google.com/?category=Serif)
- [Parchment Textures](https://www.transparenttextures.com/)
- [D&amp;D Icons](https://game-icons.net/)

---

## **9. Next Steps**

- Set up the Docker stack.
- Build the basic React UI.
- Add tavern-themed styling.
- Test Ollama and Stable Diffusion APIs.
- Package for your friend!