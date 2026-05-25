# SegmentIQ — SWOT Prompt Explorer

An AI-powered market segmentation tool that generates SWOT-style strategic insights across customer segments using LLMs.

## What it does

Given a **product**, a **business objective**, and one or more **market segments**, SegmentIQ automatically runs a structured set of LLM prompts and displays the results in a clean, browsable UI.

For each segment it generates:

| Category | What you get |
|---|---|
| Marketing OKRs | 3 measurable OKRs to grow usage in the segment |
| Strengths | Product strengths that matter most to this segment |
| Weaknesses | Concerns or friction points the segment may have |
| Opportunities | Brand/product opportunities unlocked by targeting this segment |
| Threats | Risks that could prevent adoption or loyalty |
| Market Positioning | How to position the product to resonate with this segment |
| Buyer Persona | A sample persona for a typical customer in this segment |
| Investment Opportunities | Why this segment is strategically valuable |
| Channels & Distribution | How to reach and activate this segment |

## Stack

- **Frontend** — React + Vite
- **Backend** — FastAPI (Python)
- **LLMs** — Anthropic Claude, OpenAI GPT, Google Gemini (switchable)

## Getting started

### Backend

```bash
cd backend
cp .env.example .env       # add your API keys
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173` and proxies API calls to `http://localhost:8000`.

API keys can also be entered directly in the UI (stored in `localStorage`) instead of using `.env`.

## Usage

1. Enter a **product** (e.g. "Electric Cars") and optional description
2. Choose a **business objective** (e.g. "Increase Awareness")
3. Select one or more **market segments** (e.g. "Gen Z Creators", "Urban Parents")
4. Hit **Run** — insights stream in for every segment × prompt combination
5. Export results as **JSON** or **CSV**
