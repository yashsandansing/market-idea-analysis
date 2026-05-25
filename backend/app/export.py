from datetime import datetime, timezone
from typing import List
import json

from .models import InsightResult, AnalysisConfig


def to_json(results: List[InsightResult], config: AnalysisConfig) -> str:
    output: dict = {
        "product": config.product,
        "objective": config.objective.value,
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "segments": {},
    }

    for result in results:
        segment = result.segment
        prompt_type = result.prompt_type.value
        if segment not in output["segments"]:
            output["segments"][segment] = {}
        output["segments"][segment][prompt_type] = result.content

    return json.dumps(output, indent=2)


def _escape_csv_field(value: str) -> str:
    escaped = value.replace('"', '""').replace("\n", "\\n")
    return f'"{escaped}"'


def to_csv(results: List[InsightResult], config: AnalysisConfig) -> str:
    header = "segment,promptType,content"
    rows = [
        ",".join([
            _escape_csv_field(r.segment),
            _escape_csv_field(r.prompt_type.value),
            _escape_csv_field(r.content),
        ])
        for r in results
    ]
    return "\n".join([header, *rows])
