import json
import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from httpx import AsyncClient, ASGITransport
from app.main import app


@pytest.fixture
def analyze_payload():
    return {
        "config": {
            "product": "Electric Cars",
            "objective": "increase_awareness",
            "segments": ["Gen Z Creators"],
            "model": "anthropic",
        },
        "segment": "Gen Z Creators",
        "promptType": "strengths",
    }


@pytest.mark.asyncio
async def test_analyze_returns_result(analyze_payload):
    fake_result = '["Great design", "Strong brand", "Fast charging"]'
    with patch("app.main.create_model", return_value=MagicMock()), \
         patch("app.main.invoke_model", new_callable=AsyncMock, return_value=fake_result):
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            response = await client.post("/api/analyze", json=analyze_payload)

    assert response.status_code == 200
    data = response.json()
    assert "result" in data
    assert data["result"] == ["Great design", "Strong brand", "Fast charging"]


@pytest.mark.asyncio
async def test_analyze_invalid_json():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        async with client.stream(
            "POST", "/api/analyze",
            content=b"not json",
            headers={"Content-Type": "application/json"},
        ) as response:
            assert response.status_code in (400, 422)


@pytest.mark.asyncio
async def test_analyze_missing_fields():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        async with client.stream("POST", "/api/analyze", json={"segment": "X"}) as response:
            assert response.status_code in (400, 422)


@pytest.mark.asyncio
async def test_health():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


@pytest.mark.asyncio
async def test_export_json():
    payload = {
        "results": [
            {"segment": "Gen Z", "promptType": "strengths", "content": "Cool brand"}
        ],
        "config": {
            "product": "Electric Cars",
            "objective": "increase_awareness",
            "segments": ["Gen Z"],
            "model": "anthropic",
        },
    }
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post("/api/export/json", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["product"] == "Electric Cars"
    assert data["segments"]["Gen Z"]["strengths"] == "Cool brand"


@pytest.mark.asyncio
async def test_export_csv():
    payload = {
        "results": [
            {"segment": "Gen Z", "promptType": "strengths", "content": "Cool brand"}
        ],
        "config": {
            "product": "Electric Cars",
            "objective": "increase_awareness",
            "segments": ["Gen Z"],
            "model": "anthropic",
        },
    }
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        response = await client.post("/api/export/csv", json=payload)
    assert response.status_code == 200
    assert "text/csv" in response.headers["content-type"]
    text = response.text
    assert "segment,promptType,content" in text
    assert "Gen Z" in text
