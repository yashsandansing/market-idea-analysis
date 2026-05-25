from typing import Optional

from .models import PromptType

_JSON_NOTE = "Respond with ONLY valid JSON, no markdown fences, no explanation."


def build_prompt(prompt_type: PromptType, segment: str, product: str, objective: str, description: Optional[str] = None) -> str:
    obj = objective.lower()
    desc_line = f' Product description: {description}.' if description else ''

    match prompt_type:
        case PromptType.marketing_okrs:
            return (
                f'You are a marketing strategist. Generate 3–5 concrete OKRs for the product "{product}".{desc_line} '
                f'Target the segment "{segment}" with the goal to {obj}. '
                f'Be specific and measurable. {_JSON_NOTE}\n'
                f'Format: [{{"o": "objective text", "krs": ["key result 1", "key result 2", "key result 3"], "confidence": 0.82}}]'
            )

        case PromptType.strengths:
            return (
                f'You are a business analyst. Identify 4–6 key strengths of the product "{product}".{desc_line} '
                f'Consider how the segment "{segment}" perceives it in context of the objective to {obj}. '
                f'{_JSON_NOTE}\n'
                f'Format: ["strength 1", "strength 2", "strength 3", "strength 4"]'
            )

        case PromptType.weaknesses:
            return (
                f'You are a business analyst. Identify 4–6 key weaknesses of the product "{product}".{desc_line} '
                f'Consider how the segment "{segment}" perceives it in context of the objective to {obj}. '
                f'{_JSON_NOTE}\n'
                f'Format: ["weakness 1", "weakness 2", "weakness 3", "weakness 4"]'
            )

        case PromptType.opportunities:
            return (
                f'You are a market analyst. Identify 4–6 key market opportunities for "{product}".{desc_line} '
                f'Target the segment "{segment}" with the goal to {obj}. '
                f'{_JSON_NOTE}\n'
                f'Format: ["opportunity 1", "opportunity 2", "opportunity 3", "opportunity 4"]'
            )

        case PromptType.threats:
            return (
                f'You are a market analyst. Identify 4–6 key threats facing "{product}".{desc_line} '
                f'Consider targeting the segment "{segment}" with the goal to {obj}. '
                f'{_JSON_NOTE}\n'
                f'Format: ["threat 1", "threat 2", "threat 3", "threat 4"]'
            )

        case PromptType.market_positioning:
            return (
                f'You are a brand strategist. Write market positioning for "{product}".{desc_line} '
                f'Aim at the segment "{segment}" to {obj}. '
                f'{_JSON_NOTE}\n'
                f'Format: {{"statement": "one-sentence value proposition", '
                f'"axes": {{"x": ["LeftPole", "RightPole"], "y": ["BottomPole", "TopPole"]}}, '
                f'"us": {{"x": 0.75, "y": 0.65}}, '
                f'"comp": [{{"name": "CompetitorName", "x": 0.4, "y": 0.3}}]}}\n'
                f'x and y values must be between 0.0 and 1.0. Include 3–5 competitors.'
            )

        case PromptType.buyer_persona:
            return (
                f'You are a UX researcher. Create a detailed buyer persona for someone in the segment "{segment}" '
                f'who would purchase "{product}".{desc_line} Their goal: to {obj}. '
                f'{_JSON_NOTE}\n'
                f'Format: {{"name": "First Last", "age": 30, "city": "City, State", '
                f'"role": "job title and context", "income": "$XX,XXX", '
                f'"quote": "a direct, authentic quote from this persona in first person", '
                f'"goals": ["goal 1", "goal 2", "goal 3"], '
                f'"pains": ["pain 1", "pain 2", "pain 3"], '
                f'"channels": ["Channel1", "Channel2", "Channel3"]}}'
            )

        case PromptType.investment_opportunities:
            return (
                f'You are a venture analyst. Describe investment opportunities for "{product}".{desc_line} '
                f'Target the segment "{segment}" with the strategic objective to {obj}. '
                f'{_JSON_NOTE}\n'
                f'Format: {{"headline": "compelling one-line investment thesis", '
                f'"stats": [{{"k": "TAM (2030)", "v": "$XXB"}}, {{"k": "Annual growth", "v": "+X%"}}, '
                f'{{"k": "NPS uplift", "v": "+XX"}}, {{"k": "Key metric", "v": "value"}}], '
                f'"rationale": "2–3 sentence investment rationale"}}'
            )

        case PromptType.channels_distribution:
            return (
                f'You are a go-to-market strategist. Recommend the best distribution and marketing channels '
                f'for "{product}".{desc_line} Reach the segment "{segment}" and {obj}. '
                f'{_JSON_NOTE}\n'
                f'Format: [{{"name": "Channel Name", "mix": 0.30, "note": "brief rationale"}}]\n'
                f'Include 5–8 channels. The mix values must sum to exactly 1.0.'
            )

        case _:
            raise ValueError(f"Unknown prompt type: {prompt_type}")
