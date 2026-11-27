import hmac
import json
import logging
import os
import tempfile
import time
import uuid
from enum import Enum
from pathlib import Path
from typing import List, Optional

from fastapi import Depends, FastAPI, Header, HTTPException, Query, Request, Response, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field, field_validator

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
    app_version: str = os.getenv("APP_VERSION", "1.7.0")
    data_file: Path = Path(os.getenv("DATA_FILE", "categories_store.json"))
    api_write_key: Optional[str] = os.getenv("API_WRITE_KEY") or None
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


def _clean_non_empty_text(value: str, field_label: str) -> str:
    cleaned = value.strip()
    if not cleaned:
        raise ValueError(f"O campo '{field_label}' não pode ficar vazio.")
    return cleaned


class CategoryBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=80)
    description: str = Field(..., min_length=5, max_length=255)

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        return _clean_non_empty_text(v, "name")

    @field_validator("description")
    @classmethod
    def validate_description(cls, v: str) -> str:
        return _clean_non_empty_text(v, "description")


class CategoryCreate(CategoryBase):
    id: Optional[int] = Field(default=None, gt=0)


class CategoryUpdate(CategoryBase):
    pass


class CategoryPatch(BaseModel):
    name: Optional[str] = Field(default=None, min_length=2, max_length=80)
    description: Optional[str] = Field(default=None, min_length=5, max_length=255)

    @field_validator("name")
    @classmethod
    def validate_optional_name(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return None
        return _clean_non_empty_text(v, "name")

    @field_validator("description")
    @classmethod
    def validate_optional_description(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return None
        return _clean_non_empty_text(v, "description")


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
    write_auth_enabled: bool


class CategoriesResponse(BaseModel):
    total: int
    limit: int
    offset: int
    categories: List[Category]


class ErrorResponse(BaseModel):
    error: str
    detail: object
    path: str
    request_id: Optional[str] = None


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
async def add_request_context_and_logging(request: Request, call_next):
    request_id = request.headers.get("X-Request-ID") or str(uuid.uuid4())
    request.state.request_id = request_id

    start_time = time.perf_counter()
    response = await call_next(request)
    elapsed_seconds = time.perf_counter() - start_time

    response.headers["X-Request-ID"] = request_id
    response.headers["X-Process-Time"] = f"{elapsed_seconds:.4f}s"

    logger.info(
        "[%s] %s %s -> %s (%0.2f ms)",
        request_id,
        request.method,
        request.url.path,
        response.status_code,
        elapsed_seconds * 1000,
    )
    return response


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
    request_id = getattr(request.state, "request_id", None)
    payload = ErrorResponse(
        error="HTTP_ERROR",
        detail=exc.detail,
        path=request.url.path,
        request_id=request_id,
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
    request_id = getattr(request.state, "request_id", None)
    payload = ErrorResponse(
        error="VALIDATION_ERROR",
        detail=exc.errors(),
        path=request.url.path,
        request_id=request_id,
    )
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=payload.model_dump(),
    )


updates = payload.model_dump(
    exclude_unset=True,
    exclude_none=True,
)

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
        content = json.dumps(serialized, ensure_ascii=False, indent=2)

        parent_dir = self._storage_path.parent or Path(".")
        parent_dir.mkdir(parents=True, exist_ok=True)

        fd, tmp_name = tempfile.mkstemp(
            dir=str(parent_dir),
            prefix=f".{self._storage_path.name}.",
            suffix=".tmp",
        )
        try:
            with os.fdopen(fd, "w", encoding="utf-8") as tmp_file:
                tmp_file.write(content)
                tmp_file.flush()
                os.fsync(tmp_file.fileno())
            os.replace(tmp_name, self._storage_path)
        except Exception:
            if os.path.exists(tmp_name):
                os.remove(tmp_name)
            raise

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


def get_category_service() -> CategoryService:
    return category_service


def require_write_api_key(
    x_api_key: Optional[str] = Header(default=None, alias="X-API-Key"),
) -> None:
    if not settings.api_write_key:
        return
    if not x_api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Cabeçalho 'X-API-Key' obrigatório para operações de escrita.",
        )
    if not hmac.compare_digest(x_api_key, settings.api_write_key):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Chave 'X-API-Key' inválida.",
        )


@app.get("/", response_model=HealthResponse, tags=["Geral"])
def home() -> HealthResponse:
    return HealthResponse(
        message="Bem-vindo à API do Unitel Code Web!",
        status="online",
        version=app.version,
    )


@app.get("/health", response_model=DetailedHealthResponse, tags=["Geral"])
def health_check(
    service: CategoryService = Depends(get_category_service),
) -> DetailedHealthResponse:
    return DetailedHealthResponse(
        status="healthy",
        version=app.version,
        storage_file=str(settings.data_file),
        total_categories=service.count(),
        write_auth_enabled=bool(settings.api_write_key),
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
    service: CategoryService = Depends(get_category_service),
) -> CategoriesResponse:
    return service.list_categories(
        q=q,
        limit=limit,
        offset=offset,
        sort_by=sort_by,
        order=order,
    )


@app.get("/categories/{category_id}", response_model=Category, tags=["Categorias"])
def get_category_by_id(
    category_id: int,
    service: CategoryService = Depends(get_category_service),
) -> Category:
    category = service.get_by_id(category_id)
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
    dependencies=[Depends(require_write_api_key)],
    tags=["Categorias"],
)
def create_category(
    payload: CategoryCreate,
    service: CategoryService = Depends(get_category_service),
) -> Category:
    return service.create(payload)


@app.put(
    "/categories/{category_id}",
    response_model=Category,
    dependencies=[Depends(require_write_api_key)],
    tags=["Categorias"],
)
def update_category(
    category_id: int,
    payload: CategoryUpdate,
    service: CategoryService = Depends(get_category_service),
) -> Category:
    return service.update(category_id, payload)


@app.patch(
    "/categories/{category_id}",
    response_model=Category,
    dependencies=[Depends(require_write_api_key)],
    tags=["Categorias"],
)
def patch_category(
    category_id: int,
    payload: CategoryPatch,
    service: CategoryService = Depends(get_category_service),
) -> Category:
    return service.patch(category_id, payload)


@app.delete(
    "/categories/{category_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_write_api_key)],
    tags=["Categorias"],
)
def delete_category(
    category_id: int,
    service: CategoryService = Depends(get_category_service),
) -> Response:
    service.delete(category_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)