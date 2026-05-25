from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict


class PromptType(str, Enum):
    marketing_okrs = "marketing_okrs"
    strengths = "strengths"
    weaknesses = "weaknesses"
    opportunities = "opportunities"
    threats = "threats"
    market_positioning = "market_positioning"
    buyer_persona = "buyer_persona"
    investment_opportunities = "investment_opportunities"
    channels_distribution = "channels_distribution"


class ModelProvider(str, Enum):
    anthropic = "anthropic"
    openai = "openai"
    gemini = "gemini"


class AnalysisConfig(BaseModel):
    product: str
    description: Optional[str] = None
    objective: str  # free-form text, e.g. "Increase Awareness"
    segments: List[str]
    model: ModelProvider


class AnalyzeRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    config: AnalysisConfig
    segment: str
    prompt_type: PromptType = Field(alias="promptType")
    custom_prompt: Optional[str] = Field(None, alias="customPrompt")


class InsightResult(BaseModel):
    segment: str
    prompt_type: PromptType = Field(alias="promptType")
    content: str

    model_config = ConfigDict(populate_by_name=True)


class ExportRequest(BaseModel):
    results: List[InsightResult]
    config: AnalysisConfig
