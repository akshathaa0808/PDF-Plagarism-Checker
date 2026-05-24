# 📄 PDF Plagiarism Checker

A AI-powered full-stack Node.js application that detects plagiarism in PDF files by comparing:
- PDF vs PDF (local comparison)
- PDF vs Internet sources (web-based plagiarism detection)

It generates detailed similarity reports and highlights matched content.

---

## 🚀 Features

- Upload and compare multiple PDF files
- Internet plagiarism detection using web search
- TF-IDF + Jaccard-based similarity scoring
- Hybrid similarity engine (word + sentence matching)
- Auto-generated PDF report with results
- Chunk-based scanning for large documents
- REST API built with Express
- MongoDB-ready report model

---

## 🏗️ Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- pdf-parse
- pdfkit
- axios
- cheerio
- tesseract.js (OCR support)
- natural (NLP utilities)

---

## 📁 Project Structure

my-api/
│
├── public/
│   ├── index.html
│   └── viewer.html
│
├── src/
│   ├── server.js
│   ├── tfidfSimilarityService.js
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   └── plagiarismController.js
│   │
│   ├── models/
│   │   └── Report.js
│   │
│   ├── routes/
│   │   └── plagiarismRoutes.js
│   │
│   ├── services/
│   │   ├── chunkService.js
│   │   ├── pdfService.js
│   │   ├── similarityService.js
│   │   ├── searchService.js
│   │   ├── webFetchService.js
│   │   ├── highlightService.js
│   │   ├── pageExtractor.js
│   │   └── reportService.js
│
├── reports/
├── .env
├── .gitignore
├── package.json
├── package-lock.json

---

## ⚙️ Installation

### 1. Install dependencies
npm install

### 2. Create `.env` file
PORT=5000
TAVILY_API_KEY=your_api_key_here

---

## ▶️ Run the project

### Development
npm run dev

### Production
npm start

Server runs at:
http://localhost:5000

---

## 📡 API Endpoints

### 📄 PDF vs PDF Comparison
POST /api/plagiarism/compare

- pdf1 → main file
- pdfs[] → comparison files

Returns:
- similarity scores
- average similarity
- max similarity
- PDF report link

---

### 🌐 Internet Plagiarism Check
POST /api/plagiarism/internet

- file → PDF

Returns:
- similarity percentage
- matched URLs (sources)

---

### ❤️ Health Check
GET /api/health

---

## 🧠 How It Works

1. PDF is converted into text using `pdf-parse`
2. Text is cleaned and chunked
3. Similarity is calculated using:
   - TF-IDF cosine similarity
   - Jaccard similarity
4. For internet check:
   - chunks are searched online
   - web pages are fetched and analyzed
5. Final report is generated using `pdfkit`

---

## 📊 Database (Optional Feature)

The project includes a MongoDB model:

- `Report.js` stores:
  - file name
  - similarity score
  - sources
  - timestamps

Routes in `plagiarismRoutes.js` handle API requests for:
- PDF comparison
- Internet check
- report generation

---

## ⚠️ Notes

- Do NOT upload `node_modules`
- Keep `.env` file private
- Internet search depends on API limits
- Large PDFs may take time to process

---

## 👨‍💻 Author

PDF Plagiarism Checker Project built using Node.js, NLP techniques, and web scraping.
