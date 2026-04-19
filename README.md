<div align="center">
  <h1>ScopeAI 🚀</h1>
  <p><b>The Intelligent Codebase Explainer & Architecture Navigator</b></p>
</div>
ScopeAI is a powerful developer tool that securely ingests, parses, and understands an entire GitHub repository. Built with a specialized hybrid-chunking strategy and advanced vector embeddings, it allows you to chat directly with your codebase, generate architectural insights, and navigate complex logic effortlessly.
---
## 🔥 Features
- **Instant Repository Ingestion:** Paste any GitHub URL to securely clone and analyze the codebase.
- **Deep AST Analysis:** Python files are parsed using Abstract Syntax Trees to semantically separate imports, functions, and classes.
- **Intelligent Context Retrieval:** Uses `MiniLM-L6-v2` for generating 384-dimension vector embeddings and ChromaDB's HNSW graph traversal for lightning-fast semantic search.
- **AI Chat Interface:** Powered by Groq's ultra-fast LLM inference to explain code, trace logic, and answer architectural questions.
- **Ephemeral & Secure:** Repositories are cloned dynamically and purged immediately after processing. No raw source code is permanently stored.
---
## 🏗️ Architecture
ScopeAI features a decoupled architecture optimized for rapid deployment and edge performance.
### 💻 Frontend (Client)
- **Tech Stack:** React, Vite, Tailwind CSS, TypeScript
- **Deployment:** [Vercel](https://vercel.com/)
- **Features:** A sleek, fully-responsive dark-mode UI with smooth micro-interactions, an animated terminal logging system, and a robust chat workspace. 
### ⚙️ Backend (API Server)
- **Tech Stack:** FastAPI, Python, ChromaDB, Sentence-Transformers, Groq API
- **Deployment:** [Hugging Face Spaces (Docker)](https://huggingface.co/spaces)
- **Features:** RESTful API handling repository cloning, AST chunking, vector generation, and LLM orchestration. Runs inside a secure, lightweight Docker container.
---
## 🚀 Deployment Guide
ScopeAI is designed to be highly portable. Here is how the production footprint is configured:
### 1. Backend (Hugging Face Spaces)
The backend is packaged as a Docker container to ensure all heavy C++ compiling requirements (like `hnswlib` for ChromaDB) are met.
1. Create a new **Docker** Space on Hugging Face.
2. Push the `backend/` directory using Git Subtrees from your root project:
   ```bash
   git remote add huggingface https://huggingface.co/spaces/YOUR_USERNAME/YOUR_SPACE_NAME
   git subtree push --prefix backend huggingface main --force
   ```
3. Add your `GROQ_API_KEY` in the **Variables and secrets** menu of your Hugging Face Space.
### 2. Frontend (Vercel)
The React/Vite frontend is deployed globally via Vercel's edge network.
1. Import the repository into Vercel.
2. Set the Root Directory to `frontend`.
3. Add the `VITE_API_URL` environment variable pointing to the Direct API URL of your Hugging Face space (e.g., `https://username-spacename.hf.space`).
4. Trigger a Deploy!
5. https://scope-ai-devanshs490-gmailcoms-projects.vercel.app/
---
## 💻 Local Development Setup
If you want to run ScopeAI locally for development:
### Prerequisites
- Python 3.11+
- Node.js 18+
- Git
### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt
```
Create a `.env` file in the `backend/` directory and add your Groq key:
```env
GROQ_API_KEY=gsk_your_groq_key_here
```
Run the API:
```bash
uvicorn app.main:app --reload --port 8000
```
### Frontend
Open a new terminal window:
```bash
cd frontend
npm install
```
Create a `.env` file in the `frontend/` directory pointing to your local backend:
```env
VITE_API_URL=http://localhost:8000
```
Run the frontend:
```bash
npm run dev
```
---
## 🛡️ Security
ScopeAI emphasizes code security. It does not retain proprietary source code or log data logic. Repositories are processed ephemerally into vector coordinates locally and the raw code is discarded immediately.
## 📝 License
MIT License
