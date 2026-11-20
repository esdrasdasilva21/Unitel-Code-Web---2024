# Unitel Code Web

Aplicação web e API desenvolvida no âmbito do **Curso Unitel Code**, combinando interface web, materiais de aula e serviço de backend para gestão e consulta de conteúdos e categorias.

## Estrutura do Projeto

* `src/` — Código-fonte principal da aplicação (`app.js`, `index.html`, ativos e componentes).
* `backend/` — API backend (FastAPI / Python) com rotas e lógica de categorias.
* `aula1/` — Exercícios e materiais práticos de aula.
* `dist/` — Build de distribuição da aplicação.
* `imgs/` — Imagens e recursos visuais do projeto.
* `bootstrap-5.2.3-dist/` — Recursos do Bootstrap incluídos no repositório.
* `package.json` — Dependências e scripts do projeto.

## Funcionalidades e Endpoints da API

* `GET /` — Verificação de estado (*health check*) e informações básicas da API.
* `GET /health` — Verificação detalhada do estado da API e do armazenamento.
* `GET /categories` — Listagem de categorias (ex.: *História*, *Serviços* e *Conhece a Unitel*), com suporte a pesquisa (`?q=`), ordenação (`sort_by`, `order`) e paginação (`limit`, `offset`).
* `GET /categories/{category_id}` — Consulta de uma categoria específica por ID.
* `POST /categories`, `PUT /categories/{category_id}`, `PATCH /categories/{category_id}`, `DELETE /categories/{category_id}` — Operações de criação, atualização completa, atualização parcial e remoção de categorias.

## Como Executar Localmente

### 1. Clonar o repositório

```bash
git clone https://github.com/esdrasdasilva21/Unitel-Code-Web---2024.git
cd Unitel-Code-Web---2024
```

### 2. Executar o Frontend / Dependências Node

```bash
npm install
npm run dev
```

### 3. Executar o Backend (API)

Acede à pasta `backend/`, instala as dependências Python (`fastapi`, `uvicorn`, `pydantic`) e inicia o servidor:

```bash
cd backend
uvicorn main:app --reload
```

*(Ajusta `main:app` caso o ficheiro principal na pasta `backend/` tenha outro nome.)*

A documentação interativa fica disponível em `http://127.0.0.1:8000/docs`.

## Autor

**Esdras Silva** — GitHub: [@esdrasdasilva21](https://github.com/esdrasdasilva21)

## Licença

Este projeto está licenciado nos termos indicados no ficheiro `LICENSE`.
