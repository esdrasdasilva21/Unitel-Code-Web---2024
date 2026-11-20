import logging
import os
from typing import List, Optional

from fastapi import FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("unitel_code_web_api")


class Settings(BaseModel):
    app_title: str = os.getenv("APP_TITLE", "Unitel Code Web API")
    app_description: str = os.getenv(
        "APP_DESCRIPTION", "API do projeto Unitel Code Web"
    )
    app_version: str = os.getenv("APP_VERSION", "1.2.0")
    cors_origins: List[str] = [
        origin.strip()
        for origin in os.getenv("CORS_ORIGINS", "*").split(",")
        if origin.strip()
    ]


settings = Settings()

app = FastAPI(
    title=settings.app_title,
    description=settings.app_description,
    version=settings.app_version,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class CategoryBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=80)
    description: str = Field(..., min_length=5, max_length=255)


class CategoryCreate(CategoryBase):
    id: int = Field(..., gt=0)


class CategoryUpdate(CategoryBase):
    pass


class Category(CategoryBase):
    id: int = Field(..., gt=0)


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


def _find_category(category_id: int) -> Optional[Category]:
    return next((cat for cat in CATEGORIES if cat.id == category_id), None)


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
    category = _find_category(category_id)
    if not category:
        logger.warning("Categoria não encontrada: id=%s", category_id)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Categoria com id {category_id} não encontrada.",
        )
    return category


@app.post(
    "/categories",
    response_model=Category,
    status_code=status.HTTP_201_CREATED,
    tags=["Categorias"],
)
def create_category(payload: CategoryCreate) -> Category:
    if _find_category(payload.id):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Já existe uma categoria com id {payload.id}.",
        )

    new_category = Category(**payload.model_dump())
    CATEGORIES.append(new_category)
    logger.info("Categoria criada: id=%s, name=%s", new_category.id, new_category.name)
    return new_category


@app.put("/categories/{category_id}", response_model=Category, tags=["Categorias"])
def update_category(category_id: int, payload: CategoryUpdate) -> Category:
    category = _find_category(category_id)
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Categoria com id {category_id} não encontrada.",
        )

    category.name = payload.name
    category.description = payload.description
    logger.info("Categoria atualizada: id=%s", category_id)
    return category