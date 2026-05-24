# PDF Plagiarism Checker

A AI-powered full stack Node.js-based application that detects plagiarism in PDF documents by comparing them against other PDFs and internet sources. The system uses NLP techniques and web search to compute similarity scores and generate detailed reports.

---

## Features

- PDF vs PDF plagiarism detection
- PDF vs Internet plagiarism detection
- Web-based search using Tavily API (primary)
- Fallback search using DuckDuckGo scraper
- TF-IDF cosine similarity implementation
- Jaccard similarity scoring
- Chunk-based text processing
- PDF report generation using PDFKit
- Web scraping using Cheerio and Axios

---

## System Overview

The application processes uploaded PDFs, extracts text, splits it into chunks, and performs similarity analysis using multiple methods. For internet checking, each chunk is sent to the Tavily API to retrieve relevant web sources. The retrieved pages are scraped and compared against the original text to compute similarity scores.

---

## Tech Stack

- Node.js
- Express.js
- pdf-parse
- pdfkit
- axios
- cheerio
- tesseract.js
- natural
- Tavily API
- duck-duck-scrape

---

## Project Structure

my-api/

public/
- index.html
- viewer.html

src/
- server.js
- tfidfSimilarityService.js

controllers/
- plagiarismController.js

routes/
- plagiarismRoutes.js

models/
- Report.js

config/
- db.js

services/
- chunkService.js
- similarityService.js
- tfidfSimilarityService.js
- searchService.js
- webFetchService.js
- pdfService.js
- reportService.js
- highlightService.js
- pageExtractor.js

reports/

.env
package.json
package-lock.json
.gitignore

---

## Installation

npm install

Create a .env file:

PORT=5000
MONGO_URI=your_mongo_uri
TAVILY_API_KEY=your_tavily_api_key

---

## Running the Project

npm run dev
or
npm start

Server runs on:
http://localhost:5000

---

## API Endpoints

POST /api/plagiarism/compare
- Compares one PDF against multiple PDFs

POST /api/plagiarism/internet-check
- Checks plagiarism against internet sources

GET /api/health
- Server status check

---

## How It Works

1. PDF is parsed into text
2. Text is cleaned and split into chunks
3. Similarity is calculated using TF-IDF and Jaccard methods
4. For internet check, chunks are sent to Tavily API
5. Web pages are fetched and parsed
6. Final similarity score is computed
7. PDF report is generated using PDFKit

---

## Notes

- node_modules is excluded from version control
- Tavily API is required for internet-based plagiarism detection
- Large PDFs may take longer to process
