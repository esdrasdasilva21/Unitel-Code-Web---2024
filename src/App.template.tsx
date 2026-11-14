
import { useState } from 'react'

import poster from '../imgs/unitel.jpg'

import {
  BookOpen,
  Smartphone,
  Lightbulb,
  ArrowRight,
  ArrowLeft,
  GraduationCap,
} from 'lucide-react'

import type { LucideIcon } from 'lucide-react'

import './App.css'

// Categorias do quiz
type Category =
  | 'História'
  | 'Serviços'
  | 'Conhece a Unitel'

// Interface das categorias
interface CategoryItem {
  name: Category
  description: string
  icon: LucideIcon
}

// Dados das categorias
const categories: CategoryItem[] = [
  {
    name: 'História',
    description: 'Descobre a origem e a evolução da Unitel.',
    icon: BookOpen,
  },
  {
    name: 'Serviços',
    description: 'Testa os teus conhecimentos sobre os serviços.',
    icon: Smartphone,
  },
  {
    name: 'Conhece a Unitel',
    description: 'Explora a identidade e o papel da Unitel.',
    icon: Lightbulb,
  },
]

// Componente principal
function App() {
  const [selectedCategory, setSelectedCategory] =
    useState<Category>('História')

  const [started, setStarted] = useState(false)

  return (
    <div className="app">

      {/* HEADER */}
      <header className="header">

        <a href="/" className="brand">
          <span className="brand-mark">U</span>
          <span>UNITEL CODE WEB</span>
        </a>

        <nav className="navigation">
          <a href="#inicio">Início</a>
          <a href="#quiz">Quiz</a>
          <a href="#sobre">Sobre</a>
        </nav>

      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="main-content" id="inicio">

        {/* CARTAZ ORIGINAL */}
        <section className="poster-section">

          <img
            src={poster}
            alt="Cartaz original do Unitel Code Web"
            className="poster-image"
          />

        </section>

        {/* PAINEL DO QUIZ */}
        <section
          className="w-full py-3"
          id="quiz"
        >

          {/* APRESENTAÇÃO */}
          <div className="mb-8">

            <span className="inline-block text-xs font-extrabold tracking-[2px] text-amber-700">
              UNITEL CODE WEB
            </span>

            <h1 className="mt-3 text-3xl font-extrabold leading-tight text-[#49216c] md:text-4xl">
              Quanto sabes sobre a Unitel?
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-7 text-gray-500">
              Aprende, descobre e testa os teus conhecimentos
              sobre uma das principais empresas de
              telecomunicações de Angola.
            </p>

          </div>

          {!started ? (

            <>

              <h2 className="mb-5 text-xl font-bold text-[#38204e]">
                Escolhe uma categoria
              </h2>

              {/* CATEGORIAS */}
              <div className="grid gap-3">

                {categories.map((category) => {

                  const Icon = category.icon

                  const isSelected =
                    selectedCategory === category.name

                  return (

                    <button
                      key={category.name}
                      type="button"
                      onClick={() =>
                        setSelectedCategory(category.name)
                      }
                      aria-pressed={isSelected}
                      className={`group flex min-h-[82px] w-full items-center gap-4 rounded-xl border p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-[#8a55b2] hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6d3596] ${
                        isSelected
                          ? 'border-2 border-[#6d3596] bg-[#f7f1fc]'
                          : 'border-[#e8e1ef] bg-white'
                      }`}
                    >

                      {/* ÍCONE DA CATEGORIA */}
                      <span
                        className={`grid size-12 shrink-0 place-items-center rounded-xl ${
                          category.name === 'História'
                            ? 'bg-[#EAF2F4] text-[#477C91]'
                            : category.name === 'Serviços'
                              ? 'bg-[#FFF0E5] text-[#D98245]'
                              : 'bg-[#F1EAF6] text-[#8462A6]'
                        }`}
                      >

                        <Icon
                          size={24}
                          strokeWidth={1.7}
                        />

                      </span>

                      {/* INFORMAÇÕES */}
                      <span className="grid flex-1 gap-1.5">

                        <strong className="text-sm font-bold text-[#49216c]">
                          {category.name}
                        </strong>

                        <small className="text-xs leading-relaxed text-gray-500">
                          {category.description}
                        </small>

                      </span>

                      {/* SETA */}
                      <ArrowRight
                        size={19}
                        className="shrink-0 text-[#6d3596] transition-transform duration-200 group-hover:translate-x-1"
                      />

                    </button>

                  )

                })}

              </div>

              {/* BOTÃO COMEÇAR */}
              <button
                type="button"
                onClick={() => setStarted(true)}
                className="mt-6 flex min-h-[52px] w-full items-center justify-center gap-3 rounded-lg bg-[#f47721] px-5 py-3.5 text-sm font-extrabold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#d95e0c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6d3596]"
              >

                Começar quiz

                <ArrowRight size={19} />

              </button>

            </>

          ) : (

            /* APRESENTAÇÃO DA CATEGORIA SELECIONADA */
            <div className="mt-6 rounded-xl border border-[#e8e1ef] bg-white p-7 text-center shadow-sm">

              <div className="mx-auto mb-5 grid size-[72px] place-items-center rounded-full bg-[#f1eafa] text-[#6d3596]">

                <GraduationCap
                  size={42}
                  strokeWidth={1.6}
                />

              </div>

              <span className="text-xs font-extrabold tracking-[2px] text-amber-700">
                CATEGORIA SELECIONADA
              </span>

              <h2 className="mt-3 text-xl font-bold text-[#49216c]">
                {selectedCategory}
              </h2>

              <p className="mt-3 text-sm leading-7 text-gray-500">
                Preparado para testar os teus conhecimentos?
                O questionário desta categoria será apresentado
                nesta área.
              </p>

              <button
                type="button"
                onClick={() => setStarted(false)}
                className="mt-6 flex min-h-[52px] w-full items-center justify-center gap-3 rounded-lg bg-[#f47721] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#d95e0c]"
              >

                <ArrowLeft size={19} />

                Voltar às categorias

              </button>

            </div>

          )}

        </section>

      </main>

      {/* FOOTER */}
      <footer className="footer" id="sobre">

        <div>

          <strong>UNITEL CODE WEB</strong>

          <p>
            Aprender tecnologia. Conhecer a Unitel.
          </p>

        </div>

        <div className="footer-info">

          <span>
            © {new Date().getFullYear()} Unitel Code Web
          </span>

        </div>

      </footer>

    </div>
  )
}

export default App


