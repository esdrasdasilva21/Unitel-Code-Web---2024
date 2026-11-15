
import { useState, useEffect } from 'react'

import poster from './assets/unitel.jpg'

import {
  BookOpen,
  Smartphone,
  Lightbulb,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trophy,
  Clock,
} from 'lucide-react'

import type { LucideIcon } from 'lucide-react'

import { questions } from './data/questions'
import type { Category } from './data/questions'

import './App.css'

interface CategoryItem {
  name: Category
  description: string
  icon: LucideIcon
}

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

const QUESTION_TIME = 30

function App() {
  const [selectedCategory, setSelectedCategory] =
    useState<Category>('História')

  const [started, setStarted] = useState(false)

  const [currentQuestionIndex, setCurrentQuestionIndex] =
    useState(0)

  // Guardar as respostas de cada pergunta
  const [answers, setAnswers] = useState<Record<number, number>>({})

  const [finished, setFinished] = useState(false)

  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME)

  const [timeExpired, setTimeExpired] = useState(false)

  const categoryQuestions = questions.filter(
    (question) => question.category === selectedCategory,
  )

  const currentQuestion = categoryQuestions[currentQuestionIndex]

  // Recuperar a resposta anteriormente selecionada
  const selectedAnswer =
    answers[currentQuestionIndex] ?? null

  // Calcular a pontuação com base nas respostas guardadas
  const score = categoryQuestions.reduce((total, question, index) => {
    return total + (
      answers[index] === question.correctAnswer ? 1 : 0
    )
  }, 0)

  // Temporizador
  useEffect(() => {
    if (
      !started ||
      finished ||
      timeExpired ||
      selectedAnswer !== null
    ) {
      return
    }

    if (timeLeft <= 0) {
      setTimeExpired(true)
      return
    }

    const timer = window.setTimeout(() => {
      setTimeLeft((previousTime) => previousTime - 1)
    }, 1000)

    return () => window.clearTimeout(timer)
  }, [
    started,
    finished,
    timeExpired,
    selectedAnswer,
    timeLeft,
  ])

  // Iniciar o quiz
  function startQuiz() {
    setCurrentQuestionIndex(0)
    setAnswers({})
    setFinished(false)
    setTimeLeft(QUESTION_TIME)
    setTimeExpired(false)
    setStarted(true)
  }

  // Responder à pergunta
  function handleAnswer(answerIndex: number) {
    if (
      selectedAnswer !== null ||
      timeExpired ||
      timeLeft <= 0 ||
      !currentQuestion
    ) {
      return
    }

    setAnswers((previousAnswers) => ({
      ...previousAnswers,
      [currentQuestionIndex]: answerIndex,
    }))
  }

  // Avançar para a próxima pergunta
  function nextQuestion() {
    if (selectedAnswer === null && !timeExpired) {
      return
    }

    if (currentQuestionIndex < categoryQuestions.length - 1) {
      setCurrentQuestionIndex((previousIndex) => previousIndex + 1)
      setTimeLeft(QUESTION_TIME)
      setTimeExpired(false)
    } else {
      setFinished(true)
    }
  }

  // Regressar à pergunta anterior
  function previousQuestion() {
    if (currentQuestionIndex <= 0) {
      return
    }

    const previousIndex = currentQuestionIndex - 1

    setCurrentQuestionIndex(previousIndex)
    setTimeExpired(false)

    // Perguntas já respondidas não precisam de novo tempo.
    // Perguntas ainda não respondidas recebem um novo temporizador.
    if (answers[previousIndex] === undefined) {
      setTimeLeft(QUESTION_TIME)
    }
  }

  // Regressar às categorias
  function backToCategories() {
    setStarted(false)
    setCurrentQuestionIndex(0)
    setAnswers({})
    setFinished(false)
    setTimeLeft(QUESTION_TIME)
    setTimeExpired(false)
  }

  // Repetir o quiz
  function restartQuiz() {
    startQuiz()
  }

  // Aproveitamento final
  const percentage =
    categoryQuestions.length > 0
      ? Math.round((score / categoryQuestions.length) * 100)
      : 0

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

        {/* CARTAZ */}
        <section className="poster-section">

          <img
            src={poster}
            alt="Cartaz original do Unitel Code Web"
            className="poster-image"
          />

        </section>

        {/* PAINEL DO QUIZ */}
        <section className="w-full py-3" id="quiz">

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

          {/* CATEGORIAS */}
          {!started ? (

            <>

              <h2 className="mb-5 text-xl font-bold text-[#38204e]">
                Escolhe uma categoria
              </h2>

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

                      <span
                        className={`grid size-12 shrink-0 place-items-center rounded-xl ${
                          category.name === 'História'
                            ? 'bg-[#EAF2F4] text-[#477C91]'
                            : category.name === 'Serviços'
                              ? 'bg-[#FFF0E5] text-[#D98245]'
                              : 'bg-[#F1EAF6] text-[#8462A6]'
                        }`}
                      >

                        <Icon size={24} strokeWidth={1.7} />

                      </span>

                      <span className="grid flex-1 gap-1.5">

                        <strong className="text-sm font-bold text-[#49216c]">
                          {category.name}
                        </strong>

                        <small className="text-xs leading-relaxed text-gray-500">
                          {category.description}
                        </small>

                      </span>

                      <ArrowRight
                        size={19}
                        className="shrink-0 text-[#6d3596] transition-transform duration-200 group-hover:translate-x-1"
                      />

                    </button>

                  )
                })}

              </div>

              <button
                type="button"
                onClick={startQuiz}
                disabled={categoryQuestions.length === 0}
                className="mt-6 flex min-h-[52px] w-full items-center justify-center gap-3 rounded-lg bg-[#f47721] px-5 py-3.5 text-sm font-extrabold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#d95e0c] disabled:cursor-not-allowed disabled:opacity-50"
              >

                Começar quiz

                <ArrowRight size={19} />

              </button>

            </>

          ) : !finished && currentQuestion ? (

            /* QUESTIONÁRIO */
            <div className="mt-6 rounded-xl border border-[#e5ddea] bg-white p-5 shadow-sm sm:p-7">

              {/* INFORMAÇÕES */}
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">

                <span className="rounded-full bg-[#f1eafa] px-3 py-1.5 text-xs font-bold text-[#6d3596]">
                  {selectedCategory}
                </span>

                <div className="flex items-center gap-3">

                  <span className="text-xs font-bold text-gray-500">
                    Pergunta {currentQuestionIndex + 1} de {categoryQuestions.length}
                  </span>

                  {/* TEMPORIZADOR */}
                  <div
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-extrabold transition-colors duration-300 ${
                      timeLeft === 0
                        ? 'border-[#E8B4B4] bg-[#FCEEEE] text-[#A33E3E]'
                        : timeLeft <= 10
                          ? 'border-[#F0D2A8] bg-[#FFF3E6] text-[#A65D19]'
                          : 'border-[#DCCCEB] bg-[#F1EAF8] text-[#6D3596]'
                    }`}
                    aria-live="polite"
                    aria-label={`Tempo restante: ${timeLeft} segundos`}
                  >

                    <Clock size={17} />

                    <span>{timeLeft}s</span>

                  </div>

                </div>

              </div>

              {/* PROGRESSO */}
              <div
                className="mb-7 h-2 overflow-hidden rounded-full bg-gray-100"
                role="progressbar"
                aria-label="Progresso do questionário"
                aria-valuenow={currentQuestionIndex + 1}
                aria-valuemin={1}
                aria-valuemax={categoryQuestions.length}
              >

                <div
                  className="h-full rounded-full bg-[#6d3596] transition-all duration-300"
                  style={{
                    width: `${
                      ((currentQuestionIndex + 1) /
                        categoryQuestions.length) * 100
                    }%`,
                  }}
                />

              </div>

              {/* PERGUNTA */}
              <h2 className="mb-6 text-lg font-extrabold leading-relaxed text-[#49216c] sm:text-xl">
                {currentQuestion.question}
              </h2>

              {/* ALTERNATIVAS */}
              <div className="grid gap-3">

                {currentQuestion.options.map((option, index) => {

                  const isCorrect =
                    index === currentQuestion.correctAnswer

                  const isSelected =
                    selectedAnswer === index

                  let optionStyle =
                    'border-[#E5DDEA] bg-white text-[#49365D] hover:border-[#A98AC4] hover:bg-[#F8F5FB]'

                  if (selectedAnswer !== null && isCorrect) {
                    optionStyle =
                      'border-[#65A982] bg-[#EAF6EF] text-[#246B45]'
                  } else if (isSelected && !isCorrect) {
                    optionStyle =
                      'border-[#D98282] bg-[#FCEEEE] text-[#A33E3E]'
                  }

                  return (

                    <button
                      key={index}
                      type="button"
                      disabled={selectedAnswer !== null || timeExpired}
                      onClick={() => handleAnswer(index)}
                      className={`flex min-h-[58px] w-full items-center gap-3 rounded-lg border p-4 text-left text-sm font-medium transition-all duration-200 disabled:cursor-default ${optionStyle}`}
                    >

                      <span
                        className={`grid size-8 shrink-0 place-items-center rounded-full text-xs font-extrabold ${
                          selectedAnswer !== null && isCorrect
                            ? 'bg-[#D2EBDD] text-[#246B45]'
                            : isSelected
                              ? 'bg-white/80'
                              : 'bg-[#F1EDF5] text-[#604879]'
                        }`}
                      >

                        {String.fromCharCode(65 + index)}

                      </span>

                      <span className="flex-1">
                        {option}
                      </span>

                      {selectedAnswer !== null && isCorrect && (
                        <CheckCircle2
                          size={20}
                          className="shrink-0 text-[#39845A]"
                        />
                      )}

                      {isSelected && !isCorrect && (
                        <XCircle
                          size={20}
                          className="shrink-0 text-[#B94F4F]"
                        />
                      )}

                    </button>

                  )
                })}

              </div>

              {/* FEEDBACK */}
              {selectedAnswer !== null ? (

                <div
                  className={`mt-5 rounded-lg border p-4 ${
                    selectedAnswer === currentQuestion.correctAnswer
                      ? 'border-[#B9DCC7] bg-[#EAF6EF]'
                      : 'border-[#EBC5C5] bg-[#FCEEEE]'
                  }`}
                >

                  <div className="flex items-center gap-2">

                    {selectedAnswer === currentQuestion.correctAnswer ? (

                      <>
                        <CheckCircle2
                          size={20}
                          className="text-[#39845A]"
                        />

                        <strong className="text-sm text-[#246B45]">
                          Resposta correta!
                        </strong>
                      </>

                    ) : (

                      <>
                        <XCircle
                          size={20}
                          className="text-[#B94F4F]"
                        />

                        <strong className="text-sm text-[#A33E3E]">
                          Resposta incorreta!
                        </strong>
                      </>

                    )}

                  </div>

                  <p className="mt-2 text-sm leading-6 text-[#52645A]">
                    {currentQuestion.explanation}
                  </p>

                </div>

              ) : timeExpired ? (

                <div className="mt-5 rounded-lg border border-[#F0D2A8] bg-[#FFF3E6] p-4">

                  <div className="flex items-center gap-2">

                    <Clock
                      size={20}
                      className="text-[#A65D19]"
                    />

                    <strong className="text-sm text-[#8B4B13]">
                      Tempo esgotado!
                    </strong>

                  </div>

                  <p className="mt-2 text-sm leading-6 text-[#795B42]">
                    Não conseguiste responder dentro do tempo disponível.
                    A resposta correta era: {currentQuestion.options[currentQuestion.correctAnswer]}.
                  </p>

                  <p className="mt-2 text-sm leading-6 text-[#795B42]">
                    {currentQuestion.explanation}
                  </p>

                </div>

              ) : null}

              {/* NAVEGAÇÃO ENTRE PERGUNTAS */}
              <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">

                {/* VOLTAR */}
                <div className="flex flex-col gap-3 sm:flex-row">

                  <button
                    type="button"
                    onClick={backToCategories}
                    className="flex min-h-[46px] items-center justify-center gap-2 rounded-lg border border-[#E5DDEA] px-4 py-3 text-sm font-bold text-[#6d3596] transition-colors hover:bg-[#F8F5FB]"
                  >

                    <ArrowLeft size={17} />

                    Sair do quiz

                  </button>

                  {currentQuestionIndex > 0 && (

                    <button
                      type="button"
                      onClick={previousQuestion}
                      className="flex min-h-[46px] items-center justify-center gap-2 rounded-lg border border-[#DCCCEB] bg-[#F1EAF8] px-4 py-3 text-sm font-bold text-[#6d3596] transition-colors hover:border-[#A98AC4] hover:bg-[#E9DDF3]"
                    >

                      <ArrowLeft size={17} />

                      Pergunta anterior

                    </button>

                  )}

                </div>

                {/* AVANÇAR */}
                <button
                  type="button"
                  disabled={selectedAnswer === null && !timeExpired}
                  onClick={nextQuestion}
                  className="flex min-h-[46px] items-center justify-center gap-2 rounded-lg bg-[#f47721] px-5 py-3 text-sm font-extrabold text-white transition-colors hover:bg-[#d95e0c] disabled:cursor-not-allowed disabled:opacity-40"
                >

                  {currentQuestionIndex === categoryQuestions.length - 1
                    ? 'Ver resultado'
                    : 'Próxima pergunta'}

                  <ArrowRight size={18} />

                </button>

              </div>

            </div>

          ) : finished ? (

            /* RESULTADO FINAL */
            <div className="mt-6 rounded-xl border border-[#e5ddea] bg-white p-7 text-center shadow-sm">

              <div className="mx-auto mb-5 grid size-[76px] place-items-center rounded-full bg-[#f1eafa] text-[#6d3596]">

                <Trophy size={42} strokeWidth={1.6} />

              </div>

              <span className="text-xs font-extrabold tracking-[2px] text-amber-700">
                QUIZ CONCLUÍDO
              </span>

              <h2 className="mt-3 text-2xl font-extrabold text-[#49216c]">
                Resultado final
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Categoria: {selectedCategory}
              </p>

              <div className="my-7 rounded-xl bg-[#f7f1fc] p-6">

                <p className="text-sm font-semibold text-[#6d3596]">
                  A tua pontuação
                </p>

                <p className="mt-2 text-5xl font-extrabold text-[#49216c]">
                  {score}

                  <span className="text-2xl text-gray-400">
                    /{categoryQuestions.length}
                  </span>
                </p>

                <p className="mt-3 text-sm font-bold text-gray-600">
                  {percentage}% de aproveitamento
                </p>

              </div>

              <p className="text-sm leading-7 text-gray-600">

                {score === categoryQuestions.length
                  ? 'Excelente! Demonstraste um domínio completo dos conteúdos desta categoria.'
                  : score >= categoryQuestions.length * 0.7
                    ? 'Muito bom! Tens bons conhecimentos. Continua a aprender e a aperfeiçoar-te.'
                    : score >= categoryQuestions.length * 0.4
                      ? 'Bom esforço! Revê as explicações e tenta novamente para melhorar o teu resultado.'
                      : 'Continua a estudar! Cada tentativa é uma oportunidade para aprender mais.'}

              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">

                <button
                  type="button"
                  onClick={restartQuiz}
                  className="flex min-h-[50px] items-center justify-center gap-2 rounded-lg bg-[#f47721] px-4 py-3 text-sm font-extrabold text-white transition-colors hover:bg-[#d95e0c]"
                >

                  <RotateCcw size={18} />

                  Repetir quiz

                </button>

                <button
                  type="button"
                  onClick={backToCategories}
                  className="flex min-h-[50px] items-center justify-center gap-2 rounded-lg border border-[#e5ddea] px-4 py-3 text-sm font-bold text-[#6d3596] transition-colors hover:bg-[#f7f1fc]"
                >

                  <ArrowLeft size={18} />

                  Outras categorias

                </button>

              </div>

            </div>

          ) : (

            /* SEM PERGUNTAS */
            <div className="mt-6 rounded-xl border border-[#e5ddea] bg-white p-7 text-center shadow-sm">

              <p className="text-sm text-gray-500">
                Não existem perguntas disponíveis nesta categoria.
              </p>

              <button
                type="button"
                onClick={backToCategories}
                className="mt-5 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg bg-[#f47721] px-4 py-3 text-sm font-bold text-white"
              >

                <ArrowLeft size={18} />

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
