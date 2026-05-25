import os
from typing import AsyncGenerator, Union

from langchain_anthropic import ChatAnthropic
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_openai import ChatOpenAI

from .models import ModelProvider
from .constants import MODEL_IDS

LLMModel = Union[ChatAnthropic, ChatOpenAI, ChatGoogleGenerativeAI]


def create_model(provider: ModelProvider, api_key: str | None = None) -> LLMModel:
    if provider == ModelProvider.anthropic:
        key = api_key or os.environ.get("ANTHROPIC_API_KEY")
        if not key:
            raise ValueError("Anthropic API key is required. Add it in Settings.")
        return ChatAnthropic(model=MODEL_IDS[provider], api_key=key)

    if provider == ModelProvider.openai:
        key = api_key or os.environ.get("OPENAI_API_KEY")
        if not key:
            raise ValueError("OpenAI API key is required. Add it in Settings.")
        return ChatOpenAI(model=MODEL_IDS[provider], api_key=key)

    if provider == ModelProvider.gemini:
        key = api_key or os.environ.get("GEMINI_API_KEY")
        if not key:
            raise ValueError("Gemini API key is required. Add it in Settings.")
        return ChatGoogleGenerativeAI(model=MODEL_IDS[provider], google_api_key=key)

    raise ValueError(f"Unknown provider: {provider}")


async def stream_tokens(model: LLMModel, prompt: str) -> AsyncGenerator[str, None]:
    async for chunk in model.astream(prompt):
        yield str(chunk.content)


async def invoke_model(model: LLMModel, prompt: str) -> str:
    response = await model.ainvoke(prompt)
    return str(response.content)
