from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib

app = FastAPI()

# Allow Next.js server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictRequest(BaseModel):
    text: str

models = {}
toxicity_types = ['toxic', 'severe_toxic', 'obscene', 'threat', 'insult', 'identity_hate']

for toxicity_type in toxicity_types:
    models[toxicity_type] = joblib.load(f"models/{toxicity_type}_nblr.pkl")

@app.post("/predict")
def predict(request: PredictRequest):
    scores = {}
    
    for model_type in toxicity_types:
        prob = models[model_type].predict_proba([request.text])[0][1]   # extract P(X = 1)
        scores[model_type] = float(prob)

    return scores
    
