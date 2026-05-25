import json
import pytest
from app.models import InsightResult, AnalysisConfig, ModelProvider, PromptType
from app.export import to_json, to_csv


def make_config() -> AnalysisConfig:
    return AnalysisConfig(
        product="Electric Cars",
        objective="increase_awareness",
        segments=["Gen Z Creators", "Urban Parents"],
        model=ModelProvider.anthropic,
    )


def make_results():
    return [
        InsightResult(segment="Gen Z Creators", promptType="strengths", content="Great design"),
        InsightResult(segment="Gen Z Creators", promptType="weaknesses", content="High price"),
        InsightResult(segment="Urban Parents", promptType="strengths", content="Safe and reliable"),
    ]


class TestToJSON:
    def test_top_level_keys(self):
        data = json.loads(to_json(make_results(), make_config()))
        assert data["product"] == "Electric Cars"
        assert data["objective"] == "increase_awareness"
        assert "generatedAt" in data
        assert "segments" in data

    def test_nested_structure(self):
        data = json.loads(to_json(make_results(), make_config()))
        assert data["segments"]["Gen Z Creators"]["strengths"] == "Great design"
        assert data["segments"]["Gen Z Creators"]["weaknesses"] == "High price"
        assert data["segments"]["Urban Parents"]["strengths"] == "Safe and reliable"

    def test_generated_at_is_iso_format(self):
        data = json.loads(to_json(make_results(), make_config()))
        from datetime import datetime
        datetime.fromisoformat(data["generatedAt"])  # raises if invalid

    def test_empty_results(self):
        data = json.loads(to_json([], make_config()))
        assert data["segments"] == {}


class TestToCSV:
    def test_header_row(self):
        csv = to_csv(make_results(), make_config())
        lines = csv.split("\n")
        assert lines[0] == "segment,promptType,content"

    def test_row_count(self):
        csv = to_csv(make_results(), make_config())
        lines = csv.split("\n")
        assert len(lines) == 4  # header + 3 rows

    def test_fields_are_quoted(self):
        csv = to_csv(make_results(), make_config())
        lines = csv.split("\n")
        # Every data cell should be quoted
        for line in lines[1:]:
            assert line.startswith('"')

    def test_newline_escaped_in_content(self):
        results = [InsightResult(segment="S", promptType="strengths", content="line1\nline2")]
        csv = to_csv(results, make_config())
        assert "\\n" in csv
        assert "\n" not in csv.split("\n", 1)[1]  # no raw newline inside quoted field

    def test_double_quotes_escaped(self):
        results = [InsightResult(segment='A "quoted" name', promptType="strengths", content="ok")]
        csv = to_csv(results, make_config())
        assert '""' in csv
