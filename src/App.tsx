
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

// Tempo disponível por pergunta
const QUESTION_TIME = 30

// Componente principal
function App() {
  // Categoria selecionada
  const [selectedCategory, setSelectedCategory] =
    useState<Category>('História')

  // Estado do questionário
  const [started, setStarted] = useState(false)

  // Índice da pergunta atual
  const [currentQuestionIndex, setCurrentQuestionIndex] =
    useState(0)

  // Resposta selecionada
  const [selectedAnswer, setSelectedAnswer] =
    useState<number | null>(null)

  // Pontuação
  const [score, setScore] = useState(0)

  // Estado de conclusão
  const [finished, setFinished] = useState(false)

  // Tempo restante
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME)

  // Estado de tempo esgotado
  const [timeExpired, setTimeExpired] = useState(false)

  // Filtrar perguntas da categoria selecionada
  const categoryQuestions = questions.filter(
    (question) => question.category === selectedCategory,
  )

  // Obter pergunta atual
  const currentQuestion =
    categoryQuestions[currentQuestionIndex]

  // Temporizador automático
  useEffect(() => {
    // Não executar o temporizador nestas situações
    if (
      !started ||
      finished ||
      timeExpired ||
      selectedAnswer !== null
    ) {
      return
    }

    // Quando o tempo chega a zero
    if (timeLeft <= 0) {
      setTimeExpired(true)
      return
    }

    // Diminuir um segundo
    const timer = window.setTimeout(() => {
      setTimeLeft((previousTime) => previousTime - 1)
    }, 1000)

    // Limpar o temporizador anterior
    return () => window.clearTimeout(timer)

  }, [
    started,
    finished,
    timeExpired,
    selectedAnswer,
    timeLeft,
  ])

  // Iniciar o questionário
  function startQuiz() {
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setScore(0)
    setFinished(false)
    setTimeLeft(QUESTION_TIME)
    setTimeExpired(false)
    setStarted(true)
  }

  // Selecionar resposta
  function handleAnswer(answerIndex: number) {
    if (
      selectedAnswer !== null ||
      timeExpired ||
      timeLeft <= 0 ||
      !currentQuestion
    ) {
      return
    }

    setSelectedAnswer(answerIndex)

    // Verificar resposta correta
    if (answerIndex === currentQuestion.correctAnswer) {
      setScore((previousScore) => previousScore + 1)
    }
  }

  // Avançar para a próxima pergunta
  function nextQuestion() {
    if (selectedAnswer === null && !timeExpired) {
      return
    }

    if (currentQuestionIndex < categoryQuestions.length - 1) {
      setCurrentQuestionIndex((previousIndex) => previousIndex + 1)
      setSelectedAnswer(null)
      setTimeLeft(QUESTION_TIME)
      setTimeExpired(false)
    } else {
      setFinished(true)
    }
  }

  // Regressar à seleção de categorias
  function backToCategories() {
    setStarted(false)
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setScore(0)
    setFinished(false)
    setTimeLeft(QUESTION_TIME)
    setTimeExpired(false)
  }

  // Repetir o questionário
  function restartQuiz() {
    startQuiz()
  }

  // Calcular aproveitamento
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

          {/* SELEÇÃO DE CATEGORIAS */}
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
                onClick={startQuiz}
                disabled={categoryQuestions.length === 0}
                className="mt-6 flex min-h-[52px] w-full items-center justify-center gap-3 rounded-lg bg-[#f47721] px-5 py-3.5 text-sm font-extrabold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#d95e0c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6d3596] disabled:cursor-not-allowed disabled:opacity-50"
              >

                Começar quiz

                <ArrowRight size={19} />

              </button>

            </>

          ) : !finished && currentQuestion ? (

            /* QUESTIONÁRIO */
            <div className="mt-6 rounded-xl border border-[#e8e1ef] bg-white p-5 shadow-sm sm:p-7">

              {/* INFORMAÇÕES DA PERGUNTA */}
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
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-extrabold ${
                      timeLeft <= 10
                        ? 'bg-red-50 text-red-600'
                        : 'bg-[#f1eafa] text-[#6d3596]'
                    }`}
                    aria-live="polite"
                    aria-label={`Tempo restante: ${timeLeft} segundos`}
                  >

                    <Clock size={17} />

                    <span>
                      {timeLeft}s
                    </span>

                  </div>

                </div>

              </div>

              {/* BARRA DE PROGRESSO */}
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

              {/* ENUNCIADO */}
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
                    'border-[#e8e1ef] bg-white hover:border-[#8a55b2] hover:bg-[#faf7fd]'

                  if (selectedAnswer !== null && isCorrect) {
                    optionStyle =
                      'border-green-500 bg-green-50 text-green-800'
                  } else if (isSelected && !isCorrect) {
                    optionStyle =
                      'border-red-400 bg-red-50 text-red-800'
                  }

                  return (

                    <button
                      key={index}
                      type="button"
                      disabled={selectedAnswer !== null || timeExpired}
                      onClick={() => handleAnswer(index)}
                      className={`flex min-h-[58px] w-full items-center gap-3 rounded-lg border p-4 text-left text-sm font-medium transition-all duration-200 disabled:cursor-default ${optionStyle}`}
                    >

                      {/* LETRA DA ALTERNATIVA */}
                      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-gray-100 text-xs font-extrabold text-[#49216c]">
                        {String.fromCharCode(65 + index)}
                      </span>

                      {/* TEXTO DA ALTERNATIVA */}
                      <span className="flex-1">
                        {option}
                      </span>

                      {/* INDICADOR DE RESPOSTA */}
                      {selectedAnswer !== null && isCorrect && (

                        <CheckCircle2
                          size={20}
                          className="shrink-0 text-green-600"
                        />

                      )}

                      {isSelected && !isCorrect && (

                        <XCircle
                          size={20}
                          className="shrink-0 text-red-500"
                        />

                      )}

                    </button>

                  )

                })}

              </div>

              {/* FEEDBACK DA RESPOSTA */}
              {selectedAnswer !== null ? (

                <div
                  className={`mt-5 rounded-lg border p-4 ${
                    selectedAnswer === currentQuestion.correctAnswer
                      ? 'border-green-200 bg-green-50'
                      : 'border-red-200 bg-red-50'
                  }`}
                >

                  <div className="flex items-center gap-2">

                    {selectedAnswer === currentQuestion.correctAnswer ? (

                      <>
                        <CheckCircle2
                          size={20}
                          className="text-green-600"
                        />

                        <strong className="text-sm text-green-800">
                          Resposta correta!
                        </strong>
                      </>

                    ) : (

                      <>
                        <XCircle
                          size={20}
                          className="text-red-600"
                        />

                        <strong className="text-sm text-red-800">
                          Resposta incorreta!
                        </strong>
                      </>

                    )}

                  </div>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {currentQuestion.explanation}
                  </p>

                </div>

              ) : timeExpired ? (

                <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-4">

                  <div className="flex items-center gap-2">

                    <Clock
                      size={20}
                      className="text-amber-600"
                    />

                    <strong className="text-sm text-amber-800">
                      Tempo esgotado!
                    </strong>

                  </div>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    Não conseguiste responder dentro do tempo disponível.
                    A resposta correta era: {currentQuestion.options[currentQuestion.correctAnswer]}.
                  </p>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {currentQuestion.explanation}
                  </p>

                </div>

              ) : null}

              {/* NAVEGAÇÃO */}
              <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">

                <button
                  type="button"
                  onClick={backToCategories}
                  className="flex min-h-[46px] items-center justify-center gap-2 rounded-lg border border-[#e8e1ef] px-4 py-3 text-sm font-bold text-[#6d3596] transition-colors hover:bg-[#f7f1fc]"
                >

                  <ArrowLeft size={17} />

                  Sair do quiz

                </button>

                <button
                  type="button"
                  disabled={selectedAnswer === null && !timeExpired}
                  onClick={nextQuestion}
                  className="flex min-h-[46px] items-center justify-center gap-2 rounded-lg bg-[#f47721] px-5 py-3 text-sm font-extrabold text-white transition-colors hover:bg-[#d95e0c] disabled:cursor-not-allowed disabled:opacity-40"
                >

                  {timeExpired
                    ? currentQuestionIndex === categoryQuestions.length - 1
                      ? 'Ver resultado'
                      : 'Continuar'
                    : currentQuestionIndex === categoryQuestions.length - 1
                      ? 'Ver resultado'
                      : 'Próxima pergunta'}

                  <ArrowRight size={18} />

                </button>

              </div>

            </div>

          ) : finished ? (

            /* RESULTADO FINAL */
            <div className="mt-6 rounded-xl border border-[#e8e1ef] bg-white p-7 text-center shadow-sm">

              {/* ÍCONE */}
              <div className="mx-auto mb-5 grid size-[76px] place-items-center rounded-full bg-[#f1eafa] text-[#6d3596]">

                <Trophy
                  size={42}
                  strokeWidth={1.6}
                />

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

              {/* PONTUAÇÃO */}
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

              {/* MENSAGEM FINAL */}
              <p className="text-sm leading-7 text-gray-600">

                {score === categoryQuestions.length
                  ? 'Excelente! Demonstraste um domínio completo dos conteúdos desta categoria.'
                  : score >= categoryQuestions.length * 0.7
                    ? 'Muito bom! Tens bons conhecimentos. Continua a aprender e a aperfeiçoar-te.'
                    : score >= categoryQuestions.length * 0.4
                      ? 'Bom esforço! Revê as explicações e tenta novamente para melhorar o teu resultado.'
                      : 'Continua a estudar! Cada tentativa é uma oportunidade para aprender mais.'}

              </p>

              {/* AÇÕES FINAIS */}
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
                  className="flex min-h-[50px] items-center justify-center gap-2 rounded-lg border border-[#e8e1ef] px-4 py-3 text-sm font-bold text-[#6d3596] transition-colors hover:bg-[#f7f1fc]"
                >

                  <ArrowLeft size={18} />

                  Outras categorias

                </button>

              </div>

            </div>

          ) : (

            /* ESTADO SEM PERGUNTAS */
            <div className="mt-6 rounded-xl border border-[#e8e1ef] bg-white p-7 text-center shadow-sm">

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
