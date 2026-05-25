from .models import ModelProvider

MODEL_IDS: dict[ModelProvider, str] = {
    ModelProvider.anthropic: "claude-sonnet-4-6",
    ModelProvider.openai: "gpt-4o",
    ModelProvider.gemini: "gemini-2.5-flash",
}
