from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Set

import numpy as np
from sentence_transformers import SentenceTransformer

class JourneyAnalyzer:
    def __init__(self, n=5, sim_threshold=0.6):
        self.N = n
        self.SIM_THRESHOLD = sim_threshold
        self.mini_lm_model = SentenceTransformer('all-MiniLM-L6-v2')

    def _get_latest_events(self, sessionId, count):
        events = [
            { "event": "Text Hover", "element": "DIV | 6.5% p.a. | /"},
            { "event": "Text Hover", "element": "DIV | 6.5% p.a. | /"},
            { "event": "Text Hover", "element": "DIV | 6.5% p.a. | /"}
        ]
        return events[:count]

    def _get_latest_if_config(self, sessionId):
        ifConfig = {
            "title": "Savings Account Explorer",
            "flow_steps": [
                {"id": "explored_savings", "event": "click", "element": "SECTION | SavingsZero balance accounts | /", "set_flag": "exploredSavings"},
                {"id": "viewed_calculator", "event": "Text Hover", "element": "DIV | 6.5% p.a. | /", "set_flag": "viewedCalculator"}
            ],
            "pattern_id": "ec4fafbd-75ae-48b4-a564-8dcabbec0399",
            "flow_components": {
                "bottomCard": {
                    "link": "/smartassist/insights",
                    "type": "floater",
                    "message": "You might want to check out our SavingsZero balance accounts with instant benefits.",
                    "imageUrl": "https://cdn.example.com/images/telemetry-modal.png"
                }
            },
            "flow_uiMappings": [
                {"flags": ["viewedCalculator"], "componentId": "bottomCard"}
            ],
            "similarity_score": 0.074775256,
            "bottomCardMessage": "Explore our SavingsZero balance accounts for instant benefits and easy savings!",
            "centredModalMessage": "Unlock the potential of your savings with our SavingsZero balance accounts. Enjoy instant benefits, no minimum balance requirements, and a competitive interest rate of 6.5% p.a. Start maximizing your savings today and watch your money grow effortlessly!"
        }
        return ifConfig

    def _encode_event_vec(self, element):
        return self.mini_lm_model.encode(element).tolist()

    def _get_similarity(self, vec1, vec2):
        np_vec1 = np.array(vec1)
        np_vec2 = np.array(vec2)

        dot_product = np.dot(np_vec1, np_vec2)
        norm_vec1 = np.linalg.norm(np_vec1)
        norm_vec2 = np.linalg.norm(np_vec2)

        if norm_vec1 == 0 or norm_vec2 == 0:
            return 0.0

        similarity = dot_product / (norm_vec1 * norm_vec2)
        return similarity

    def _update_state(self, state, matched_element):
        state.add(matched_element['set_flag'])
        return state

    def updateJourney(self, sessionId, state):
        events = self._get_latest_events(sessionId, count=self.N)
        ifConfig = self._get_latest_if_config(sessionId)

        current_state = state.copy()

        for _, event in enumerate(events):
            event_element_raw = event['element']
            eventElementVec = self._encode_event_vec(event_element_raw.split(' | ')[1])

            # Get max similarity event-flag map
            max_sim = 0
            matchedElement = None

            for fs in ifConfig['flow_steps']:
                ifConfig_element_raw = fs['element']
                ifConfigElementVec = self._encode_event_vec(ifConfig_element_raw.split(' | ')[1])
                sim = self._get_similarity(eventElementVec, ifConfigElementVec)
                if sim > max_sim:
                    max_sim = sim
                    matchedElement = fs

            # Discard if below max similarity threshold
            if max_sim < self.SIM_THRESHOLD:
                matchedElement = None

            # Update state
            if matchedElement:
                current_state = self._update_state(current_state, matchedElement)

        for fum in ifConfig['flow_uiMappings']:
            flags_needed = set(fum['flags'])
            if flags_needed.issubset(current_state):
                component_id = fum['componentId']
                return {
                    'updatedState': list(current_state),
                    'components': ifConfig['flow_components'][component_id]
                }

        return {
            'updatedState': list(current_state),
            'components': None
        }


analyzer = JourneyAnalyzer(n=5, sim_threshold=0.6)


app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

class RequestModel(BaseModel):
    sessionId: str
    state: List[str]

@app.post("/update")
def update(req: RequestModel):
    return analyzer.updateJourney(req.sessionId, set(req.state))
