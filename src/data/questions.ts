
export type Category =
  | 'História'
  | 'Serviços'
  | 'Conhece a Unitel'

export type SourceType =
  | 'historical'
  | 'documented'
  | 'educational'

export interface Question {
  id: number
  category: Category
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  sourceType: SourceType
  source: string
}

export const questions: Question[] = [
  // ==========================================
  // CATEGORIA 1 — HISTÓRIA
  // ==========================================

  {
    id: 1,
    category: 'História',
    question: 'Em que ano foi constituída a Unitel?',
    options: ['1995', '1998', '2001', '2004'],
    correctAnswer: 1,
    explanation:
      'A Unitel foi constituída em 1998, antes de iniciar a sua atividade comercial no mercado angolano.',
    sourceType: 'historical',
    source: 'Texto de referência sobre a história da Unitel fornecido pelo utilizador.',
  },
  {
    id: 2,
    category: 'História',
    question: 'Em que ano a Unitel entrou no mercado angolano?',
    options: ['1998', '2000', '2001', '2005'],
    correctAnswer: 2,
    explanation:
      'A Unitel entrou no mercado angolano em 2001.',
    sourceType: 'historical',
    source: 'Texto de referência sobre a história da Unitel fornecido pelo utilizador.',
  },
  {
    id: 3,
    category: 'História',
    question: 'Qual foi a tecnologia de comunicação móvel utilizada pela Unitel na sua entrada no mercado?',
    options: ['CDMA', '5G', 'GSM', 'Satélite'],
    correctAnswer: 2,
    explanation:
      'A Unitel foi a primeira operadora de telefonia móvel GSM em Angola.',
    sourceType: 'historical',
    source: 'Texto de referência sobre a história da Unitel fornecido pelo utilizador.',
  },
  {
    id: 4,
    category: 'História',
    question: 'Em que período de 2001 a Unitel já liderava em número de clientes?',
    options: [
      'Primeiro trimestre',
      'Segundo trimestre',
      'Terceiro trimestre',
      'Quarto trimestre',
    ],
    correctAnswer: 2,
    explanation:
      'Segundo o texto de referência, a Unitel alcançou a liderança em número de clientes no terceiro trimestre de 2001.',
    sourceType: 'historical',
    source: 'Texto de referência sobre a história da Unitel fornecido pelo utilizador.',
  },
  {
    id: 5,
    category: 'História',
    question: 'Em dezembro de 2004, qual foi um dos marcos da expansão da cobertura da Unitel?',
    options: [
      'Cobertura em todos os bairros de Luanda',
      'Cobertura nas capitais das 18 províncias',
      'Lançamento da rede 4G',
      'Cobertura em todos os países africanos',
    ],
    correctAnswer: 1,
    explanation:
      'Em dezembro de 2004, a cobertura da Unitel alcançava as capitais das 18 províncias de Angola.',
    sourceType: 'historical',
    source: 'Texto de referência sobre a história da Unitel fornecido pelo utilizador.',
  },
  {
    id: 6,
    category: 'História',
    question: 'Em que ano a cobertura da Unitel chegou a todas as sedes municipais de Angola?',
    options: ['2004', '2007', '2009', '2011'],
    correctAnswer: 3,
    explanation:
      'O texto de referência indica que, em dezembro de 2011, a cobertura chegava a todas as sedes municipais.',
    sourceType: 'historical',
    source: 'Texto de referência sobre a história da Unitel fornecido pelo utilizador.',
  },
  {
    id: 7,
    category: 'História',
    question: 'Em que mês e ano foi realizada uma atualização do registo de dados pessoais dos clientes da Unitel mencionada no texto?',
    options: [
      'Janeiro de 2014',
      'Dezembro de 2014',
      'Março de 2015',
      'Junho de 2016',
    ],
    correctAnswer: 2,
    explanation:
      'A atualização do registo de dados pessoais mencionada ocorreu em março de 2015.',
    sourceType: 'historical',
    source: 'Texto de referência sobre a história da Unitel fornecido pelo utilizador.',
  },
  {
    id: 8,
    category: 'História',
    question: 'Qual era um dos objetivos da atualização do registo de dados pessoais dos clientes?',
    options: [
      'Eliminar os serviços de comunicação móvel',
      'Prevenir a utilização abusiva das redes e dos serviços',
      'Substituir todos os cartões SIM',
      'Limitar o acesso à internet',
    ],
    correctAnswer: 1,
    explanation:
      'A atualização procurava prevenir utilizações abusivas e melhorar a prestação dos serviços.',
    sourceType: 'historical',
    source: 'Texto de referência sobre a história da Unitel fornecido pelo utilizador.',
  },
  {
    id: 9,
    category: 'História',
    question: 'Em 2020, que empresa adquiriu a participação de 25% do Grupo Oi na Unitel?',
    options: [
      'Sonangol',
      'Banco Nacional de Angola',
      'MSTelcom',
      'INACOM',
    ],
    correctAnswer: 0,
    explanation:
      'Em janeiro de 2020, a Sonangol adquiriu a participação de 25% do Grupo Oi na Unitel.',
    sourceType: 'historical',
    source: 'Texto de referência sobre a história da Unitel fornecido pelo utilizador.',
  },
  {
    id: 10,
    category: 'História',
    question: 'Que aconteceu em outubro de 2022 relativamente às participações da Vidatel e da Geni na Unitel?',
    options: [
      'Foram vendidas ao Grupo Oi',
      'Foram transferidas para uma empresa estrangeira',
      'Foram convertidas em ações públicas',
      'Foram nacionalizadas e transferidas para o Estado',
    ],
    correctAnswer: 3,
    explanation:
      'Em outubro de 2022, as participações da Vidatel e da Geni foram nacionalizadas e transferidas para o Estado.',
    sourceType: 'historical',
    source: 'Texto de referência sobre a história da Unitel fornecido pelo utilizador.',
  },

  // ==========================================
  // CATEGORIA 2 — SERVIÇOS
  // ==========================================

  {
    id: 11,
    category: 'Serviços',
    question: 'Qual é a principal função de um cartão SIM num telemóvel?',
    options: [
      'Aumentar a capacidade da bateria',
      'Identificar e autenticar o assinante na rede móvel',
      'Melhorar a qualidade da câmara',
      'Armazenar ficheiros do sistema operativo',
    ],
    correctAnswer: 1,
    explanation:
      'O cartão SIM contém informações que permitem identificar e autenticar o assinante na rede móvel.',
    sourceType: 'educational',
    source: 'Conhecimento geral sobre telecomunicações.',
  },
  {
    id: 12,
    category: 'Serviços',
    question: 'O que significa a sigla 4G nas telecomunicações?',
    options: [
      'Quarta geração de redes móveis',
      'Quatro grupos de comunicação',
      'Quarta frequência global',
      'Sistema de quatro antenas',
    ],
    correctAnswer: 0,
    explanation:
      '4G significa quarta geração de tecnologia de comunicação móvel.',
    sourceType: 'educational',
    source: 'Conhecimento geral sobre telecomunicações.',
  },
  {
    id: 13,
    category: 'Serviços',
    question: 'O que é necessário para assistir a vídeos online através de um telemóvel?',
    options: [
      'Apenas um cartão de memória',
      'Uma ligação à internet por dados móveis ou Wi-Fi',
      'Uma ligação Bluetooth',
      'Um cabo USB ligado a um computador',
    ],
    correctAnswer: 1,
    explanation:
      'O streaming de vídeos exige uma ligação à internet, que pode ser feita através de dados móveis ou Wi-Fi.',
    sourceType: 'educational',
    source: 'Conhecimento geral sobre serviços digitais.',
  },
  {
    id: 14,
    category: 'Serviços',
    question: 'O que significa roaming nas telecomunicações?',
    options: [
      'Utilizar serviços móveis através de uma rede de outra operadora, geralmente fora da rede habitual',
      'Aumentar automaticamente a memória do telemóvel',
      'Transferir contactos entre dois dispositivos',
      'Bloquear chamadas internacionais',
    ],
    correctAnswer: 0,
    explanation:
      'O roaming permite utilizar serviços móveis através de redes de outras operadoras, conforme os acordos existentes.',
    sourceType: 'educational',
    source: 'Conhecimento geral sobre telecomunicações.',
  },
  {
    id: 15,
    category: 'Serviços',
    question: 'Qual é a principal finalidade de uma rede Wi-Fi?',
    options: [
      'Carregar a bateria do telemóvel',
      'Permitir a ligação sem fios a uma rede',
      'Substituir o cartão SIM',
      'Aumentar a resolução do ecrã',
    ],
    correctAnswer: 1,
    explanation:
      'O Wi-Fi permite ligar dispositivos a uma rede sem necessidade de uma ligação física por cabo.',
    sourceType: 'educational',
    source: 'Conhecimento geral sobre redes informáticas.',
  },
  {
    id: 16,
    category: 'Serviços',
    question: 'Uma empresa que necessita de uma ligação estável à internet para as suas operações pode considerar:',
    options: [
      'Um serviço de internet fixa',
      'Apenas uma ligação Bluetooth',
      'Um cartão de memória',
      'Um dispositivo sem ligação à rede',
    ],
    correctAnswer: 0,
    explanation:
      'Uma ligação fixa pode ser adequada para empresas que necessitam de conectividade estável e contínua.',
    sourceType: 'educational',
    source: 'Conhecimento geral sobre serviços de conectividade.',
  },
  {
    id: 17,
    category: 'Serviços',
    question: 'Como é que a fibra óptica transmite informação?',
    options: [
      'Através de ondas sonoras',
      'Através de sinais luminosos',
      'Através de correntes de água',
      'Através de cartões magnéticos',
    ],
    correctAnswer: 1,
    explanation:
      'A fibra óptica transmite dados através de pulsos de luz que percorrem fibras muito finas.',
    sourceType: 'educational',
    source: 'Conhecimento geral sobre tecnologias de transmissão.',
  },
  {
    id: 18,
    category: 'Serviços',
    question: 'Qual é uma das vantagens de uma aplicação de autoatendimento de uma operadora?',
    options: [
      'Permitir que o cliente realize determinadas operações sem recorrer diretamente a um funcionário',
      'Eliminar a necessidade de internet em todos os dispositivos',
      'Substituir o sistema operativo do telemóvel',
      'Impedir o cliente de consultar informações',
    ],
    correctAnswer: 0,
    explanation:
      'As aplicações de autoatendimento permitem aos clientes consultar informações e realizar operações de forma autónoma.',
    sourceType: 'educational',
    source: 'Conhecimento geral sobre serviços digitais e atendimento.',
  },
  {
    id: 19,
    category: 'Serviços',
    question: 'O que representa a largura de banda de uma ligação à internet?',
    options: [
      'O tamanho físico do router',
      'A capacidade de transmissão de dados num determinado período',
      'A quantidade de aplicações instaladas',
      'A duração da bateria do dispositivo',
    ],
    correctAnswer: 1,
    explanation:
      'A largura de banda representa a capacidade de transmissão de dados por unidade de tempo.',
    sourceType: 'educational',
    source: 'Conhecimento geral sobre redes de comunicação.',
  },
  {
    id: 20,
    category: 'Serviços',
    question: 'Se a internet móvel estiver lenta, qual é uma das primeiras verificações recomendadas?',
    options: [
      'Apagar todos os contactos',
      'Verificar a cobertura e a intensidade do sinal da rede',
      'Formatar imediatamente o telemóvel',
      'Desinstalar todas as aplicações',
    ],
    correctAnswer: 1,
    explanation:
      'A cobertura e a intensidade do sinal podem influenciar diretamente a qualidade da ligação móvel.',
    sourceType: 'educational',
    source: 'Conhecimento geral sobre diagnóstico de conectividade.',
  },

  // ==========================================
  // CATEGORIA 3 — CONHECE A UNITEL
  // ==========================================

  {
    id: 21,
    category: 'Conhece a Unitel',
    question: 'Em que setor de atividade se enquadra a Unitel?',
    options: [
      'Agricultura',
      'Telecomunicações',
      'Indústria automóvel',
      'Construção civil',
    ],
    correctAnswer: 1,
    explanation:
      'A Unitel é uma empresa angolana que atua no setor das telecomunicações.',
    sourceType: 'documented',
    source: 'Texto de referência sobre a Unitel fornecido pelo utilizador.',
  },
  {
    id: 22,
    category: 'Conhece a Unitel',
    question: 'Qual é a principal finalidade de uma empresa de telecomunicações?',
    options: [
      'Facilitar a comunicação e a transmissão de informação',
      'Produzir exclusivamente equipamentos agrícolas',
      'Construir estradas e pontes',
      'Gerir exclusivamente instituições bancárias',
    ],
    correctAnswer: 0,
    explanation:
      'As empresas de telecomunicações disponibilizam infraestruturas e serviços que permitem a comunicação e a transmissão de informação.',
    sourceType: 'educational',
    source: 'Conhecimento geral sobre o setor das telecomunicações.',
  },
  {
    id: 23,
    category: 'Conhece a Unitel',
    question: 'Como é que a conectividade pode contribuir para a educação?',
    options: [
      'Impedindo o acesso a materiais de estudo',
      'Facilitando o acesso a plataformas e recursos educativos',
      'Eliminando a necessidade de aprendizagem',
      'Substituindo todas as instituições de ensino',
    ],
    correctAnswer: 1,
    explanation:
      'A conectividade permite aceder a plataformas de aprendizagem, bibliotecas digitais e outros recursos educativos.',
    sourceType: 'educational',
    source: 'Conhecimento geral sobre inclusão digital e educação.',
  },
  {
    id: 24,
    category: 'Conhece a Unitel',
    question: 'O que é VoIP?',
    options: [
      'Uma tecnologia que permite realizar chamadas através da internet',
      'Um sistema de carregamento de baterias',
      'Um tipo de cartão de memória',
      'Uma tecnologia exclusiva de televisão',
    ],
    correctAnswer: 0,
    explanation:
      'VoIP significa Voice over Internet Protocol e permite transmitir comunicações de voz através de redes IP.',
    sourceType: 'educational',
    source: 'Conhecimento geral sobre tecnologias de comunicação.',
  },
  {
    id: 25,
    category: 'Conhece a Unitel',
    question: 'Qual pode ser o impacto da expansão das redes de telecomunicações nas zonas rurais?',
    options: [
      'Reduzir o acesso à informação',
      'Melhorar a conectividade e o acesso à informação',
      'Impedir a comunicação entre comunidades',
      'Eliminar a utilização de dispositivos digitais',
    ],
    correctAnswer: 1,
    explanation:
      'A expansão das redes pode reduzir o isolamento digital e facilitar o acesso à comunicação e à informação.',
    sourceType: 'educational',
    source: 'Conhecimento geral sobre inclusão digital.',
  },
  {
    id: 26,
    category: 'Conhece a Unitel',
    question: 'Que áreas podem beneficiar dos serviços de telecomunicações?',
    options: [
      'Apenas educação',
      'Apenas saúde',
      'Apenas comércio',
      'Educação, saúde, comércio e muitas outras áreas',
    ],
    correctAnswer: 3,
    explanation:
      'A conectividade tem aplicações em diversos setores, incluindo educação, saúde, comércio e administração.',
    sourceType: 'educational',
    source: 'Conhecimento geral sobre o impacto das telecomunicações.',
  },
  {
    id: 27,
    category: 'Conhece a Unitel',
    question: 'O que significa transformação digital?',
    options: [
      'Substituir todos os trabalhadores por máquinas',
      'Integrar tecnologias digitais nos processos de uma organização',
      'Eliminar todos os sistemas informáticos',
      'Utilizar exclusivamente documentos impressos',
    ],
    correctAnswer: 1,
    explanation:
      'A transformação digital consiste na integração de tecnologias digitais para melhorar processos, serviços e modelos de funcionamento.',
    sourceType: 'educational',
    source: 'Conhecimento geral sobre transformação digital.',
  },
  {
    id: 28,
    category: 'Conhece a Unitel',
    question: 'Qual deve ser uma das responsabilidades de uma empresa de telecomunicações relativamente aos seus clientes?',
    options: [
      'Proteger os dados pessoais dos clientes',
      'Divulgar livremente os dados dos clientes',
      'Impedir o acesso dos clientes aos seus serviços',
      'Eliminar todas as medidas de segurança',
    ],
    correctAnswer: 0,
    explanation:
      'A proteção dos dados pessoais e da privacidade é uma responsabilidade importante das empresas que prestam serviços de telecomunicações.',
    sourceType: 'educational',
    source: 'Conhecimento geral sobre privacidade e proteção de dados.',
  },
  {
    id: 29,
    category: 'Conhece a Unitel',
    question: 'Qual é um exemplo de utilização produtiva da internet?',
    options: [
      'Aceder a plataformas de formação e aprendizagem profissional',
      'Partilhar informações pessoais sem qualquer cuidado',
      'Ignorar conteúdos educativos',
      'Impedir o acesso a ferramentas de trabalho',
    ],
    correctAnswer: 0,
    explanation:
      'A internet pode apoiar o desenvolvimento de competências através de plataformas educativas e de formação profissional.',
    sourceType: 'educational',
    source: 'Conhecimento geral sobre literacia digital.',
  },
  {
    id: 30,
    category: 'Conhece a Unitel',
    question: 'Qual é o papel da inovação no setor das telecomunicações?',
    options: [
      'Reduzir a qualidade dos serviços',
      'Impedir o desenvolvimento tecnológico',
      'Melhorar os serviços, a conectividade e a experiência dos utilizadores',
      'Eliminar todas as formas de comunicação digital',
    ],
    correctAnswer: 2,
    explanation:
      'A inovação permite desenvolver tecnologias, melhorar a qualidade dos serviços e responder às necessidades dos utilizadores.',
    sourceType: 'educational',
    source: 'Conhecimento geral sobre inovação e telecomunicações.',
  },
]
S