# 🏰 MossyTavern - Tavern-Themed LLM & Image Generation UI

A custom, tavern-themed UI for local LLM (Ollama) and image generation (Stable Diffusion) for tabletop games like Dungeons & Dragons or Magic.

## 📁 Project Structure

```
mossy-tavern/
├── docker-compose.yml          # Simplified Docker config (Ollama + UI)
├── docker-compose-full.yml    # Full config with Stable Diffusion
├── tavern-ui/
│   ├── Dockerfile             # Multi-stage build with nginx
│   ├── nginx.conf             # Nginx server configuration
│   ├── package.json           # Dependencies
│   └── src/
│       ├── App.js             # Main application with error handling
│       ├── styles/tavern.css  # Enhanced tavern-themed CSS
│       └── index.js           # React entry point
├── start_tavern.bat           # One-click startup script
└── README.md
```

## ⚡ Quick Start

### Prerequisites
- Docker with NVIDIA GPU support
- Docker Compose v2+
- At least 10GB free disk space for Ollama models
- Optional: 20GB+ for Stable Diffusion

### Option 1: Simple Setup (Ollama + UI only)
```bash
docker-compose up -d
```
This starts Ollama and the Tavern UI. Stable Diffusion can be added later.

### Option 2: Full Setup (Ollama + Stable Diffusion + UI)
```bash
docker-compose -f docker-compose-full.yml up -d
```
**Note:** The Stable Diffusion image is ~20GB and may take significant time to download.

### Access Services
- **Tavern UI**: http://localhost:3000
- **Ollama API**: http://localhost:11434
- **Stable Diffusion** (if running): http://localhost:7860

## 🎨 Features
- Generate tavern-themed text using Ollama LLM
- Create fantasy artwork with Stable Diffusion
- Tavern-inspired UI with parchment textures and wooden accents
- Medieval Cinzel font for authentic feel
- Error handling and user feedback
- Environment variable support for Docker deployments

## 🎲 Usage
1. Enter a prompt (e.g., "a bustling tavern in Waterdeep")
2. Click "Tell a Tale" to generate text
3. Click "Paint the Scene" to generate an image

## 🐳 Docker Troubleshooting

### Stable Diffusion image unavailable
`ghcr.io/automatic1111/stable-diffusion-webui` is no longer published, so `docker-compose-full.yml`
now uses the actively maintained `ghcr.io/ai-dock/stable-diffusion-webui:latest-cuda` image instead
(same WebUI, same `/sdapi/v1/txt2img` API). If a pull still fails:

1. **Pull manually first:**
   ```bash
   docker pull ghcr.io/ai-dock/stable-diffusion-webui:latest-cuda
   docker-compose -f docker-compose-full.yml up -d
   ```

2. **Run separately:**
   Install Stable Diffusion WebUI manually and run it independently.

### Ollama Issues
- First run will download the model (qwen3:7b is ~4GB)
- Ensure you have enough GPU memory
- Check Docker GPU support: `nvidia-smi`

### Build the UI Image
```bash
docker build -t tavern-ui ./tavern-ui
```

## 📦 Local Development (without Docker)

### Start Ollama
```bash
# Install and run Ollama separately
ollama serve
ollama pull qwen3:7b
```

### Start React App
```bash
cd tavern-ui
npm install
npm start
```

The app will connect to localhost:11434 and localhost:7860 by default. To point it at different
addresses without rebuilding, set `OLLAMA_URL`/`SD_URL` as environment variables on the `tavern-ui`
container (see `docker-compose-full.yml`) - these must be addresses reachable from the browser,
since the UI calls them client-side.

## 📜 Example Prompts
- **Text**: "Describe a bustling tavern in Waterdeep, filled with adventurers and mysterious figures."
- **Image**: "A cozy fantasy tavern interior, warm lighting, wooden tables, medieval style, 4k, art by John Howe"
- **Text**: "Tell me a rumor about the local dragon, as if whispered by a drunk patron."
- **Image**: "A halfling bard playing a lute, fantasy art, detailed, cinematic lighting"

## 🔗 Resources
- [Ollama API Docs](https://github.com/ollama/ollama/blob/main/docs/api.md)
- [Stable Diffusion WebUI API Docs](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/API)
- [ai-dock Stable Diffusion WebUI image](https://github.com/ai-dock/stable-diffusion-webui)
- [Fantasy Fonts](https://fonts.google.com/?category=Serif)
- [Parchment Textures](https://www.transparenttextures.com/)
- [D&D Icons](https://game-icons.net/)

## 🎯 Next Steps
- [ ] Add dice roller component (d20, d6, etc.)
- [ ] Create character sheet generator
- [ ] Implement lore book for saving tales
- [ ] Add map generator for dungeon maps
- [ ] Customize LLM persona as tavern keeper

## 📞 Support

### Common Issues

**Docker GPU not detected:**
- Ensure NVIDIA Container Toolkit is installed
- Run: `nvidia-ctk runtime configure --runtime=docker`
- Restart Docker

**Port already in use:**
- Check with: `netstat -ano | findstr PORT_NUMBER`
- Kill process: `taskkill /PID PID_NUMBER /F`

**Images not loading:**
- Check Docker has enough disk space: `docker system df`
- Prune unused images: `docker system prune -a`

## 📄 License
MIT License - Feel free to use and modify for your own tavern adventures!
