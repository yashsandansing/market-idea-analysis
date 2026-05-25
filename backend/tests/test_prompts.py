import pytest
from app.models import PromptType
from app.prompts import build_prompt


SEGMENT = "Gen Z Creators"
PRODUCT = "Electric Cars"
OBJECTIVE = "increase_awareness"


def test_marketing_okrs_contains_key_terms():
    result = build_prompt(PromptType.marketing_okrs, SEGMENT, PRODUCT, OBJECTIVE)
    assert PRODUCT in result
    assert SEGMENT in result
    assert "increase awareness" in result
    assert "OKR" in result


def test_strengths_prompt():
    result = build_prompt(PromptType.strengths, SEGMENT, PRODUCT, OBJECTIVE)
    assert PRODUCT in result
    assert SEGMENT in result
    assert "strengths" in result.lower()


def test_weaknesses_prompt():
    result = build_prompt(PromptType.weaknesses, SEGMENT, PRODUCT, OBJECTIVE)
    assert PRODUCT in result
    assert SEGMENT in result
    assert "weaknesses" in result.lower()


def test_opportunities_prompt():
    result = build_prompt(PromptType.opportunities, SEGMENT, PRODUCT, OBJECTIVE)
    assert "opportunities" in result.lower()


def test_threats_prompt():
    result = build_prompt(PromptType.threats, SEGMENT, PRODUCT, OBJECTIVE)
    assert "threats" in result.lower()


def test_market_positioning_prompt():
    result = build_prompt(PromptType.market_positioning, SEGMENT, PRODUCT, OBJECTIVE)
    assert "positioning" in result.lower()


def test_buyer_persona_prompt():
    result = build_prompt(PromptType.buyer_persona, SEGMENT, PRODUCT, OBJECTIVE)
    assert "persona" in result.lower()


def test_investment_opportunities_prompt():
    result = build_prompt(PromptType.investment_opportunities, SEGMENT, PRODUCT, OBJECTIVE)
    assert "investment" in result.lower()


def test_channels_distribution_prompt():
    result = build_prompt(PromptType.channels_distribution, SEGMENT, PRODUCT, OBJECTIVE)
    assert "channel" in result.lower()


def test_objective_underscores_replaced():
    result = build_prompt(PromptType.marketing_okrs, SEGMENT, PRODUCT, "enter_new_market")
    assert "enter new market" in result
    assert "enter_new_market" not in result


def test_all_prompt_types_handled():
    for pt in PromptType:
        result = build_prompt(pt, SEGMENT, PRODUCT, OBJECTIVE)
        assert isinstance(result, str)
        assert len(result) > 0
