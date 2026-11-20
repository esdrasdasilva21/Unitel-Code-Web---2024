from typing import List, Optional
from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel, Field

app = FastAPI(
    title="Unitel Code Web API",
    description="API do projeto Unitel Code Web",
    version="1.1.0",
)


class Category(BaseModel):
    id: int = Field(..., gt=0)
    name: str = Field(..., min_length=2, max_length=80)
    description: str = Field(..., min_length=5, max_length=255)


class HealthResponse(BaseModel):
    message: str
    status: str
    version: str


class CategoriesResponse(BaseModel):
    total: int
    categories: List[Category]


CATEGORIES: List[Category] = [
    Category(
        id=1,
        name="História",
        description="Conhece a história e evolução da Unitel.",
    ),
    Category(
        id=2,
        name="Serviços",
        description="Descobre os serviços e soluções da Unitel.",
    ),
    Category(
        id=3,
        name="Conhece a Unitel",
        description="Testa os teus conhecimentos sobre a empresa.",
    ),
]


@app.get("/", response_model=HealthResponse, tags=["Geral"])
def home() -> HealthResponse:
    return HealthResponse(
        message="Bem-vindo à API do Unitel Code Web!",
        status="online",
        version=app.version,
    )


@app.get("/categories", response_model=CategoriesResponse, tags=["Categorias"])
def get_categories(
    q: Optional[str] = Query(
        default=None,
        description="Filtra categorias pelo nome ou descrição",
    )
) -> CategoriesResponse:
    if q:
        termo = q.strip().lower()
        filtered = [
            cat
            for cat in CATEGORIES
            if termo in cat.name.lower() or termo in cat.description.lower()
        ]
    else:
        filtered = CATEGORIES

    return CategoriesResponse(
        total=len(filtered),
        categories=filtered,
    )


@app.get("/categories/{category_id}", response_model=Category, tags=["Categorias"])
def get_category_by_id(category_id: int) -> Category:
    for category in CATEGORIES:
        if category.id == category_id:
            return category
    raise HTTPException(
        status_code=404,
        detail=f"Categoria com id {category_id} não encontrada.",
    )