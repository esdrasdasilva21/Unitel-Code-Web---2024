
from fastapi import FastAPI

app = FastAPI(
    title="Unitel Code Web API",
    description="API do projeto Unitel Code Web",
    version="1.0.0"
)


@app.get("/")
def home():
    return {
        "message": "Bem-vindo à API do Unitel Code Web!",
        "status": "online"
    }
