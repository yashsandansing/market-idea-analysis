import json

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response
from pydantic import ValidationError

from .export import to_csv, to_json
from .llm import create_model, invoke_model
from .models import AnalyzeRequest, ExportRequest, ModelProvider
from .prompts import build_prompt

app = FastAPI(title="SegmentIQ API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)



def _inline_schema(model) -> dict:
    schema = model.model_json_schema()
    defs = schema.pop("$defs", {})

    def resolve(obj):
        if isinstance(obj, dict):
            if "$ref" in obj:
                ref_name = obj["$ref"].split("/")[-1]
                return resolve(defs[ref_name])
            return {k: resolve(v) for k, v in obj.items()}
        if isinstance(obj, list):
            return [resolve(i) for i in obj]
        return obj

    return resolve(schema)


@app.post(
    "/api/analyze",
    openapi_extra={
        "requestBody": {
            "required": True,
            "content": {"application/json": {"schema": _inline_schema(AnalyzeRequest)}},
        }
    },
)
async def analyze(request: Request):
    try:
        body = await request.json()
        req = AnalyzeRequest.model_validate(body)
    except (ValidationError, ValueError) as exc:
        return JSONResponse({"error": str(exc)}, status_code=400)

    header_name = {
        ModelProvider.anthropic: "X-Anthropic-Key",
        ModelProvider.openai: "X-OpenAI-Key",
        ModelProvider.gemini: "X-Gemini-Key",
    }[req.config.model]
    api_key = request.headers.get(header_name) or None

    if req.custom_prompt:
        prompt = (
            req.custom_prompt
            .replace("{product}", req.config.product)
            .replace("{description}", req.config.description or "")
            .replace("{segment}", req.segment)
            .replace("{objective}", req.config.objective)
        )
    else:
        prompt = build_prompt(
            req.prompt_type, req.segment, req.config.product, req.config.objective,
            description=req.config.description,
        )
    print(prompt)

    try:
        model = create_model(req.config.model, api_key)
        print(model)
        raw = await invoke_model(model, prompt)
        return JSONResponse({"result": json.loads(raw)})
    except json.JSONDecodeError as exc:
        return JSONResponse({"error": f"Model returned invalid JSON: {exc}", "raw": raw}, status_code=502)
    except Exception as exc:
        return JSONResponse({"error": str(exc)}, status_code=500)


@app.post("/api/export/json")
async def export_json(body: ExportRequest):
    content = to_json(body.results, body.config)
    return Response(
        content=content,
        media_type="application/json",
        headers={"Content-Disposition": 'attachment; filename="insights.json"'},
    )


@app.post("/api/export/csv")
async def export_csv(body: ExportRequest):
    content = to_csv(body.results, body.config)
    return Response(
        content=content,
        media_type="text/csv",
        headers={"Content-Disposition": 'attachment; filename="insights.csv"'},
    )


@app.get("/health")
async def health():
    return {"status": "ok"}
