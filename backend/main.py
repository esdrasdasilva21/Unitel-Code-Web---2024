
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


@app.get("/categories")
def get_categories():
    categories = [
        {
            "id": 1,
            "name": "História",
            "description": "Conhece a história e evolução da Unitel."
        },
        {
            "id": 2,
            "name": "Serviços",
            "description": "Descobre os serviços e soluções da Unitel."
        },
        {
            "id": 3,
            "name": "Conhece a Unitel",
            "description": "Testa os teus conhecimentos sobre a empresa."
        }
    ]

    return {
        "total": len(categories),
        "categories": categories
    }
