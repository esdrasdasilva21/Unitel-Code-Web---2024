import json
import logging
import os
import time
from enum import Enum
from pathlib import Path
from typing import List, Optional

from fastapi import FastAPI, HTTPException, Query, Request, Response, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("unitel_code_web_api")


class SortField(str, Enum):
    id = "id"
    name = "name"


class SortOrder(str, Enum):
    asc = "asc"
    desc = "desc"


class Settings(BaseModel):
    app_title: str = os.getenv("APP_TITLE", "Unitel Code Web API")
    app_description: str = os.getenv(
        "APP_DESCRIPTION", "API do projeto Unitel Code Web"
    )
    app_version: str = os.getenv("APP_VERSION", "1.5.0")
    data_file: Path = Path(os.getenv("DATA_FILE", "categories_store.json"))
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
    id: Optional[int] = Field(default=None, gt=0)


class CategoryUpdate(CategoryBase):
    pass


class CategoryPatch(BaseModel):
    name: Optional[str] = Field(default=None, min_length=2, max_length=80)
    description: Optional[str] = Field(default=None, min_length=5, max_length=255)


class Category(CategoryBase):
    id: int = Field(..., gt=0)


class HealthResponse(BaseModel):
    message: str
    status: str
    version: str


class DetailedHealthResponse(BaseModel):
    status: str
    version: str
    storage_file: str
    total_categories: int


class CategoriesResponse(BaseModel):
    total: int
    limit: int
    offset: int
    categories: List[Category]


class ErrorResponse(BaseModel):
    error: str
    detail: object
    path: str


DEFAULT_CATEGORIES: List[Category] = [
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


@app.middleware("http")
async def add_process_time_and_logging(request: Request, call_next):
    start_time = time.perf_counter()
    response = await call_next(request)
    elapsed_seconds = time.perf_counter() - start_time
    response.headers["X-Process-Time"] = f"{elapsed_seconds:.4f}s"
    logger.info(
        "%s %s -> %s (%0.2f ms)",
        request.method,
        request.url.path,
        response.status_code,
        elapsed_seconds * 1000,
    )
    return response


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
    payload = ErrorResponse(
        error="HTTP_ERROR",
        detail=exc.detail,
        path=request.url.path,
    )
    return JSONResponse(
        status_code=exc.status_code,
        content=payload.model_dump(),
        headers=exc.headers,
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    request: Request, exc: RequestValidationError
) -> JSONResponse:
    payload = ErrorResponse(
        error="VALIDATION_ERROR",
        detail=exc.errors(),
        path=request.url.path,
    )
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=payload.model_dump(),
    )


class CategoryService:
    def __init__(self, storage_path: Path, initial_categories: List[Category]) -> None:
        self._storage_path = storage_path
        self._items: List[Category] = self._load_or_seed(initial_categories)

    def _load_or_seed(self, initial_categories: List[Category]) -> List[Category]:
        if not self._storage_path.exists():
            items = list(initial_categories)
            self._save_to_disk(items)
            logger.info("Ficheiro inicial criado em %s", self._storage_path)
            return items

        try:
            raw_data = json.loads(self._storage_path.read_text(encoding="utf-8"))
            items = [Category(**entry) for entry in raw_data]
            logger.info(
                "Carregadas %d categorias a partir de %s",
                len(items),
                self._storage_path,
            )
            return items
        except Exception as exc:
            logger.warning(
                "Falha ao ler %s (%s). A usar categorias padrão.",
                self._storage_path,
                exc,
            )
            return list(initial_categories)

    def _save_to_disk(self, items: Optional[List[Category]] = None) -> None:
        target = items if items is not None else self._items
        serialized = [item.model_dump() for item in target]
        self._storage_path.write_text(
            json.dumps(serialized, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )

    def _find_index(self, category_id: int) -> int:
        for idx, item in enumerate(self._items):
            if item.id == category_id:
                return idx
        return -1

    def _next_id(self) -> int:
        if not self._items:
            return 1
        return max(item.id for item in self._items) + 1

    def count(self) -> int:
        return len(self._items)

    def get_by_id(self, category_id: int) -> Optional[Category]:
        idx = self._find_index(category_id)
        return self._items[idx] if idx != -1 else None

    def list_categories(
        self,
        q: Optional[str] = None,
        limit: int = 10,
        offset: int = 0,
        sort_by: SortField = SortField.id,
        order: SortOrder = SortOrder.asc,
    ) -> CategoriesResponse:
        items = list(self._items)

        if q:
            termo = q.strip().lower()
            items = [
                cat
                for cat in items
                if termo in cat.name.lower() or termo in cat.description.lower()
            ]

        reverse = order == SortOrder.desc
        if sort_by == SortField.id:
            items.sort(key=lambda cat: cat.id, reverse=reverse)
        elif sort_by == SortField.name:
            items.sort(key=lambda cat: cat.name.lower(), reverse=reverse)

        total = len(items)
        paginated = items[offset : offset + limit]

        return CategoriesResponse(
            total=total,
            limit=limit,
            offset=offset,
            categories=paginated,
        )

    def create(self, payload: CategoryCreate) -> Category:
        category_id = payload.id if payload.id is not None else self._next_id()
        if self._find_index(category_id) != -1:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Já existe uma categoria com id {category_id}.",
            )

        new_category = Category(
            id=category_id,
            name=payload.name,
            description=payload.description,
        )
        self._items.append(new_category)
        self._save_to_disk()
        logger.info("Categoria criada: id=%s, name=%s", new_category.id, new_category.name)
        return new_category

    def update(self, category_id: int, payload: CategoryUpdate) -> Category:
        idx = self._find_index(category_id)
        if idx == -1:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Categoria com id {category_id} não encontrada.",
            )

        updated = Category(
            id=category_id,
            name=payload.name,
            description=payload.description,
        )
        self._items[idx] = updated
        self._save_to_disk()
        logger.info("Categoria atualizada: id=%s", category_id)
        return updated

    def patch(self, category_id: int, payload: CategoryPatch) -> Category:
        idx = self._find_index(category_id)
        if idx == -1:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Categoria com id {category_id} não encontrada.",
            )

        current = self._items[idx]
        updates = payload.model_dump(exclude_unset=True)
        if not updates:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Informe pelo menos um campo para atualizar ('name' ou 'description').",
            )

        updated = Category(
            id=current.id,
            name=updates.get("name", current.name),
            description=updates.get("description", current.description),
        )
        self._items[idx] = updated
        self._save_to_disk()
        logger.info("Categoria atualizada parcialmente: id=%s", category_id)
        return updated

    def delete(self, category_id: int) -> None:
        idx = self._find_index(category_id)
        if idx == -1:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Categoria com id {category_id} não encontrada.",
            )

        self._items.pop(idx)
        self._save_to_disk()
        logger.info("Categoria removida: id=%s", category_id)


category_service = CategoryService(
    storage_path=settings.data_file,
    initial_categories=DEFAULT_CATEGORIES,
)


@app.get("/", response_model=HealthResponse, tags=["Geral"])
def home() -> HealthResponse:
    return HealthResponse(
        message="Bem-vindo à API do Unitel Code Web!",
        status="online",
        version=app.version,
    )


@app.get("/health", response_model=DetailedHealthResponse, tags=["Geral"])
def health_check() -> DetailedHealthResponse:
    return DetailedHealthResponse(
        status="healthy",
        version=app.version,
        storage_file=str(settings.data_file),
        total_categories=category_service.count(),
    )


@app.get("/categories", response_model=CategoriesResponse, tags=["Categorias"])
def get_categories(
    q: Optional[str] = Query(
        default=None,
        description="Filtra categorias pelo nome ou descrição",
    ),
    limit: int = Query(
        default=10,
        ge=1,
        le=100,
        description="Quantidade máxima de itens retornados",
    ),
    offset: int = Query(
        default=0,
        ge=0,
        description="Quantidade de itens a ignorar antes de retornar",
    ),
    sort_by: SortField = Query(
        default=SortField.id,
        description="Campo de ordenação: id ou name",
    ),
    order: SortOrder = Query(
        default=SortOrder.asc,
        description="Direção da ordenação: asc ou desc",
    ),
) -> CategoriesResponse:
    return category_service.list_categories(
        q=q,
        limit=limit,
        offset=offset,
        sort_by=sort_by,
        order=order,
    )


@app.get("/categories/{category_id}", response_model=Category, tags=["Categorias"])
def get_category_by_id(category_id: int) -> Category:
    category = category_service.get_by_id(category_id)
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
    return category_service.create(payload)


@app.put("/categories/{category_id}", response_model=Category, tags=["Categorias"])
def update_category(category_id: int, payload: CategoryUpdate) -> Category:
    return category_service.update(category_id, payload)


@app.patch("/categories/{category_id}", response_model=Category, tags=["Categorias"])
def patch_category(category_id: int, payload: CategoryPatch) -> Category:
    return category_service.patch(category_id, payload)


@app.delete(
    "/categories/{category_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    tags=["Categorias"],
)
def delete_category(category_id: int) -> Response:
    category_service.delete(category_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)