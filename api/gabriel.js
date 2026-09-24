// ==============================================================================
// VERCEL SERVERLESS FUNCTION: /api/gabriel (ES Module)
// ENDPOINT EXCLUSIVO E BLINDADO DO GABRIEL LIMA
// ZERO AUTENTICAÇÃO EXIGIDA NO CHATGPT (AUTENTICAÇÃO AUTOMÁTICA NO SERVIDOR)
// ==============================================================================

const SELLER_USER_ID = 'a1111111-1111-1111-1111-111111111111';
const SELLER_NAME = 'Gabriel Lima';
const SELLER_CREDENTIALS = { email: 'gabriel@piffpaff.com.br', password: 'Gabriel@2026' };

// Leads oficiais do funil de Instagram Direct do Gabriel no CRM
const DEFAULT_INSTAGRAM_LEADS_GABRIEL = [
    {
        "id":  "CRM-GAB-0002",
        "name":  "Luciana Soares Bezerra",
        "instagram":  "",
        "phone":  "63999847517",
        "city":  "Palmas - TO",
        "stage":  "conversa",
        "stage_label":  "Em Conversa",
        "channel":  "instagram",
        "pipeline":  "instagram",
        "value":  158800,
        "temperature":  "quente",
        "priority":  "MAXIMA",
        "commercial_line":  "Linha Premium",
        "followup_status":  "Ativo",
        "followup_date":  "2026-09-12",
        "notes":  "CadÃªncia: Gatilho contextual prioritário: follow-up em 01/10/2026. Se não responder na retomada, seguir D+1/D+2 e depois régua normal.\r\n\r\nHistÃ³rico: IDENTIDADE CONFIRMADA por Gabriel em 04/09/2026: a Luciana da ligação de 2 minutos às 10:38 é Luciana Soares Bezerra, CRM UID original CRM-GAB-0002, telefone +55 63 99984-7517. Perfil: Designer. Histórico comercial preservado: projeto de alto padrão para área gourmet/piscina/prainha. Composição registrada: 1 mesa redonda; composição inicial com 6 cadeiras e registro posterior com 8 cadeiras — quantidade final a confirmar; 1 mesa retangular de aproximadamente 2,20 m; 8 cadeiras para mesa retangular; 4 espreguiçadeiras Tela Slim. Preferências: cores mais claras; modelo de cadeira já aprovado; busca equilíbrio entre beleza, custo e qualidade; referência em madeira Cumaru. Valor potencial histórico do projeto: R$158.800,00. Valores históricos: 4 espreguiçadeiras com registros de R$3.600/un e correção posterior para R$3.800/un; mesa redonda com 8 cadeiras de R$32.990 por R$19.990 e correção posterior em torno de R$20 mil; mesa retangular com 8 cadeiras registro de R$24.380 e correção posterior para faixa de R$22 mil a R$27 mil. Uma opção de mesa redonda foi apresentada como pronta entrega com possibilidade de desconto de até 40%. Histórico: Luciana fazia medições e mencionou que enviaria o projeto; houve ligação de aproximadamente 5 minutos, envio de fotos e referências; discussão de piscina/prainha, mesa retangular 6/8 lugares, cadeiras e espreguiçadeiras; em 30/07/2026 foram consolidados composição, referências e valores; em 31/07 não houve fechamento; em 01/08 seguia analisando; em 03/08 permaneceu entre as maiores negociações abertas. Objeção/trava histórica: definição final dos modelos e composição, buscando equilíbrio entre beleza, custo e qualidade. Atualização atual de 04/09/2026: ligação de voz de 2 minutos às 10:38. Gabriel informou que Luciana está descapitalizada no momento; combinaram retomar em outubro, quando ela espera estar com mais dinheiro disponível. Estratégia combinada: entrar em outubro com produtos de campo/pronta entrega disponíveis naquela época, adequando opções à capacidade de investimento atual. Timing financeiro é a trava atual; o projeto não foi descartado. Cidade/UF, Instagram, origem, data de entrada, medidas finais e composição final seguem não confirmados. PIFF-PAFF: Filtro de timing financeiro concluído; WAITING_EVENT até outubro; retomar Investigação/Proposta em outubro. Temperatura atual estimada 52/100; probabilidade atual estimada 30% (inferências), sem usar a probabilidade histórica de 80–92% como atual.",
        "created_at":  "2026-09-09T16:49:02.59+00:00"
    },
    {
        "id":  "CRM-GAB-611739",
        "name":  "Viviane Silva",
        "instagram":  "vivianesilvamkt",
        "phone":  "31992370269",
        "city":  "Belo Horizonte - MG",
        "stage":  "abordagem",
        "stage_label":  "Abordagem Inicial",
        "channel":  "instagram",
        "pipeline":  "instagram",
        "value":  62000,
        "temperature":  "frio",
        "priority":  "BAIXA",
        "commercial_line":  "Linha Premium",
        "followup_status":  "Ativo",
        "followup_date":  "2099-12-31",
        "notes":  "CLIENTE ENCERRADO / FORA DOS FOLLOW-UPS. Em 07/09/2026, Viviane informou no WhatsApp que já comprou os móveis para área externa. Não há oportunidade comercial ativa. Não realizar novos contatos comerciais; manter apenas o histórico para eventual retorno espontâneo.",
        "created_at":  "2026-09-09T15:51:44.33604+00:00"
    },
    {
        "id":  "insta-1789179889571-rbr5h",
        "name":  "Kerica Almeida",
        "instagram":  "",
        "phone":  "",
        "city":  "Brasil",
        "stage":  "conversa",
        "stage_label":  "Em Conversa",
        "channel":  "instagram",
        "pipeline":  "instagram",
        "value":  50200,
        "temperature":  "morno",
        "priority":  "ALTA",
        "commercial_line":  "Área Externa Premium / Obra em andamento",
        "followup_status":  "Ativo",
        "followup_date":  null,
        "notes":  "[11/09/2026, 23:24:49 - IA ChatGPT (Gabriel Lima)]: Origem: Instagram migrado para WhatsApp. Cliente enviou material/planta da área e demonstrou interesse em sofá modular premium; valores apresentados: sofá branco completo R$46.800, sofá verde completo R$50.200, módulos e poltrona separadamente. Também foram discutidos ombrelone e combinações para o espaço. Cliente rejeitou algumas opções e disse \u0027agora não\u0027; contexto posterior indica aguardar avanço da obra para definir necessidades e cotar. Próxima ação: reabrir pelo projeto, perguntando se já tem medidas finais e quais ambientes serão priorizados. Não usar urgência artificial nem insistir na peça verde sem validar o projeto atual.",
        "created_at":  "2026-09-12T02:24:49.571+00:00"
    },
    {
        "id":  "CRM-GAB-DANNYFRAGA-61981868079",
        "name":  "Meu Mundo Azul (@dannyfragamayer) / Danny",
        "instagram":  "dannyfragamayer",
        "phone":  "61981868079",
        "city":  "cor clara/pr",
        "stage":  "conversa",
        "stage_label":  "Em Conversa",
        "channel":  "instagram",
        "pipeline":  "instagram",
        "value":  48840,
        "temperature":  "frio",
        "priority":  "BAIXA",
        "commercial_line":  "Linha Premium",
        "followup_status":  "Ativo",
        "followup_date":  "2027-09-09",
        "notes":  "ATUALIZAÇÃO 07/09/2026: Danny / Meu Mundo Azul já foi atendida hoje. Gabriel enviou opções de cadeiras, informou possibilidade de detalhe em corda e condição de R$ 1.499 cada unidade. Às 16:14 perguntou se ela gostou de alguma opção, tentou ligação sem atendimento e enviou áudio às 16:15. Não deve permanecer na lista de follow-ups de hoje. Agora aguardar retorno da cliente antes de novo contato.",
        "created_at":  "2026-09-09T15:51:44.33604+00:00"
    },
    {
        "id":  "CRM-GAB-NATMASSA-20260907",
        "name":  "Natmassa (@natmassa)",
        "instagram":  "natmassa",
        "phone":  "",
        "city":  "Brasil",
        "stage":  "conversa",
        "stage_label":  "Em Conversa",
        "channel":  "instagram",
        "pipeline":  "instagram",
        "value":  46200,
        "temperature":  "morno",
        "priority":  "ALTA",
        "commercial_line":  "Linha Premium",
        "followup_status":  "Ativo",
        "followup_date":  "2026-09-13",
        "notes":  "Oportunidade de R$ 46.200 reativada em 07/09/2026.\n\n[10/09/2026, 10:47:17 - IA ChatGPT (Gabriel Lima)]: Atualização em 10/09/2026 às 10:38: lead respondeu anteriormente \u0027Obrigada\u0027 após receber faixa de preço e agora Gabriel retomou perguntando se o valor ficou dentro do que pretende investir, oferecendo mostrar opções a partir de R$ 15 mil e solicitando contato para atendimento exclusivo. Ainda não há telefone/WhatsApp fornecido. Contabilizar este toque como 1 remarketing Instagram na rotina diária. Não contabilizar como ligação, pois não houve chamada neste atendimento. Próximo passo: aguardar resposta sobre faixa de investimento e/ou envio do contato; se responder orçamento, qualificar pela faixa e preferências.",
        "created_at":  "2026-09-10T14:25:47.212+00:00"
    },
    {
        "id":  "insta-1789179893717-gntpb",
        "name":  "Tânio Izél",
        "instagram":  "",
        "phone":  "5595991362123",
        "city":  "Brasil",
        "stage":  "conversa",
        "stage_label":  "Em Conversa",
        "channel":  "instagram",
        "pipeline":  "instagram",
        "value":  44500,
        "temperature":  "morno",
        "priority":  "ALTA",
        "commercial_line":  "Linha Premium / Roraima",
        "followup_status":  "Ativo",
        "followup_date":  null,
        "notes":  "[11/09/2026, 23:24:53 - IA ChatGPT (Gabriel Lima)]: Origem: anúncio Facebook/Instagram. Cliente perguntou valor para Roraima e recebeu proposta de R$44.500 para modelo da linha premium, com possibilidade de frete grátis dependendo da negociação. Não houve resposta posterior registrada. Próxima ação: retomar de forma objetiva confirmando se ainda busca o conjunto para Roraima e oferecer simulação final com frete/prazo. Não reenviar catálogo genérico antes de validar se o modelo continua sendo o de interesse.",
        "created_at":  "2026-09-12T02:24:53.717+00:00"
    },
    {
        "id":  "insta-1789179897607-f3zjj",
        "name":  "Élica R. Rodrigues",
        "instagram":  "",
        "phone":  "5564992068153",
        "city":  "Brasil",
        "stage":  "conversa",
        "stage_label":  "Em Conversa",
        "channel":  "instagram",
        "pipeline":  "instagram",
        "value":  43500,
        "temperature":  "quente",
        "priority":  "MAXIMA",
        "commercial_line":  "Linha Premium / Casa em finalização",
        "followup_status":  "Ativo",
        "followup_date":  null,
        "notes":  "[11/09/2026, 23:24:57 - IA ChatGPT (Gabriel Lima)]: Origem: anúncio Facebook/Instagram. Cliente informou em 03/06/2026 que estava finalizando a casa, disse \u0027amei esse modelo\u0027 e pediu catálogo. Modelo premium em corda náutica 100% polipropileno apresentado por R$43.500. Forte sinal de compra por afinidade estética + obra em fase final. Próxima ação: retomar perguntando se a casa já foi concluída e oferecer curadoria de 3 opções alinhadas ao modelo que ela amou, com prazo e condição final. Não perguntar apenas se o valor cabe; conduzir por projeto e composição.",
        "created_at":  "2026-09-12T02:24:57.607+00:00"
    },
    {
        "id":  "CRM-WA-748848",
        "name":  "Dudu Cliente Instagram",
        "instagram":  "",
        "phone":  "31985395383",
        "city":  "Instagram/Wh",
        "stage":  "conversa",
        "stage_label":  "Em Conversa",
        "channel":  "instagram",
        "pipeline":  "instagram",
        "value":  18000,
        "temperature":  "morno",
        "priority":  "ALTA",
        "commercial_line":  "Linha Premium",
        "followup_status":  "Ativo",
        "followup_date":  null,
        "notes":  "ATUALIZAÇÃO 07/09/2026: Dudu Cliente Instagram já foi atendido hoje. Na conversa, discutiu composição para varanda, limite de até 6 lugares e pediu valor. Gabriel informou hoje que o modelo sairia por R$ 4.500. Não manter na lista de follow-ups de hoje; agora aguardar reação ao preço/modelo antes de novo contato.",
        "created_at":  "2026-09-11T12:34:34.366+00:00"
    },
    {
        "id":  "CRM-GAB-EDUARDO-LAZARI-19995304504",
        "name":  "Eduardo Lazari (@dumayoral)",
        "instagram":  "dumayoral",
        "phone":  "19995304504",
        "city":  "Objeções / de",
        "stage":  "conversa",
        "stage_label":  "Em Conversa",
        "channel":  "instagram",
        "pipeline":  "instagram",
        "value":  16000,
        "temperature":  "quente",
        "priority":  "ALTA",
        "commercial_line":  "Linha Premium",
        "followup_status":  "Ativo",
        "followup_date":  "2026-09-13",
        "notes":  "ATUALIZAÇÃO 07/09/2026 17:26-17:27. Gabriel tentou ligação sem atendimento e enviou áudio perguntando se a esposa de Eduardo gostou das opções apresentadas, se o casal gostou da proposta e se é preciso alterar algo para ficar dentro do que esperam. O objetivo agora é obter feedback do casal e ajustar apenas se houver necessidade real. Não enviar novos modelos hoje.\n\n[10/09/2026, 11:39:10 - IA ChatGPT (Gabriel Lima)]: Atualização em 10/09/2026: tentativa de ligação de voz às 11:35 não atendida, seguida de áudio de 17s e mensagem pedindo ajuda para definir o melhor custo-benefício. Contabilizar hoje como 1 ligação e 1 remarketing celular. Não contabilizar como ligação de qualidade, pois a chamada não foi atendida e não houve novo diagnóstico comercial na ligação. Próximo passo: aguardar retorno e, se responder, comparar opções pelo melhor custo-benefício para conduzir ao fechamento.",
        "created_at":  "2026-09-10T15:07:59.373+00:00"
    },
    {
        "id":  "insta-1789179908888-qabm4",
        "name":  "Wilcimeire",
        "instagram":  "",
        "phone":  "",
        "city":  "Brasil",
        "stage":  "abordagem",
        "stage_label":  "Abordagem Inicial",
        "channel":  "instagram",
        "pipeline":  "instagram",
        "value":  15000,
        "temperature":  "morno",
        "priority":  "ALTA",
        "commercial_line":  "Sala de Jantar / Alto Padrão",
        "followup_status":  "Ativo",
        "followup_date":  null,
        "notes":  "[11/09/2026, 23:25:08 - IA ChatGPT (Gabriel Lima)]: Origem: anúncio Facebook/Instagram. Interesse inicial em sala de jantar, mesa oval para 8 lugares, estilo ousado e contemporâneo. Demonstrou forte reação positiva a peça promocional de R$15.000 e posteriormente a conjunto maior, mas relatou compromissos financeiros e em 24/06/2026 disse que precisava pagar ITBI e acompanharia a loja até chegar a hora. Próxima ação: reativação elegante sem pressão, retomando pelo estilo contemporâneo e perguntando se a fase financeira/da casa já permite voltar a montar o ambiente. Não usar abordagem \u0027desistiu da compra?\u0027.",
        "created_at":  "2026-09-12T02:25:08.888+00:00"
    },
    {
        "id":  "lead-1789086982632-ei9qc",
        "name":  "Marisa Beux",
        "instagram":  "marisabeux",
        "phone":  "",
        "city":  "Brasil",
        "stage":  "abordagem",
        "stage_label":  "Abordagem Inicial",
        "channel":  "instagram",
        "pipeline":  "instagram",
        "value":  11999,
        "temperature":  "quente",
        "priority":  "ALTA",
        "commercial_line":  "Leads Instagram",
        "followup_status":  "Ativo",
        "followup_date":  null,
        "notes":  "[10/09/2026, 21:36:22 - IA ChatGPT (Gabriel Lima)]: Lead captada via resposta a anúncio no Instagram em 10/09/2026. Abordagem inicial da cliente: \u0027Qual o valor?\u0027. Gabriel se apresentou como especialista em móveis de alto padrão, enviou referência do conjunto e explicou 4 linhas (Premium, Standard, Internacional e Interna Dubai de Alto Padrão). Informado que há mais de 1.500 possibilidades a partir de R$ 11.999. Próxima melhor ação: responder de forma objetiva sobre o valor do conjunto do anúncio e fazer uma única pergunta de qualificação sobre o ambiente/medidas. Evitar excesso de catálogo/opções antes de entender a necessidade.\n\n[11/09/2026, 11:36:32 - IA ChatGPT (Gabriel Lima)]: Atualização 11/09: Marisa Beux veio de anúncio no Instagram. Foi trabalhado valor de R$ 11.999. Gabriel tentou ligação de áudio às 11:31/11:32 e enviou referências visuais de produtos, incluindo espreguiçadeiras e conjunto para área externa. Próxima ação: identificar qual composição ela gostou mais, confirmar medidas do espaço e cidade/CEP, e então avançar para proposta.",
        "created_at":  "2026-09-11T14:36:32.028+00:00"
    },
    {
        "id":  "lead-1789131771694-ob7iu",
        "name":  "Sergio Henrique",
        "instagram":  "sergiohenriquealvesda",
        "phone":  "21987616960",
        "city":  "Brasil",
        "stage":  "abordagem",
        "stage_label":  "Abordagem Inicial",
        "channel":  "instagram",
        "pipeline":  "instagram",
        "value":  0,
        "temperature":  "quente",
        "priority":  "ALTA",
        "commercial_line":  "Leads Instagram",
        "followup_status":  "Ativo",
        "followup_date":  null,
        "notes":  "[11/09/2026, 10:02:51 - IA ChatGPT (Gabriel Lima)]: Lead vindo do Instagram via resposta de anúncio. Perguntou sobre opções de entrega. Gabriel tentou ligação de áudio às 09:54/09:57 e informou contato pelo WhatsApp. Cliente de Minas Gerais (informado em anotação), já está com o espaço pronto e a decisão de compra será tomada junto com a esposa. Próxima ação: falar com o casal, entender peça/conjunto desejado, medidas e cidade exata de entrega; avançar para proposta.\n\n[11/09/2026, 10:10:25 - IA ChatGPT (Gabriel Lima)]: Atualização 11/09: atendimento avançou do Instagram para WhatsApp. Sérgio respondeu pelo WhatsApp às 10:05. Gabriel apresentou opções e enviou vídeos de peças, incluindo poltronas/cadeiras e referência de champanheira. Sérgio já está com o espaço pronto e a decisão será tomada junto com a esposa. Gabriel sugeriu mostrar opções para a esposa e ofereceu criar um grupo com os três ou falar diretamente com ela para definir alguns modelos antes de tratar valores com Sérgio. Próxima ação: envolver a esposa na conversa, selecionar 2 a 3 modelos, confirmar medidas do ambiente e cidade/CEP para entrega, então avançar para proposta.",
        "created_at":  "2026-09-11T13:10:25.427+00:00"
    },
    {
        "id":  "insta-1789179877169-b8k1l",
        "name":  "Marlene Sossai Gobbo",
        "instagram":  "",
        "phone":  "5527999196912",
        "city":  "Brasil",
        "stage":  "novo",
        "stage_label":  "Novo Lead",
        "channel":  "instagram",
        "pipeline":  "instagram",
        "value":  0,
        "temperature":  "frio",
        "priority":  "BAIXA",
        "commercial_line":  "Lead Meta / Área Externa",
        "followup_status":  "Ativo",
        "followup_date":  null,
        "notes":  "[11/09/2026, 23:24:37 - IA ChatGPT (Gabriel Lima)]: Origem: anúncio Facebook/Instagram. Histórico exportado do WhatsApp analisado em 11/09/2026. Houve apenas mensagem inicial de recepção e depois figurinha em 29/06/2026, sem necessidade, produto ou orçamento identificados. Próxima ação: reativação leve perguntando em que etapa está o projeto e qual ambiente deseja mobiliar. Evitar pressão ou envio massivo de catálogo sem diagnóstico.",
        "created_at":  "2026-09-12T02:24:37.169+00:00"
    },
    {
        "id":  "lead-instagram-rogeriosouzaguitar",
        "name":  "Rogério Augusto de Souza",
        "instagram":  "rogeriosouzaguitar",
        "phone":  "",
        "city":  "Brasil",
        "stage":  "abordagem",
        "stage_label":  "Abordagem Inicial",
        "channel":  "instagram",
        "pipeline":  "instagram",
        "value":  0,
        "temperature":  "morno",
        "priority":  "MEDIA",
        "commercial_line":  "Linha Premium",
        "followup_status":  "Ativo",
        "followup_date":  "2026-09-13",
        "notes":  "RESTAURA��O 09/09/2026 10:40 � Rog�rio Augusto de Souza, Instagram @rogeriosouzaguitar. Hist�rico: em 07/09 pediu consulta de pre�o; em 08/09 Gabriel apresentou as quatro linhas e perguntou qual interessava. Hoje �s 10:40 Gabriel realizou liga��o de �udio, enviou �udio de 15s e pe�a de reativa��o com condi��es especiais antes do ver�o. Conte�do do �udio n�o foi informado, portanto n�o presumido. Ainda falta identificar produto/linha exata e contexto b�sico de compra. Posse da bola: CLIENT. N�o entra novamente no follow-up do dia.",
        "created_at":  "2026-09-10T16:15:35.803+00:00"
    },
    {
        "id":  "lead-1789045662791-r6w7u",
        "name":  "Josiellen Jardim",
        "instagram":  "josiellenjardim",
        "phone":  "",
        "city":  "Brasil",
        "stage":  "abordagem",
        "stage_label":  "Abordagem Inicial",
        "channel":  "instagram",
        "pipeline":  "instagram",
        "value":  0,
        "temperature":  "morno",
        "priority":  "ALTA",
        "commercial_line":  "Móveis externos",
        "followup_status":  "Ativo",
        "followup_date":  null,
        "notes":  "[10/09/2026, 10:07:42 - IA ChatGPT (Gabriel Lima)]: Lead captado pelo Instagram via resposta a anúncio em 10/09/2026. Cliente iniciou com \u0027Bom dia\u0027. Gabriel se apresentou como especialista em móveis de alto padrão, enviou material institucional/visual de ambiente externo e apresentou 4 linhas: Premium, Standard, Internacional e Interna Dubai de alto padrão. Foi perguntado qual das 4 linhas desperta interesse. Até o momento, ainda não informou ambiente, medidas, linha escolhida, orçamento ou prazo. Próximo passo: diagnosticar qual ambiente deseja mobiliar e pedir foto/medidas antes de aprofundar em catálogo e preço.\n\n[10/09/2026, 10:16:52 - IA ChatGPT (Gabriel Lima)]: Contabilizar como lead novo. 1 ligação realizada/contabilizada na rotina diária.\n\n[10/09/2026, 17:30:33 - IA ChatGPT (Gabriel Lima)]: Lead veio de anúncio no Instagram. Perguntou especificamente qual linha corresponde ao conjunto da foto de área externa. Gabriel apresentou as 4 linhas e depois pediu o contato para enviar mais opções. Ainda não informou telefone/WhatsApp. Interesse visual já demonstrado em conjunto externo; próximo passo é identificar linha da peça, entender ambiente/medidas e captar WhatsApp.",
        "created_at":  "2026-09-10T20:30:33.896+00:00"
    },
    {
        "id":  "insta-1789179927526-zuh7i",
        "name":  "Geilhia",
        "instagram":  "",
        "phone":  "5571991142603",
        "city":  "Brasil",
        "stage":  "novo",
        "stage_label":  "Novo Lead",
        "channel":  "instagram",
        "pipeline":  "instagram",
        "value":  0,
        "temperature":  "frio",
        "priority":  "BAIXA",
        "commercial_line":  "Lead Meta / Móveis Alto Padrão",
        "followup_status":  "Ativo",
        "followup_date":  null,
        "notes":  "[11/09/2026, 23:25:27 - IA ChatGPT (Gabriel Lima)]: Origem: anúncio Facebook/Instagram. Pediu para entender melhor como funciona. Recebeu apresentação, vídeo, imagem, áudio e informação de que há mais de 1000 modelos, mas não houve resposta registrada depois. Próxima ação: reativação curta perguntando qual ambiente deseja mobiliar e se prefere peças mais slim ou robustas. Não enviar novo catálogo completo antes de obter uma direção de estilo/ambiente.",
        "created_at":  "2026-09-12T02:25:27.526+00:00"
    },
    {
        "id":  "lead-1789046365305-2e5kw",
        "name":  "Gleise Carvalho",
        "instagram":  "carvalho.gleise",
        "phone":  "",
        "city":  "Brasil",
        "stage":  "novo",
        "stage_label":  "Novo Lead",
        "channel":  "instagram",
        "pipeline":  "instagram",
        "value":  0,
        "temperature":  "morno",
        "priority":  "ALTA",
        "commercial_line":  "Móveis Externos",
        "followup_status":  "Ativo",
        "followup_date":  null,
        "notes":  "[10/09/2026, 10:19:25 - IA ChatGPT (Gabriel Lima)]: Lead captado pelo Instagram. Cliente perguntou: \u0027Quais são suas opções de entrega?\u0027. Gabriel respondeu se apresentando como especialista em móveis de alto padrão e realizou 1 ligação de áudio às 10:14, encerrada às 10:15. Depois perguntou se ela já tem um espaço pronto para receber os móveis ou se está em obra, enviou material institucional e apresentou as linhas disponíveis. Contabilizar 1 ligação na rotina diária. Ainda faltam: cidade/CEP para responder entrega com precisão, ambiente, medidas, peças desejadas, prazo e faixa de investimento. Próximo passo: responder objetivamente sobre entrega e pedir cidade/CEP, sem desviar da pergunta inicial.",
        "created_at":  "2026-09-10T13:19:25.305+00:00"
    },
    {
        "id":  "insta-1789137602344-3ze1e",
        "name":  "Pauliane A Souza",
        "instagram":  "pauli333_",
        "phone":  "",
        "city":  "Brasil",
        "stage":  "abordagem",
        "stage_label":  "Abordagem Inicial",
        "channel":  "instagram",
        "pipeline":  "instagram",
        "value":  0,
        "temperature":  "quente",
        "priority":  "ALTA",
        "commercial_line":  "Leads Instagram",
        "followup_status":  "Ativo",
        "followup_date":  null,
        "notes":  "[11/09/2026, 11:40:02 - IA ChatGPT (Gabriel Lima)]: Lead recorrente do Instagram via anúncios. Já demonstrou interesse anteriormente, perguntando \u0027Quero saber mais\u0027, valor e frete para o CEP 37130442, quais produtos são oferecidos e mais informações. Em 23/08 voltou a perguntar sobre produtos e informações. Em 11/09 perguntou novamente sobre opções de entrega após receber referência de conjunto para área externa; Gabriel se apresentou como especialista em móveis de alto padrão e tentou ligação de áudio às 11:37/11:38. Próxima ação: responder objetivamente condições de entrega para o CEP informado, confirmar se busca área externa ou interna, selecionar 2 a 3 opções e conduzir para orçamento.\n\n[11/09/2026, 11:42:37 - IA ChatGPT (Gabriel Lima)]: Histórico consolidado: lead recorrente do Instagram via anúncios. Em contatos anteriores pediu para saber mais, perguntou valor e frete para o CEP 37130-442, quis saber quais produtos são oferecidos e pediu mais informações. Já foi atendida anteriormente por Felipe e Sebastião. Em 24/08 recebeu apresentação como cliente de móveis de alto padrão; houve tentativa de ligação às 11:20/11:21, envio de áudios e referência de conjunto para área externa. Em 11/09 voltou a perguntar \u0027Quais são suas opções de entrega?\u0027. Gabriel assumiu o atendimento, se apresentou como especialista em móveis de alto padrão, tentou ligação às 11:37/11:38, enviou referência visual de conjunto externo e apresentou as 4 linhas (Premium, Standard, Internacional e Interna Dubai). Próxima ação: responder objetivamente entrega/frete para o CEP 37130-442, confirmar se o uso é externo ou interno, identificar faixa de investimento e separar 2 a 3 opções para orçamento.\n\n[11/09/2026, 11:51:37 - IA ChatGPT (Gabriel Lima)]: [Canal: Instagram] Atualização 11/09 às 11:50: Pauliane visualizou a apresentação das 4 linhas há cerca de 5 minutos e ainda não respondeu. Gabriel enviou três mensagens de follow-up perguntando se ela já adquiriu os móveis, mencionando que ela já entrou em contato várias vezes e pedindo um retorno para poder seguir. Próxima ação: não insistir agora; aguardar resposta. Se não houver retorno até mais tarde ou no próximo contato, enviar mensagem curta e objetiva com duas opções de direção (área externa ou interna) e oferta de orçamento/frete para o CEP 37130-442.",
        "created_at":  "2026-09-11T14:51:37.773+00:00"
    },
    {
        "id":  "CRM-GAB-ODACIFELIX-20260907",
        "name":  "Odaci Camelo (@odacifelix)",
        "instagram":  "odacifelix",
        "phone":  "",
        "city":  "Brasil",
        "stage":  "abordagem",
        "stage_label":  "Abordagem Inicial",
        "channel":  "instagram",
        "pipeline":  "instagram",
        "value":  0,
        "temperature":  "morno",
        "priority":  "MEDIA",
        "commercial_line":  "Linha Premium",
        "followup_status":  "Ativo",
        "followup_date":  "2026-09-08",
        "notes":  "Origem: Instagram @odacifelix. Resposta de anúncio em 07/09.",
        "created_at":  "2026-09-09T15:51:44.256114+00:00"
    },
    {
        "id":  "lead-instagram-oliviabavaresco",
        "name":  "Olívia",
        "instagram":  "oliviabavaresco",
        "phone":  "",
        "city":  "Brasil",
        "stage":  "abordagem",
        "stage_label":  "Abordagem Inicial",
        "channel":  "instagram",
        "pipeline":  "instagram",
        "value":  0,
        "temperature":  "quente",
        "priority":  "ALTA",
        "commercial_line":  "Linha Premium",
        "followup_status":  "Ativo",
        "followup_date":  "2026-09-13",
        "notes":  "RESTAURA��O 09/09/2026 11:52-12:06 � Novo lead inbound via an�ncio no Instagram. Ol�via perguntou espontaneamente \u0027Como fa�o para encomendar?\u0027. Gabriel se apresentou, enviou pe�a de posicionamento, realizou liga��o de �udio, apresentou as quatro linhas e perguntou qual interessava. Ol�via escolheu Linha Standard, informou que quer m�veis para varanda, enviou uma refer�ncia visual e pediu \u0027fotos, tamanhos e valores\u0027. Gabriel pediu o contato de WhatsApp para agilizar a curadoria e mencionou op��o � pronta entrega com v�deo. Telefone, cidade/UF, medidas, prazo e or�amento ainda n�o informados. Infer�ncia: temperatura ~88/100, probabilidade de avan�o ~75%. Posse da bola: CLIENT. N�o insistir novamente no mesmo dia.\n\n[10/09/2026, 10:48:36 - IA ChatGPT (Gabriel Lima)]: Atualização em 10/09/2026 às 10:45-10:47: Gabriel realizou 2 tentativas de ligação de áudio pelo Instagram. Em seguida informou que o anexo enviado por Olívia apareceu como indisponível e pediu que ela reenviasse a mensagem/arquivo; também sinalizou que, recebendo novamente, pode chamá-la no WhatsApp. Contabilizar 2 ligações na rotina diária. Não contabilizar como ligação de qualidade, pois não houve diagnóstico comercial na chamada. Contabilizar 1 remarketing Instagram por retomada ativa de lead já existente. Próximo passo: aguardar reenvio do anexo e, se houver contato/WhatsApp, migrar a conversa para lá e aprofundar diagnóstico.",
        "created_at":  "2026-09-10T16:16:26.244+00:00"
    },
    {
        "id":  "CRM-GAB-1002",
        "name":  "Paulo Cesar da Silveira",
        "instagram":  "pc.jl60.",
        "phone":  "",
        "city":  "Brasil",
        "stage":  "novo",
        "stage_label":  "Novo Lead",
        "channel":  "instagram",
        "pipeline":  "instagram",
        "value":  0,
        "temperature":  "morno",
        "priority":  "MEDIA",
        "commercial_line":  "Linha Premium",
        "followup_status":  "Ativo",
        "followup_date":  "2026-09-12",
        "notes":  "CadÃªncia: Cadência 3 Dias\r\n\r\nHistÃ³rico: Instagram @pc.jl60. Pediu preço conjunto área externa.\n\n[11/09/2026, 16:55 - Contato Instagram]: Chamada/conversa realizada via Direct hoje. Próximo contato programado para 12/09/2026.",
        "created_at":  "2026-09-11T19:55:52.113+00:00"
    },
    {
        "id":  "CRM-GAB-0035",
        "name":  "MarinÃªs Cavalin Pivetta (@mari_pivetta)",
        "instagram":  "mari_pivetta",
        "phone":  "",
        "city":  "Brasil",
        "stage":  "abordagem",
        "stage_label":  "Abordagem Inicial",
        "channel":  "instagram",
        "pipeline":  "instagram",
        "value":  0,
        "temperature":  "morno",
        "priority":  "MEDIA",
        "commercial_line":  "Linha Premium",
        "followup_status":  "Ativo",
        "followup_date":  "2026-09-07",
        "notes":  "CadÃªncia: Cadência 7 Dias\r\n\r\nHistÃ³rico: ?udio e tentativa de liga??o enviados.",
        "created_at":  "2026-09-09T15:51:43.595786+00:00"
    },
    {
        "id":  "CRM-GAB-0036",
        "name":  "Paula Braga (@paulasbraga)",
        "instagram":  "paulasbraga",
        "phone":  "",
        "city":  "Brasil",
        "stage":  "abordagem",
        "stage_label":  "Abordagem Inicial",
        "channel":  "instagram",
        "pipeline":  "instagram",
        "value":  0,
        "temperature":  "morno",
        "priority":  "MEDIA",
        "commercial_line":  "Linha Premium",
        "followup_status":  "Ativo",
        "followup_date":  "2026-09-07",
        "notes":  "CadÃªncia: Cadência 7 Dias\r\n\r\nHistÃ³rico: Reuni?o impediu liga??o.",
        "created_at":  "2026-09-09T15:51:43.595786+00:00"
    },
    {
        "id":  "CRM-GAB-0057",
        "name":  "FlÃ¡via Saade (@flavia_saade)",
        "instagram":  "flavia_saade",
        "phone":  "11981751755",
        "city":  "São Paulo - SP",
        "stage":  "novo",
        "stage_label":  "Novo Lead",
        "channel":  "instagram",
        "pipeline":  "instagram",
        "value":  0,
        "temperature":  "morno",
        "priority":  "MEDIA",
        "commercial_line":  "Linha Premium",
        "followup_status":  "Ativo",
        "followup_date":  null,
        "notes":  "CadÃªncia: Cadência 3 Dias\r\n\r\nHistÃ³rico: Estava viajando; migrou para WhatsApp.",
        "created_at":  "2026-09-10T19:03:17.717+00:00"
    },
    {
        "id":  "CRM-GAB-0021",
        "name":  "Raquel Menezes (@quel.menezes)",
        "instagram":  "quel.menezes",
        "phone":  "47996431887",
        "city":  "Litoral Norte - SC",
        "stage":  "abordagem",
        "stage_label":  "Abordagem Inicial",
        "channel":  "instagram",
        "pipeline":  "instagram",
        "value":  0,
        "temperature":  "morno",
        "priority":  "MEDIA",
        "commercial_line":  "Linha Premium",
        "followup_status":  "Ativo",
        "followup_date":  null,
        "notes":  "CadÃªncia: Cadência 7 Dias\r\n\r\nHistÃ³rico: ?udio e imagens enviadas.",
        "created_at":  "2026-09-10T19:03:33.109+00:00"
    },
    {
        "id":  "CRM-GAB-0059",
        "name":  "CicÃ­lia Amorim Andrade (@ciciliapaes)",
        "instagram":  "ciciliapaes",
        "phone":  "",
        "city":  "Brasil",
        "stage":  "novo",
        "stage_label":  "Novo Lead",
        "channel":  "instagram",
        "pipeline":  "instagram",
        "value":  0,
        "temperature":  "morno",
        "priority":  "MEDIA",
        "commercial_line":  "Linha Premium",
        "followup_status":  "Ativo",
        "followup_date":  "2026-09-12",
        "notes":  "CadÃªncia: Cadência 3 Dias\r\n\r\nHistÃ³rico: Primeiro contato IG.\n\n[11/09/2026, 17:03 - Contato Instagram]: Chamada/conversa realizada via Direct hoje. Próximo contato programado para 12/09/2026.",
        "created_at":  "2026-09-11T20:03:38.196+00:00"
    },
    {
        "id":  "CRM-GAB-0126",
        "name":  "Marcelo Rodrigues",
        "instagram":  "",
        "phone":  "38998957788",
        "city":  "Norte de Minas - MG",
        "stage":  "novo",
        "stage_label":  "Novo Lead",
        "channel":  "instagram",
        "pipeline":  "instagram",
        "value":  0,
        "temperature":  "morno",
        "priority":  "MEDIA",
        "commercial_line":  "Linha Premium",
        "followup_status":  "Ativo",
        "followup_date":  "2026-08-17",
        "notes":  "CadÃªncia: Cadência 3 Dias\r\n\r\nHistÃ³rico: Reativou espontaneamente pelo Instagram em 17/08.  [Histórico Antigo]: Construindo. Havia esfriado e reativou pelo Instagram. Gabriel enviou [Histórico Antigo]: [24/08/2026]: Construindo. Havia esfriado e reativou pelo Instagram. G",
        "created_at":  "2026-09-09T15:51:43.948458+00:00"
    },
    {
        "id":  "CRM-GAB-VINICIUS-TRPVINI-20260907",
        "name":  "Vinicius (@trp_vini)",
        "instagram":  "trp_vini",
        "phone":  "",
        "city":  "Brasil",
        "stage":  "abordagem",
        "stage_label":  "Abordagem Inicial",
        "channel":  "instagram",
        "pipeline":  "instagram",
        "value":  0,
        "temperature":  "morno",
        "priority":  "MEDIA",
        "commercial_line":  "Linha Standard",
        "followup_status":  "Ativo",
        "followup_date":  "2026-09-08",
        "notes":  "Origem: Instagram @trp_vini. Resposta a anúncio em 07/09/2026.",
        "created_at":  "2026-09-09T15:51:44.087126+00:00"
    },
    {
        "id":  "CRM-GAB-1854",
        "name":  "Paulo Ramos",
        "instagram":  "",
        "phone":  "",
        "city":  "Brasil",
        "stage":  "novo",
        "stage_label":  "Novo Lead",
        "channel":  "instagram",
        "pipeline":  "instagram",
        "value":  0,
        "temperature":  "morno",
        "priority":  "MEDIA",
        "commercial_line":  "Linha Premium",
        "followup_status":  "Ativo",
        "followup_date":  "2026-09-07",
        "notes":  "CadÃªncia: Cadência 3 Dias\r\n\r\nHistÃ³rico: Origem Instagram CTA \u0027Quero saber mais\u0027. Gabriel e [Histórico Antigo]: [24/08/2026]: Instagram CTA \u0027Quero saber mais\u0027. Gabriel explicou as 4",
        "created_at":  "2026-09-09T15:51:44.087126+00:00"
    },
    {
        "id":  "CRM-GAB-EVA-LUANA",
        "name":  "Eva Luana",
        "instagram":  "eva.luanna.",
        "phone":  "17991871252",
        "city":  "composição/pr",
        "stage":  "conversa",
        "stage_label":  "Em Conversa",
        "channel":  "instagram",
        "pipeline":  "instagram",
        "value":  0,
        "temperature":  "morno",
        "priority":  "MEDIA",
        "commercial_line":  "Linha Premium",
        "followup_status":  "Ativo",
        "followup_date":  "2026-08-27",
        "notes":  "CadÃªncia: CADENCIA 3 DIAS (D1-D3)\r\n\r\nHistÃ³rico: Instagram @eva.luanna. Lead de anúncio migrado para WhatsApp. Em 27/08 Gabriel enviou apresentação, foto ambientada e vídeos reais do sofá; informou opções reto 2,20m e curvo 2,60m. Bola com a cliente.",
        "created_at":  "2026-09-09T15:51:44.170501+00:00"
    },
    {
        "id":  "CRM-GAB-ANATERNICELLI-ANAC2881",
        "name":  "Ana Ternicelli (@anac2881)",
        "instagram":  "anac2881",
        "phone":  "",
        "city":  "contato/es",
        "stage":  "abordagem",
        "stage_label":  "Abordagem Inicial",
        "channel":  "instagram",
        "pipeline":  "instagram",
        "value":  0,
        "temperature":  "morno",
        "priority":  "MEDIA",
        "commercial_line":  "Linha Internacional",
        "followup_status":  "Ativo",
        "followup_date":  "2026-09-05",
        "notes":  "CadÃªncia: Novo toque feito em 04/09 às 11:37. Não insistir novamente hoje. Se continuar sem resposta, próximo follow-up em 05/09/2026; depois 06/09 e então seguir régua normal.\r\n\r\nHistÃ³rico: Lead Instagram @anac2881. Histórico preservado: em 03/09 às 12:51 Ana respondeu anúncio perguntando \u0027Poderia me passar mais informações?\u0027. Gabriel se apresentou como especialista em móveis de alto padrão; houve ligação de áudio entre 13:29 e 13:30, envio de referência e áudio de 17s, e apresentação das 4 linhas: Premium, Standard, Nova Linha Internacional e Linha Interna Dubai. Às 15:41 Ana escolheu explicitamente a Linha Internacional: \u0027Pode me mostrar opções da Linha Internacional?\u0027. Gabriel enviou várias referências visuais e pediu o contato para mandar algo mais assertivo, perguntando se ela já tem o espaço pronto. Atualização 04/09/2026: o pedido de contato/espaço aparecia como visualizado há cerca de 13 horas, sem resposta textual visível. Às 11:37 Gabriel fez nova ligação de áudio no Instagram, encerrada no mesmo minuto, enviou áudio de 13 segundos e mais referências visuais. Não há resposta da Ana visível até 11:38. Fatos pendentes: telefone, cidade/UF, ambiente, peças, medidas, prazo, arquiteto, orçamento e decisores. PIFF-PAFF: Filtro da linha concluído; Investigação pendente e Formação de Valor iniciada. Temperatura estimada 58/100; probabilidade 20% (inferências) devido ao interesse inicial específico, mas ausência de resposta após visualização. Posse da bola: CLIENT.",
        "created_at":  "2026-09-09T15:51:44.170501+00:00"
    },
    {
        "id":  "CRM-GAB-THICIANE-77988510065",
        "name":  "Thiciane (@thicianeguerra)",
        "instagram":  "thicianeguerra",
        "phone":  "77988510065",
        "city":  "responder categoria/ne",
        "stage":  "novo",
        "stage_label":  "Novo Lead",
        "channel":  "instagram",
        "pipeline":  "instagram",
        "value":  0,
        "temperature":  "morno",
        "priority":  "MEDIA",
        "commercial_line":  "Linha Internacional",
        "followup_status":  "Ativo",
        "followup_date":  "2026-09-13",
        "notes":  "CadÃªncia: Cadência 3 Dias\r\n\r\nHistÃ³rico: Lead novo originado no Instagram em 31/08/2026. Cliente @thicianeguerra respondeu a conteúdo da Caribe pedindo: \u0027Gostaria do orçamento desse conjunto\u0027. Gabriel se apresentou, enviou áudio e apresentou as 4 linhas (Premium, Standard, Nova Linha Internacional e Linha Interna Dubai de Alto Padrão), perguntando qual linha interessava. Houve ligação de áudio encerrada no Instagram às 13:12. Cliente forneceu telefone para continuidade no WhatsApp; havia dois números detectados, e ela confirmou que o correto é 77 98851-0065. Migração concluída para WhatsApp +55 77 98851-0065 às 15:46. Gabriel retomou por lá e às 15:47 perguntou o que ela procura, citando espreguiçadeira, cadeira e mesa. Interesse inicial concreto em conjunto mostrado no vídeo/post. Valores, ambiente, medidas, cidade/UF, prazo e orçamento ainda não informados. PIFF-PAFF: Posicionamento realizado; Investigação em andamento. Temperatura: oportunidade ativa. Bola com a cliente para responder categoria/necessidade.\n\n[12/09/2026, 14:31 - Contato Instagram]: Chamada/conversa realizada via Direct hoje. Próximo contato programado para 13/09/2026.",
        "created_at":  "2026-09-12T17:31:39.456+00:00"
    },
    {
        "id":  "CRM-GAB-DOUGLASHELLUS-20260907",
        "name":  "Douglas Fernandes (@douglashellus)",
        "instagram":  "douglashellus",
        "phone":  "",
        "city":  "Brasil",
        "stage":  "abordagem",
        "stage_label":  "Abordagem Inicial",
        "channel":  "instagram",
        "pipeline":  "instagram",
        "value":  0,
        "temperature":  "quente",
        "priority":  "ALTA",
        "commercial_line":  "Linha Premium",
        "followup_status":  "Ativo",
        "followup_date":  "2026-09-08",
        "notes":  "Instagram @douglashellus. Interesse direto em modelo anunciado.",
        "created_at":  "2026-09-09T15:51:44.256114+00:00"
    },
    {
        "id":  "CRM-GAB-FLAVIA-AFIUNE",
        "name":  "Flavia Afiune (@flavia_afiune)",
        "instagram":  "flavia_afiune",
        "phone":  "",
        "city":  "Brasil",
        "stage":  "novo",
        "stage_label":  "Novo Lead",
        "channel":  "instagram",
        "pipeline":  "instagram",
        "value":  0,
        "temperature":  "morno",
        "priority":  "MEDIA",
        "commercial_line":  "Linha Internacional",
        "followup_status":  "Ativo",
        "followup_date":  "2026-09-13",
        "notes":  "CadÃªncia: Cadência 3 Dias: D1 em 05/09/2026 se não responder, D2 em 06/09 e D3 em 07/09.\r\n\r\nHistÃ³rico: Lead novo Instagram Dluxo em 04/09/2026. Origem: resposta a anúncio da Dluxo/Instagram. Cliente perguntou explicitamente: \u0027Vcs atendem revenda?\u0027. Gabriel se apresentou como especialista em móveis de alto padrão, realizou tentativa/ligação de áudio entre 08:39 e 08:40, enviou referência visual, áudio de 18s e apresentou as 4 linhas: Premium, Standard, Nova Linha Internacional e Linha Interna Dubai de Alto Padrão, perguntando qual linha interessa. Fatos: interesse comercial em revenda; ligação realizada/tentada; ainda sem telefone, cidade, estrutura de revenda, volume, orçamento ou linha escolhida. PIFF-PAFF: Posicionamento + Filtro/Investigação inicial. Temperatura estimada 65/100; probabilidade 25% até qualificação. Posse da bola: CLIENT.\n\n[11/09/2026, 15:31 - Contato Instagram]: Chamada/conversa realizada via Direct hoje. Próximo contato programado para 12/09/2026.\n\n[12/09/2026, 15:12 - Contato Instagram]: Chamada/conversa realizada via Direct hoje. Próximo contato programado para 13/09/2026.",
        "created_at":  "2026-09-12T18:12:28.539+00:00"
    },
    {
        "id":  "CRM-GAB-DENISEFERRARINI-20260907",
        "name":  "Denise Ferrarini Neto Hallgren",
        "instagram":  "deferrarini.",
        "phone":  "",
        "city":  "Brasil",
        "stage":  "abordagem",
        "stage_label":  "Abordagem Inicial",
        "channel":  "instagram",
        "pipeline":  "instagram",
        "value":  0,
        "temperature":  "morno",
        "priority":  "MEDIA",
        "commercial_line":  "Linha Internacional",
        "followup_status":  "Ativo",
        "followup_date":  "2024-05-25",
        "notes":  "CadÃªncia: Relacionamento antigo reativado em 07/09/2026. Histórico visível desde 25/05/2024, com novos contatos em 29/05/2024, 22/07/2026, 23/07/2026, 22/08/2026, 23/08/2026, 24/08/2026 e nova entrada em 07/09/2026. Como há histórico prévio comprovado, tratar como REATIVAÇÃO, não lead novo. Se não responder hoje, retomar em 08/09 com micropergunta objetiva ligada ao ambiente/modelo.\r\n\r\nHistÃ³rico: Denise Ferrarini Neto Hallgren, Instagram @deferrarini. Histórico visível: em 25/05/2024 pediu orçamento; recebeu proposta de conjunto em alumínio, madeira cumaru e estofados impermeáveis por R$ 34.700. Em 29/05/2024 recebeu proposta de conjunto em alumínio com pintura epóxi, tricô náutico e estofados impermeáveis, sofá 160x80, poltrona 80x80 e mesa de centro 80cm, por R$ 33.900. Em 22/07/2026 voltou a pedir informações; em 23/07 houve novo atendimento e ligação. Em 22/08/2026 perguntou \u0027Como faço para encomendar?\u0027; em 23/08 recebeu nova abordagem e em 24/08 houve ligação. Em 07/09/2026 às 13:28 pediu novamente mais informações; às 13:29 Gabriel fez ligação de áudio e enviou dois áudios de 20s e referência visual. Também já foi apresentada às linhas Premium, Standard, Internacional e Interna Dubai e recebeu a pergunta \u0027Será pra área externa ou interna?\u0027. Valores antigos são históricos e NÃO devem ser tratados como orçamento atual. Não há telefone, cidade/UF, medidas atuais, orçamento atual, prazo ou modelo fechado confirmados. Inferência: lead morno/quente por recorrência e pergunta anterior sobre como encomendar, mas com histórico longo sem fechamento; temperatura ~64/100 e probabilidade ~35%. PIFF-PAFF: Investigação/Filtro, com necessidade de retomar necessidade atual antes de proposta. Posse da bola: CLIENT.",
        "created_at":  "2026-09-09T15:51:44.256114+00:00"
    },
    {
        "id":  "CRM-GAB-JOCILENEMOZER-20260907",
        "name":  "Jocilene Mozer",
        "instagram":  "jocilenemozer.",
        "phone":  "",
        "city":  "catálogo/or",
        "stage":  "abordagem",
        "stage_label":  "Abordagem Inicial",
        "channel":  "instagram",
        "pipeline":  "instagram",
        "value":  0,
        "temperature":  "morno",
        "priority":  "MEDIA",
        "commercial_line":  "Linha Premium",
        "followup_status":  "Ativo",
        "followup_date":  "2026-09-12",
        "notes":  "CadÃªncia: Lead reativado pelo Instagram em 06/09/2026 às 19:35 ao responder anúncio com \u0027Gostaria de mais informações!\u0027. Em 07/09/2026 às 09:38 houve ligação de áudio e, em seguida, áudio de 9s, peça de apresentação Caribe e perguntas de investigação. Bola com CLIENT. Aplicar D2 em 08/09 e D3 em 09/09 se não houver resposta; depois D+7/D+14.\r\n\r\nHistÃ³rico: Jocilene Mozer, Instagram @jocilenemozer. Histórico disponível mostra primeiro contato em 29/04/2023 via anúncio, quando perguntou \u0027Qual valor\u0027 e disse ter interesse e querer mais informações. Em 30/04/2023 houve atendimento da antiga equipe D_Luxo, com convite para catálogo/orçamento e link de WhatsApp; cliente respondeu \u0027Obrigada\u0027 com coração. Em 01/06 (ano não explicitamente visível no print, no contexto do histórico antigo) Nathaly retomou se apresentando como equipe D_Luxo, especialista em móveis de luxo para áreas externas, houve ligação às 16:11 e envio de material/áudio. Em 06/09/2026 às 19:35 Jocilene respondeu novamente a anúncio: \u0027Gostaria de mais informações!\u0027. Em 07/09/2026 às 09:38 Gabriel realizou ligação de áudio; depois enviou áudio de 9s, peça institucional Caribe e perguntou se o espaço está pronto ou em obra, além de pedir WhatsApp para enviar mais vídeos, fotos e detalhes. Fatos: interesse renovado e origem por anúncio/Instagram; interesse geral em móveis de alto padrão/área externa. Não informado: telefone, cidade/UF, medidas, ambiente exato, orçamento, prazo, decisores e produtos específicos. Inferência: lead quente pela reativação espontânea após longo histórico; temperatura estimada 78/100, probabilidade de fechamento 40% até qualificação. PIFF-PAFF em Posicionamento + Investigação/Filtro. Posse da bola: CLIENT.\n\n[11/09/2026, 15:31 - Contato Instagram]: Chamada/conversa realizada via Direct hoje. Próximo contato programado para 12/09/2026.",
        "created_at":  "2026-09-11T18:31:02.752+00:00"
    },
    {
        "id":  "CRM-GAB-0116",
        "name":  "Carol (@carolroesner)",
        "instagram":  "carolroesner",
        "phone":  "",
        "city":  "Brasil",
        "stage":  "novo",
        "stage_label":  "Novo Lead",
        "channel":  "instagram",
        "pipeline":  "instagram",
        "value":  0,
        "temperature":  "morno",
        "priority":  "MEDIA",
        "commercial_line":  "Linha Premium",
        "followup_status":  "Ativo",
        "followup_date":  "2026-09-12",
        "notes":  "CadÃªncia: Cadência 3 Dias\r\n\r\nHistÃ³rico: Qualificar espa?o e interesse.\n\n[11/09/2026, 17:35 - Contato Instagram]: Chamada/conversa realizada via Direct hoje. Próximo contato programado para 12/09/2026.",
        "created_at":  "2026-09-11T20:35:09.75+00:00"
    },
    {
        "id":  "CRM-GAB-ANTONIA-DLUXO",
        "name":  "Antonia Santos (@cidagss)",
        "instagram":  "cidagss",
        "phone":  "",
        "city":  "Brasil",
        "stage":  "novo",
        "stage_label":  "Novo Lead",
        "channel":  "instagram",
        "pipeline":  "instagram",
        "value":  0,
        "temperature":  "morno",
        "priority":  "MEDIA",
        "commercial_line":  "Linha Internacional",
        "followup_status":  "Ativo",
        "followup_date":  "2026-09-13",
        "notes":  "CadÃªncia: Cadência 3 Dias\r\n\r\nHistÃ³rico: Lead novo do Instagram. Origem: Dluxo, perfil da própria Caribe Móveis operando com outro nome comercial. Em 29/08/2026 pediu catálogo espontaneamente e selecionou \u0027Quero mais informações\u0027. Gabriel se apresentou, tentou ligação de áudio às 10:11 e apresentou as 4 linhas: Premium, Standard, Internacional e Interna Dubai de Alto Padrão. Aguardando escolha da linha de interesse.\n\n[11/09/2026, 15:30 - Contato Instagram]: Chamada/conversa realizada via Direct hoje. Próximo contato programado para 12/09/2026.\n\n[12/09/2026, 15:12 - Contato Instagram]: Chamada/conversa realizada via Direct hoje. Próximo contato programado para 13/09/2026.",
        "created_at":  "2026-09-12T18:12:26.649+00:00"
    },
    {
        "id":  "CRM-GAB-0034",
        "name":  "Sirley Brito Lobo (@sirleybrito930)",
        "instagram":  "sirleybrito930",
        "phone":  "",
        "city":  "Brasil",
        "stage":  "novo",
        "stage_label":  "Novo Lead",
        "channel":  "instagram",
        "pipeline":  "instagram",
        "value":  0,
        "temperature":  "morno",
        "priority":  "MEDIA",
        "commercial_line":  "Linha Premium",
        "followup_status":  "Ativo",
        "followup_date":  "2026-09-19",
        "notes":  "CadÃªncia: Cadência 3 Dias\r\n\r\nHistÃ³rico: Padr?o IG aplicado.\n\n[11/09/2026, 17:01:38 - IA ChatGPT (Gabriel Lima)]: 11/09/2026 — contato/follow-up realizado hoje pelo Instagram. Tentativa de ligação e mensagem enviada pedindo retorno sobre o interesse nos móveis. Marcar abordagem de hoje como feita/concluída.\n\n[12/09/2026, 14:56 - Follow-up Instagram]: Contato realizado hoje. Próximo contato agendado para 19/09/2026.",
        "created_at":  "2026-09-12T17:56:46.698+00:00"
    },
    {
        "id":  "CRM-GAB-NEW-DERMATOTHAYLALUTTERBACH",
        "name":  "@dermatothaylalutterbach",
        "instagram":  "dermatothaylalutterbach",
        "phone":  "",
        "city":  "Brasil",
        "stage":  "novo",
        "stage_label":  "Novo Lead",
        "channel":  "instagram",
        "pipeline":  "instagram",
        "value":  0,
        "temperature":  "morno",
        "priority":  "MEDIA",
        "commercial_line":  "Linha Premium",
        "followup_status":  "Ativo",
        "followup_date":  "2026-09-13",
        "notes":  "CadÃªncia: Cadência 3 Dias\r\n\r\nHistÃ³rico: [24/08/2026]: Novo lead recebido via Instagram em\n\n[11/09/2026, 17:44:06 - IA ChatGPT (Gabriel Lima)]: 11/09/2026 — já falei hoje pelo Instagram. Foram feitas tentativas de ligação e enviada mensagem de follow-up perguntando se desistiu dos móveis ou adiou a compra. Lead veio de conversa comercial iniciada após perguntar sobre opções de entrega.\n\n[12/09/2026, 14:57 - Contato Instagram]: Chamada/conversa realizada via Direct hoje. Próximo contato programado para 13/09/2026.",
        "created_at":  "2026-09-12T17:57:11.575+00:00"
    },
    {
        "id":  "CRM-GAB-6801",
        "name":  "Luzirene L. Santos",
        "instagram":  "",
        "phone":  "",
        "city":  "Instagram/An",
        "stage":  "novo",
        "stage_label":  "Novo Lead",
        "channel":  "instagram",
        "pipeline":  "instagram",
        "value":  0,
        "temperature":  "frio",
        "priority":  "BAIXA",
        "commercial_line":  "Linha Premium",
        "followup_status":  "Ativo",
        "followup_date":  "2026-09-13",
        "notes":  "CadÃªncia: Contextual\r\n\r\nHistÃ³rico: Origem Instagram/Anuncio (Ceara). Consultou sofas  [Histórico Antigo]: [24/08/2026]: Consultou sofas de R$ 15k a 18k. Elogiou (\u0027Top mesmo\u0027),\n\n[12/09/2026, 15:12 - Contato Instagram]: Chamada/conversa realizada via Direct hoje. Próximo contato programado para 13/09/2026.",
        "created_at":  "2026-09-12T18:12:09.93+00:00"
    },
    {
        "id":  "CRM-GAB-NEIDEISAAC-20260907",
        "name":  "Neide Isaac (@neide.isaac)",
        "instagram":  "neide.isaac",
        "phone":  "",
        "city":  "Brasil",
        "stage":  "novo",
        "stage_label":  "Novo Lead",
        "channel":  "instagram",
        "pipeline":  "instagram",
        "value":  0,
        "temperature":  "morno",
        "priority":  "MEDIA",
        "commercial_line":  "Linha Premium",
        "followup_status":  "Ativo",
        "followup_date":  "2026-09-13",
        "notes":  "Lead NOVO confirmado por Gabriel em 07/09/2026.\n\n[12/09/2026, 15:12 - Contato Instagram]: Chamada/conversa realizada via Direct hoje. Próximo contato programado para 13/09/2026.",
        "created_at":  "2026-09-12T18:12:18.274+00:00"
    },
    {
        "id":  "lead-1789047429676-nz0oj",
        "name":  "Marilene Durães",
        "instagram":  "marilenegduraes",
        "phone":  "",
        "city":  "Brasil",
        "stage":  "abordagem",
        "stage_label":  "Abordagem Inicial",
        "channel":  "instagram",
        "pipeline":  "instagram",
        "value":  0,
        "temperature":  "morno",
        "priority":  "ALTA",
        "commercial_line":  "Móveis Externos",
        "followup_status":  "Ativo",
        "followup_date":  null,
        "notes":  "[10/09/2026, 10:37:09 - IA ChatGPT (Gabriel Lima)]: Lead captado pelo Instagram via resposta a anúncio em 10/09/2026. Cliente pediu consulta de preço de produto. Gabriel se apresentou e realizou 1 ligação de áudio entre 10:31 e 10:34. Na ligação, Marilene informou que ainda está pesquisando e achou alto o valor de aproximadamente R$ 49.000 por um jogo de sofá. Após a ligação, Gabriel enviou vídeos de duas peças à pronta entrega e informou condição de R$ 19.000 cada. Contabilizar 1 ligação na rotina diária. Objeção principal: preço / comparação de mercado. Ainda faltam ambiente, medidas, composição desejada, prazo de compra e faixa de investimento. Próximo passo: investigar a referência de preço dela e montar alternativa de composição com melhor encaixe de orçamento, sem entrar em desconto prematuro.\n\n[10/09/2026, 10:37:24 - IA ChatGPT (Gabriel Lima)]: MÉTRICAS DO DIA: contabilizar este atendimento como 1 ligação realizada e 1 ligação de qualidade/qualificada, pois na conversa foram obtidas informações comerciais relevantes: cliente está em fase de pesquisa e apresentou objeção clara de preço (considerou aproximadamente R$ 49 mil alto para o jogo de sofá). Não contabilizar como remarketing neste momento, pois é atendimento de lead novo vindo de anúncio.",
        "created_at":  "2026-09-10T13:37:24.794+00:00"
    },
    {
        "id":  "CRM-GAB-ROSILENE123ESPIRITO",
        "name":  "Rosilene (@rosilene123espirito)",
        "instagram":  "rosilene123espirito",
        "phone":  "",
        "city":  "Brasil",
        "stage":  "novo",
        "stage_label":  "Novo Lead",
        "channel":  "instagram",
        "pipeline":  "instagram",
        "value":  0,
        "temperature":  "morno",
        "priority":  "MEDIA",
        "commercial_line":  "Linha Internacional",
        "followup_status":  "Ativo",
        "followup_date":  "2026-09-13",
        "notes":  "CadÃªncia: Cadência 3 Dias: D1 em 05/09/2026 se não responder, D2 em 06/09 e D3 em 07/09.\r\n\r\nHistÃ³rico: Lead novo Instagram Dluxo em 04/09/2026. Perfil @rosilene123espirito. Origem: interação com publicação/anúncio do perfil d_luxo.imports. Gabriel se apresentou como especialista em móveis de alto padrão, realizou tentativa/ligação de áudio às 08:50 e apresentou as 4 linhas: Premium, Standard, Nova Linha Internacional e Linha Interna Dubai de Alto Padrão. Também respondeu à referência visual com áudio de 14s. Não há resposta textual visível da cliente após a apresentação nos prints fornecidos. Produto específico, telefone, cidade/UF, medidas, prazo, orçamento e decisores ainda não informados. PIFF-PAFF: Posicionamento + Filtro inicial. Temperatura estimada 50/100; probabilidade 15% até qualificação. Posse da bola: CLIENT.\n\n[11/09/2026, 15:32 - Contato Instagram]: Chamada/conversa realizada via Direct hoje. Próximo contato programado para 12/09/2026.\n\n[12/09/2026, 15:12 - Contato Instagram]: Chamada/conversa realizada via Direct hoje. Próximo contato programado para 13/09/2026.",
        "created_at":  "2026-09-12T18:12:23.578+00:00"
    },
    {
        "id":  "lead-1789048249327-h9hbh",
        "name":  "Érica",
        "instagram":  "ericamsmix",
        "phone":  "",
        "city":  "Brasil",
        "stage":  "novo",
        "stage_label":  "Novo Lead",
        "channel":  "instagram",
        "pipeline":  "instagram",
        "value":  0,
        "temperature":  "morno",
        "priority":  "MEDIA",
        "commercial_line":  "Móveis Externos",
        "followup_status":  "Ativo",
        "followup_date":  null,
        "notes":  "[10/09/2026, 10:50:49 - IA ChatGPT (Gabriel Lima)]: Lead captado pelo Instagram via resposta a anúncio em 10/09/2026. Cliente interagiu com conteúdo de conjunto para área externa. Gabriel se apresentou como especialista em móveis de alto padrão, realizou 1 ligação de áudio entre 10:42 e 10:43, respondeu ao conteúdo enviado e apresentou as 4 linhas comerciais: Premium, Standard, Internacional e Interna Dubai de alto padrão, perguntando qual linha desperta interesse. Contabilizar 1 ligação na rotina diária. Não contabilizar como ligação de qualidade neste momento, pois não há informação suficiente de diagnóstico obtida na chamada. Não contabilizar como remarketing, pois é atendimento de lead novo vindo de anúncio. Próximo passo: descobrir qual ambiente ela quer mobiliar e qual linha/faixa de investimento faz mais sentido.",
        "created_at":  "2026-09-10T13:50:49.326+00:00"
    },
    {
        "id":  "lead-1789049090062-070ra",
        "name":  "Wander Cunha Moreira",
        "instagram":  "wandercunhamoreira",
        "phone":  "",
        "city":  "Brasil",
        "stage":  "novo",
        "stage_label":  "Novo Lead",
        "channel":  "instagram",
        "pipeline":  "instagram",
        "value":  0,
        "temperature":  "morno",
        "priority":  "MEDIA",
        "commercial_line":  "Móveis Externos",
        "followup_status":  "Ativo",
        "followup_date":  null,
        "notes":  "[10/09/2026, 11:04:50 - IA ChatGPT (Gabriel Lima)]: Lead captado pelo Instagram via resposta a anúncio. Em 10/09/2026, Gabriel realizou 1 ligação de áudio entre 11:01 e 11:02, respondeu ao conteúdo do anúncio e apresentou as 4 linhas comerciais: Premium, Standard, Internacional e Interna Dubai de alto padrão, perguntando qual linha desperta interesse. Contabilizar 1 ligação na rotina diária. Não contabilizar como ligação de qualidade, pois não há informação comercial nova suficiente registrada a partir da chamada. Não contabilizar como remarketing, pois é atendimento de lead novo vindo de anúncio. Próximo passo: descobrir qual ambiente ele quer mobiliar e a faixa de investimento para direcionar a linha correta.",
        "created_at":  "2026-09-10T14:04:50.062+00:00"
    },
    {
        "id":  "insta-1789185782935-uc75x",
        "name":  "Alessandra Steigleder Guarda",
        "instagram":  "alessandra_guarda",
        "phone":  "",
        "city":  "Brasil",
        "stage":  "abordagem",
        "stage_label":  "Abordagem Inicial",
        "channel":  "instagram",
        "pipeline":  "instagram",
        "value":  0,
        "temperature":  "quente",
        "priority":  "ALTA",
        "commercial_line":  "Linha Premium",
        "followup_status":  "Ativo",
        "followup_date":  null,
        "notes":  "[12/09/2026, 01:03:02 - IA ChatGPT (Gabriel Lima)]: [Canal: Instagram] Interessada no valor do conjunto\n\n[12/09/2026, 07:17:36 - IA ChatGPT (Gabriel Lima)]: [Canal: Instagram] Interessada no valor do conjunto\n\n[12/09/2026, 07:28:45 - IA ChatGPT Piff-Paff (Gabriel Lima)]: [Canal: Instagram] Interessada no valor do conjunto\n\n[12/09/2026, 07:42:23 - IA ChatGPT Piff-Paff (Gabriel Lima)]: [Canal: Instagram] Interessada no valor do conjunto\n\n[12/09/2026, 09:34:13 - IA ChatGPT Piff-Paff (Gabriel Lima)]: [Canal: Instagram] Interessada no valor do conjunto",
        "created_at":  "2026-09-12T12:34:13.878+00:00"
    },
    {
        "id":  "lead-1789050078808-ibgf1",
        "name":  "Ney Ortis",
        "instagram":  "neyortis",
        "phone":  "",
        "city":  "Brasil",
        "stage":  "novo",
        "stage_label":  "Novo Lead",
        "channel":  "instagram",
        "pipeline":  "instagram",
        "value":  0,
        "temperature":  "morno",
        "priority":  "ALTA",
        "commercial_line":  "Móveis Externos",
        "followup_status":  "Ativo",
        "followup_date":  null,
        "notes":  "[10/09/2026, 11:21:18 - IA ChatGPT (Gabriel Lima)]: Lead captado pelo Instagram via resposta a anúncio em 10/09/2026. Cliente perguntou às 11:07: \u0027Quais são suas opções de entrega?\u0027. Gabriel se apresentou como especialista em móveis de alto padrão, realizou 1 ligação de áudio entre 11:14 e 11:14, enviou imagem de conjunto externo, áudio e apresentou as 4 linhas comerciais: Premium, Standard, Internacional e Interna Dubai de alto padrão. Contabilizar 1 ligação na rotina diária. Não contabilizar como ligação de qualidade, pois não há diagnóstico comercial novo suficiente registrado a partir da chamada. Não contabilizar como remarketing, pois é lead novo vindo de anúncio. Próximo passo: responder objetivamente a dúvida sobre entrega e pedir cidade/CEP antes de aprofundar em linha/preço.",
        "created_at":  "2026-09-10T14:21:18.808+00:00"
    },
    {
        "id":  "lead-1789087272237-00pdn",
        "name":  "Tiago Cymbalista",
        "instagram":  "cymbalistatiago",
        "phone":  "",
        "city":  "Brasil",
        "stage":  "novo",
        "stage_label":  "Novo Lead",
        "channel":  "instagram",
        "pipeline":  "instagram",
        "value":  0,
        "temperature":  "morno",
        "priority":  "ALTA",
        "commercial_line":  "Instagram / Anúncio",
        "followup_status":  "Ativo",
        "followup_date":  null,
        "notes":  "[10/09/2026, 21:41:12 - IA ChatGPT (Gabriel Lima)]: Lead captado via Instagram. Pergunta inicial em 10/09/2026: \u0027Quais são suas opções de entrega?\u0027. Gabriel se apresentou como especialista em móveis de alto padrão, respondeu em áudio e enviou explicação das 4 linhas: Premium, Standard, Nova Linha Internacional e Linha Interna Dubai de Alto Padrão, perguntando qual linha despertava mais interesse. Próxima melhor ação: responder objetivamente sobre modalidades/prazos/regiões de entrega e fazer uma única pergunta de qualificação sobre cidade/CEP ou destino da entrega. Evitar desviar novamente para escolha de linha antes de sanar a dúvida logística.\n\n[10/09/2026, 21:54:38 - IA ChatGPT (Gabriel Lima)]: Atualização 10/09/2026 21:54: após apresentar as 4 linhas, Gabriel enviou a pergunta \u0027Você já tem o espaço pronto? Ou está em obra?\u0027. Mensagem visualizada há cerca de 12 minutos, sem resposta até o momento. A dúvida inicial do lead continua sendo sobre opções de entrega. Próxima melhor ação: evitar nova mensagem imediata; aguardar resposta. Se não houver retorno, retomar com mensagem curta respondendo diretamente a logística e pedindo cidade/CEP.",
        "created_at":  "2026-09-11T00:54:38.965+00:00"
    },
    {
        "id":  "lead-1789093587119-0nkow",
        "name":  "Sintia de Souza Philot",
        "instagram":  "sintiadesouzaphilot",
        "phone":  "",
        "city":  "Brasil",
        "stage":  "abordagem",
        "stage_label":  "Abordagem Inicial",
        "channel":  "instagram",
        "pipeline":  "instagram",
        "value":  0,
        "temperature":  "morno",
        "priority":  "ALTA",
        "commercial_line":  "Instagram / Reativação de lead",
        "followup_status":  "Ativo",
        "followup_date":  null,
        "notes":  "[10/09/2026, 23:26:27 - IA ChatGPT (Gabriel Lima)]: Lead identificada em conversa do Instagram em 10/09/2026. Não havia cadastro no CRM. Histórico visível: em 16/08/2021 recebeu oferta de conjunto com estrutura em alumínio, almofadas em couro náutico, corda náutica e madeira cumaru por R$ 12.900; posteriormente recebeu opção de conjunto de sofá em alumínio, aquablock/couro náutico e cordas náuticas por R$ 13.890. Em 06/07/2022 recebeu oferta de balanço em tricô náutico com estofados em aquablock/couro náutico por R$ 8.990. Também recebeu proposta de conjunto em madeira de lei e corda náutica: sofá 150x90 R$ 12.400, poltrona 80x90 R$ 6.800/un, centro 80x60 R$ 3.800, conjunto R$ 29.800. Em 10/09/2026 houve nova interação/resposta a anúncio e Gabriel enviou apresentação profissional e as 4 linhas atuais (Premium, Standard, Nova Linha Internacional e Linha Interna Dubai de Alto Padrão), perguntando qual linha interessa. Perfil com histórico antigo e nova reativação; tratar como lead reativada, evitar repetir abordagem genérica e usar o histórico para condução personalizada.",
        "created_at":  "2026-09-11T02:26:27.119+00:00"
    },
    {
        "id":  "lead-1789129566912-5fbb2",
        "name":  "Priscila Costa",
        "instagram":  "pricarla9",
        "phone":  "",
        "city":  "Brasil",
        "stage":  "novo",
        "stage_label":  "Novo Lead",
        "channel":  "instagram",
        "pipeline":  "instagram",
        "value":  0,
        "temperature":  "quente",
        "priority":  "ALTA",
        "commercial_line":  "Instagram / Resposta de anúncio",
        "followup_status":  "Ativo",
        "followup_date":  null,
        "notes":  "[11/09/2026, 09:26:06 - IA ChatGPT (Gabriel Lima)]: Lead captada pelo Instagram via resposta de anúncio. Pediu consulta de preço de um produto. Gabriel se apresentou como especialista em móveis de alto padrão, enviou apresentação das 4 linhas e tentou ligação de áudio às 09:24. Próxima ação: identificar a peça de interesse, medidas do ambiente e então indicar linha/valor.",
        "created_at":  "2026-09-11T12:26:06.912+00:00"
    },
    {
        "id":  "insta-1789134118180-rpgu6",
        "name":  "Ana Rita Rita",
        "instagram":  "anarita6889",
        "phone":  "",
        "city":  "Brasil",
        "stage":  "novo",
        "stage_label":  "Novo Lead",
        "channel":  "instagram",
        "pipeline":  "instagram",
        "value":  0,
        "temperature":  "quente",
        "priority":  "ALTA",
        "commercial_line":  "Leads Instagram",
        "followup_status":  "Ativo",
        "followup_date":  null,
        "notes":  "[11/09/2026, 10:41:58 - IA ChatGPT (Gabriel Lima)]: Lead captada pelo Instagram via resposta de anúncio. Perguntou o valor do conjunto mostrado no anúncio. Gabriel se apresentou como especialista em móveis de alto padrão, tentou ligação de áudio às 10:37/10:38 e enviou apresentação das linhas. Próxima ação: identificar exatamente o conjunto do anúncio, confirmar cidade/CEP e medidas do espaço; então informar valor e conduzir para proposta.\n\n[11/09/2026, 18:08:48 - IA ChatGPT (Gabriel Lima)]: 11/09/2026 — já falei hoje pelo Instagram. Lead veio de resposta a anúncio e perguntou o valor do conjunto. Foram feitas tentativas de ligação e mensagem de follow-up perguntando se desistiu da compra. Manter como lead novo e quente até nova resposta.",
        "created_at":  "2026-09-11T21:08:48.097+00:00"
    },
    {
        "id":  "lead-1788980693732-bpjut",
        "name":  "Elisangela Cruz",
        "instagram":  "elisangelaocruz",
        "phone":  "",
        "city":  "Brasil",
        "stage":  "abordagem",
        "stage_label":  "Abordagem Inicial",
        "channel":  "instagram",
        "pipeline":  "instagram",
        "value":  0,
        "temperature":  "morno",
        "priority":  "ALTA",
        "commercial_line":  "Instagram / Linha a definir",
        "followup_status":  "Ativo",
        "followup_date":  null,
        "notes":  "[09/09/2026, 16:04:53 - IA ChatGPT (Gabriel Lima)]: Lead identificado via Instagram em 09/09/2026. Perguntou: \u0027Quais são as opções de entrega?\u0027. Gabriel apresentou as 4 linhas: Premium, Standard, Internacional e Interna Dubai de Alto Padrão e perguntou qual linha interessa. Ainda não informado: cidade/UF, produto/ambiente, medidas, orçamento, prazo e decisores. Etapa PIFF-PAFF: Investigação/Filtro. Posse da bola: CLIENT. Próxima ação: aguardar resposta; se escolher uma linha, qualificar cidade/UF e peças/ambiente desejados. Follow-up D+1 se não responder.",
        "created_at":  "2026-09-09T19:04:53.732+00:00"
    },
    {
        "id":  "insta-1789216765272-r2ugr",
        "name":  "Luciana Simanavicius Pezzutti",
        "instagram":  "lucianasimana",
        "phone":  "43991218822",
        "city":  "Brasil",
        "stage":  "abordagem",
        "stage_label":  "Abordagem Inicial",
        "channel":  "instagram",
        "pipeline":  "instagram",
        "value":  0,
        "temperature":  "quente",
        "priority":  "ALTA",
        "commercial_line":  "Área Externa / Sofá e Conjunto",
        "followup_status":  "Ativo",
        "followup_date":  null,
        "notes":  "[12/09/2026, 09:39:25 - IA ChatGPT (Gabriel Lima)]: Lead captado pelo Instagram. Cliente já comprou anteriormente com a Caribe Móveis e informou que já conhece a qualidade. Cidade de entrega: Londrina/PR. Demonstrou interesse atual em um sofá/conjunto de área externa mostrado em anúncio e pediu medidas e valor do conjunto completo. Também já havia perguntado anteriormente por cadeira e solicitado catálogo de produtos. Contato confirmado pela própria cliente: (43) 99121-8822. Houve tentativa de ligação pelo Instagram, mas não conseguiram se ouvir; cliente preferiu seguir contato por WhatsApp.",
        "created_at":  "2026-09-12T12:39:25.272+00:00"
    },
    {
        "id":  "lead-1789130544628-dj2mg",
        "name":  "Jacqueline Crepaldi Souza",
        "instagram":  "jacquelinecrepaldisouza",
        "phone":  "",
        "city":  "Brasil",
        "stage":  "novo",
        "stage_label":  "Novo Lead",
        "channel":  "instagram",
        "pipeline":  "instagram",
        "value":  0,
        "temperature":  "quente",
        "priority":  "ALTA",
        "commercial_line":  "Leads Instagram",
        "followup_status":  "Ativo",
        "followup_date":  null,
        "notes":  "[11/09/2026, 09:42:24 - IA ChatGPT (Gabriel Lima)]: Lead captada pelo Instagram. Perguntou: \u0027Como faço para encomendar?\u0027 em resposta a conteúdo da Caribe Móveis. Gabriel se apresentou como especialista em móveis de alto padrão, tentou ligação de áudio às 09:39/09:40, enviou áudio e apresentou as 4 linhas. Próxima ação: identificar qual peça/conjunto deseja, medidas do ambiente, cidade de entrega e preferência de linha; conduzir para orçamento.",
        "created_at":  "2026-09-11T12:48:49.005+00:00"
    },
    {
        "id":  "CRM-GAB-0063",
        "name":  "Leide Souza (@leide.neu9840)",
        "instagram":  "leide.neu9840",
        "phone":  "",
        "city":  "Brasil",
        "stage":  "novo",
        "stage_label":  "Novo Lead",
        "channel":  "instagram",
        "pipeline":  "instagram",
        "value":  0,
        "temperature":  "morno",
        "priority":  "MEDIA",
        "commercial_line":  "Linha Premium",
        "followup_status":  "Ativo",
        "followup_date":  "2026-09-07",
        "notes":  "CadÃªncia: Cadência 3 Dias\n\nHistÃ³rico: Aguardando resposta sobre espa?o pronto ou em cons",
        "created_at":  "2026-09-07T14:52:34Z"
    },
    {
        "id":  "PEND-001",
        "name":  "Paula GuimarÃ£es (@paula.guine)",
        "instagram":  "paula.guine",
        "phone":  "",
        "city":  "Brasil",
        "stage":  "novo",
        "stage_label":  "Novo Lead",
        "channel":  "instagram",
        "pipeline":  "instagram",
        "value":  0,
        "temperature":  "morno",
        "priority":  "MEDIA",
        "commercial_line":  "Linha Premium",
        "followup_status":  "Ativo",
        "followup_date":  "2026-09-07",
        "notes":  "CadÃªncia: Cadência 3 Dias\n\nHistÃ³rico: Aguardando rea??o ? campanha.",
        "created_at":  "2026-09-07T14:52:34Z"
    },
    {
        "id":  "CRM-GAB-DUDU-CLIENTE-INSTAGRAM",
        "name":  "Dudu Cliente Instagram",
        "instagram":  "",
        "phone":  "",
        "city":  "Instagram/Wh",
        "stage":  "conversa",
        "stage_label":  "Em Conversa",
        "channel":  "instagram",
        "pipeline":  "instagram",
        "value":  0,
        "temperature":  "frio",
        "priority":  "BAIXA",
        "commercial_line":  "Linha Premium",
        "followup_status":  "Ativo",
        "followup_date":  "2026-09-04",
        "notes":  "CadÃªncia: Nutrição longa: reavaliar em 30 a 60 dias apenas se houver gancho real de nova categoria para a área gourmet; caso contrário, sem follow-up ativo.\n\nHistÃ³rico: Histórico completo do ZIP lido em 04/09/2026. Origem Instagram/WhatsApp. Dudu é de Sabará/MG; procurava 2 espreguiçadeiras para a área de piscina, preferencialmente de corda náutica. Área gourmet já estava montada e faltavam apenas as espreguiçadeiras. Em 24/08 Gabriel apresentou diversos modelos, pronta entrega e catálogo; Dudu elogiou o atendimento e disse que analisaria. Em 28/08, após tentativa de ligação de 1 segundo e retomada, Dudu informou: \u0027Acabou que minha esposa ganhou as espreguiçadeiras de presente da mãe dela\u0027. A necessidade original, portanto, foi encerrada sem venda para a Caribe. Dudu agradeceu bastante pelo atendimento e deixou relacionamento positivo. PIFF-PAFF: negociação encerrada / Fidelização e possível indicação futura. Temperatura atual 20/100; probabilidade imediata 0–5% (inferência). Posse da bola: NONE para a compra original. Telefone não aparece no conteúdo textual exportado, por isso não foi inventado.",
        "created_at":  "2026-09-07T14:52:34Z"
    },
    {
        "id":  "insta-gab-002",
        "name":  "Carla GuimarÃ£es",
        "instagram":  "carlaguimaraes_decor",
        "phone":  "",
        "city":  "Belo Horizonte - MG",
        "stage":  "novo",
        "stage_label":  "Novo Lead",
        "channel":  "instagram",
        "pipeline":  "instagram",
        "value":  42000,
        "temperature":  "quente",
        "priority":  "ALTA",
        "commercial_line":  "Linha Premium",
        "followup_status":  "Chamar Hoje",
        "followup_date":  "2026-09-24",
        "notes":  "Perguntou valores e prazos da chaise Tulum no direct do Instagram.",
        "created_at":  "2026-09-24T11:00:43.154Z"
    },
    {
        "id":  "CRM-GAB-0035-dup2",
        "name":  "Marinês Cavalin Pivetta (@mari_pivetta)",
        "instagram":  "mari_pivetta",
        "phone":  "",
        "city":  "Mato Grosso",
        "stage":  "conversa",
        "stage_label":  "Em Conversa",
        "channel":  "instagram",
        "pipeline":  "instagram",
        "value":  0,
        "temperature":  "morno",
        "priority":  "MEDIA",
        "commercial_line":  "Linha Standard",
        "followup_status":  "Ativo",
        "followup_date":  "2026-09-14",
        "notes":  "Conjunto sofá 3L + 2 poltronas + mesa centro para MT.\n\nDetalhes: Áudio e tentativa de ligação enviados.",
        "created_at":  "2026-09-07T13:31:31Z"
    },
    {
        "id":  "CRM-GAB-0036-dup3",
        "name":  "Paula Braga (@paulasbraga)",
        "instagram":  "paulasbraga",
        "phone":  "",
        "city":  "Curitiba / Região",
        "stage":  "conversa",
        "stage_label":  "Em Conversa",
        "channel":  "instagram",
        "pipeline":  "instagram",
        "value":  0,
        "temperature":  "morno",
        "priority":  "MEDIA",
        "commercial_line":  "Linha Standard",
        "followup_status":  "Ativo",
        "followup_date":  "2026-09-14",
        "notes":  "Sofá 2 lugares + puff para sol e chuva.\n\nDetalhes: Reunião impediu ligação.",
        "created_at":  "2026-09-07T13:31:31Z"
    },
    {
        "id":  "CRM-GAB-0059-dup4",
        "name":  "Cicília Amorim Andrade (@ciciliapaes)",
        "instagram":  "ciciliapaes",
        "phone":  "",
        "city":  "Curitiba / Região",
        "stage":  "novo",
        "stage_label":  "Novo Lead",
        "channel":  "instagram",
        "pipeline":  "instagram",
        "value":  0,
        "temperature":  "frio",
        "priority":  "MEDIA",
        "commercial_line":  "Linha Premium",
        "followup_status":  "Ativo",
        "followup_date":  "2026-09-10",
        "notes":  "Tentativa de ligação, apresentação e imagem enviadas.\n\nDetalhes: Primeiro contato IG.",
        "created_at":  "2026-09-07T13:31:31Z"
    },
    {
        "id":  "CRM-GAB-0063-dup5",
        "name":  "Leide Souza (@leide.neu9840)",
        "instagram":  "leide.neu9840",
        "phone":  "",
        "city":  "Curitiba / Região",
        "stage":  "novo",
        "stage_label":  "Novo Lead",
        "channel":  "instagram",
        "pipeline":  "instagram",
        "value":  0,
        "temperature":  "frio",
        "priority":  "MEDIA",
        "commercial_line":  "Linha Standard",
        "followup_status":  "Ativo",
        "followup_date":  "2026-09-10",
        "notes":  "Sofá para área externa.\n\nDetalhes: Aguardando resposta sobre espaço pronto ou em construção.",
        "created_at":  "2026-09-07T13:31:31Z"
    },
    {
        "id":  "CRM-GAB-0116-dup6",
        "name":  "Carol (@carolroesner)",
        "instagram":  "carolroesner",
        "phone":  "",
        "city":  "Não informado",
        "stage":  "novo",
        "stage_label":  "Novo Lead",
        "channel":  "instagram",
        "pipeline":  "instagram",
        "value":  0,
        "temperature":  "frio",
        "priority":  "MEDIA",
        "commercial_line":  "Linha Premium",
        "followup_status":  "Ativo",
        "followup_date":  "2026-09-10",
        "notes":  "Lead novo via direct do Instagram.\n\nDetalhes: Qualificar espaço e interesse.",
        "created_at":  "2026-09-07T13:31:31Z"
    },
    {
        "id":  "PEND-001-dup7",
        "name":  "Paula Guimarães (@paula.guine)",
        "instagram":  "paula.guine",
        "phone":  "",
        "city":  "Não informada",
        "stage":  "novo",
        "stage_label":  "Novo Lead",
        "channel":  "instagram",
        "pipeline":  "instagram",
        "value":  0,
        "temperature":  "frio",
        "priority":  "MEDIA",
        "commercial_line":  "Linha Standard",
        "followup_status":  "Ativo",
        "followup_date":  "2026-09-10",
        "notes":  "Campanha de reativação enviada.\n\nDetalhes: Aguardando reação à campanha.",
        "created_at":  "2026-09-07T13:31:31Z"
    },
    {
        "id":  "CRM-GAB-DUDU-CLIENTE-INSTAGRAM-dup8",
        "name":  "Lead 554",
        "instagram":  "",
        "phone":  "",
        "city":  "Brasil",
        "stage":  "novo",
        "stage_label":  "Novo Lead",
        "channel":  "instagram",
        "pipeline":  "instagram",
        "value":  0,
        "temperature":  "morno",
        "priority":  "MEDIA",
        "commercial_line":  "Linha Premium",
        "followup_status":  "Ativo",
        "followup_date":  null,
        "notes":  "Lead histÃ³rico preservado.",
        "created_at":  "2026-09-09T17:00:00.000Z"
    },
    {
        "id":  "CRM-GAB-0035-dup9",
        "name":  "Marin�s Cavalin Pivetta (@mari_pivetta)",
        "instagram":  "mari_pivetta",
        "phone":  "",
        "city":  "Mato Grosso",
        "stage":  "novo",
        "stage_label":  "Novo Lead",
        "channel":  "instagram",
        "pipeline":  "instagram",
        "value":  0,
        "temperature":  "morno",
        "priority":  "MEDIA",
        "commercial_line":  "Linha Premium",
        "followup_status":  "Ativo",
        "followup_date":  null,
        "notes":  "Lead histÃ³rico preservado.",
        "created_at":  "2026-09-09T17:00:00.000Z"
    },
    {
        "id":  "CRM-GAB-0059-dup10",
        "name":  "Cic�lia Amorim Andrade (@ciciliapaes)",
        "instagram":  "ciciliapaes",
        "phone":  "",
        "city":  "Curitiba / Regi�o",
        "stage":  "novo",
        "stage_label":  "Novo Lead",
        "channel":  "instagram",
        "pipeline":  "instagram",
        "value":  0,
        "temperature":  "morno",
        "priority":  "MEDIA",
        "commercial_line":  "Linha Premium",
        "followup_status":  "Ativo",
        "followup_date":  null,
        "notes":  "Lead histÃ³rico preservado.",
        "created_at":  "2026-09-09T17:00:00.000Z"
    },
    {
        "id":  "PEND-001-dup11",
        "name":  "Paula Guimar�es (@paula.guine)",
        "instagram":  "paula.guine",
        "phone":  "",
        "city":  "N�o informada",
        "stage":  "novo",
        "stage_label":  "Novo Lead",
        "channel":  "instagram",
        "pipeline":  "instagram",
        "value":  0,
        "temperature":  "morno",
        "priority":  "MEDIA",
        "commercial_line":  "Linha Premium",
        "followup_status":  "Ativo",
        "followup_date":  null,
        "notes":  "Lead histÃ³rico preservado.",
        "created_at":  "2026-09-09T17:00:00.000Z"
    },
    {
        "id":  "CRM-GAB-NEW-DERMATOTHAYLALUTTERBACH-dup12",
        "name":  "@dermatothaylalutterbach",
        "instagram":  "dermatothaylalutterbach",
        "phone":  "",
        "city":  "Brasil",
        "stage":  "novo",
        "stage_label":  "Novo Lead",
        "channel":  "instagram",
        "pipeline":  "instagram",
        "value":  0,
        "temperature":  "morno",
        "priority":  "MEDIA",
        "commercial_line":  "Linha Premium",
        "followup_status":  "Ativo",
        "followup_date":  null,
        "notes":  "Lead histÃ³rico preservado.",
        "created_at":  "2026-09-09T17:00:00.000Z"
    }
];

const DEFAULT_QUARANTINE_LEADS = [
  {
    id: 'resgate-001',
    name: 'Dr. Roberto Silveira',
    phone: '11984443322',
    instagram: 'dr.robertosilveira',
    city: 'Barueri - SP (Alphaville)',
    stage: 'a_contatar',
    stage_label: 'A Contatar',
    channel: 'quarentena',
    pipeline: 'quarentena',
    value: 85000,
    temperature: 'quente',
    priority: 'ALTA',
    commercial_line: 'Linha Premium',
    followup_status: 'A Contatar',
    notes: '[Ex-Vendedor Carlos]: Cliente fez orçamento em abril para área gourmet e piscina. Negociação parou por falta de retorno do vendedor. Oportunidade quente para resgate com nova abordagem consultiva.',
    user_id: SELLER_USER_ID
  },
  {
    id: 'resgate-002',
    name: 'Fabiana Montez (Arquiteta)',
    phone: '21971239988',
    instagram: 'fabianamontez.arq',
    city: 'Rio de Janeiro - RJ (Barra da Tijuca)',
    stage: 'a_contatar',
    stage_label: 'A Contatar',
    channel: 'quarentena',
    pipeline: 'quarentena',
    value: 120000,
    temperature: 'quente',
    priority: 'MAXIMA',
    commercial_line: 'Linha Internacional',
    followup_status: 'A Contatar',
    notes: '[Ex-Vendedor Carlos]: Especificação de 6 espreguiçadeiras e conjunto lounge. Projeto aprovado pelo cliente final, aguardando contato direto da fábrica.',
    user_id: SELLER_USER_ID
  },
  {
    id: 'resgate-003',
    name: 'Condomínio Reserva dos Pássaros (Síndico Marcos)',
    phone: '41998877665',
    instagram: '',
    city: 'Curitiba - PR',
    stage: 'tentativa_resgate',
    stage_label: 'Tentativa de Resgate',
    channel: 'quarentena',
    pipeline: 'quarentena',
    value: 165000,
    temperature: 'morno',
    priority: 'ALTA',
    commercial_line: 'Corporativo / Áreas Comuns',
    followup_status: 'Em Sondagem',
    notes: '[Ex-Vendedor Carlos]: Primeira abordagem de resgate feita. Síndico pediu para apresentar nova proposta com frete incluso diretamente à comissão de obras.',
    user_id: SELLER_USER_ID
  },
  {
    id: 'resgate-004',
    name: 'Helena Albuquerque',
    phone: '31991122334',
    instagram: 'helena.albuquerque.decor',
    city: 'Nova Lima - MG',
    stage: 'tentativa_resgate',
    stage_label: 'Tentativa de Resgate',
    channel: 'quarentena',
    pipeline: 'quarentena',
    value: 54000,
    temperature: 'morno',
    priority: 'MEDIA',
    commercial_line: 'Linha Premium',
    followup_status: 'Aguardando Catálogo',
    notes: '[Ex-Vendedor Carlos]: Contato realizado via ligação. Cliente gostou da linha alumínio naval e pediu catálogo atualizado para fechar antes do verão.',
    user_id: SELLER_USER_ID
  },
  {
    id: 'resgate-005',
    name: 'Maurício Vianna',
    phone: '47996554433',
    instagram: 'mauriciovianna_eng',
    city: 'Itapema - SC',
    stage: 'a_contatar',
    stage_label: 'A Contatar',
    channel: 'quarentena',
    pipeline: 'quarentena',
    value: 92000,
    temperature: 'quente',
    priority: 'ALTA',
    commercial_line: 'Linha Premium',
    followup_status: 'A Contatar',
    notes: '[Ex-Vendedor Carlos]: Casa de praia com varanda ampla. Interessado em mesa 10 lugares com cadeiras em corda terracota.',
    user_id: SELLER_USER_ID
  },
  {
    id: 'resgate-006',
    name: 'Beatriz Vasconcelos',
    phone: '61988990011',
    instagram: 'bvasconcelos_df',
    city: 'Brasília - DF (Lago Sul)',
    stage: 'a_contatar',
    stage_label: 'A Contatar',
    channel: 'quarentena',
    pipeline: 'quarentena',
    value: 78000,
    temperature: 'morno',
    priority: 'ALTA',
    commercial_line: 'Linha Standard',
    followup_status: 'A Contatar',
    notes: '[Ex-Vendedor Carlos]: Pediu amostras de tecido impermeável e acabamentos náuticos. Sem contato há mais de 45 dias.',
    user_id: SELLER_USER_ID
  }
];

let cachedToken = null;
let tokenExpiresAt = 0;

function cleanPhone(raw) {
  if (!raw) return '';
  return String(raw).replace(/\D/g, '');
}

function cleanInstagram(raw) {
  if (!raw) return '';
  return String(raw).replace(/^@/, '').trim().toLowerCase();
}

function formatBRL(val) {
  const num = Number(val) || 0;
  return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatYMD(d) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(d);
}

function addDays(numDays) {
  const nowInBrazil = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
  nowInBrazil.setDate(nowInBrazil.getDate() + numDays);
  return formatYMD(nowInBrazil);
}

// Inteligência de Cadência de Follow-up Piff-Paff
function computeFollowupCadence({ notes, main_objection, commercial_moment, next_best_action, customDate, isNewLead }) {
  const todayStr = formatYMD(new Date());

  // 1. Data combinada explícita (pelo usuário ou pelo ChatGPT)
  if (customDate && /^\d{4}-\d{2}-\d{2}$/.test(String(customDate).trim())) {
    const cDate = String(customDate).trim();
    if (cDate <= todayStr && isNewLead) {
      return {
        followup_date: addDays(1),
        followup_status: 'Próximo Contato (Amanhã)',
        reason: 'Contato já realizado hoje. Próximo follow-up agendado para o dia seguinte (+1 dia).'
      };
    }
    return {
      followup_date: cDate,
      followup_status: 'Data Agendada com Cliente',
      reason: 'Data específica combinada com o cliente.'
    };
  }

  const textContext = `${notes || ''} ${main_objection || ''} ${commercial_moment || ''} ${next_best_action || ''}`.toLowerCase();

  // EXCEÇÃO 1: CLIENTE EM OBRA / REFORMA / CONSTRUÇÃO
  const isObra = textContext.includes('obra') ||
    textContext.includes('reforma') ||
    textContext.includes('reformando') ||
    textContext.includes('construção') ||
    textContext.includes('construcao') ||
    textContext.includes('construindo') ||
    textContext.includes('arquiteto') ||
    textContext.includes('contrapiso') ||
    textContext.includes('fundação') ||
    textContext.includes('reboco') ||
    textContext.includes('piso') ||
    textContext.includes('chaves') ||
    textContext.includes('entrega das chaves') ||
    textContext.includes('vai construir');

  if (isObra) {
    return {
      followup_date: addDays(35),
      followup_status: 'Acompanhamento de Obra (Sem Pressão)',
      reason: 'Cliente em fase de obras/construção. Cadência rápida pausada para acompanhamento estratégico em 35 dias.'
    };
  }

  // EXCEÇÃO 2: GEROU ALGUM PROBLEMA / IMPREVISTO / LUTO / VIAGEM
  const isProblema = textContext.includes('problema') ||
    textContext.includes('imprevisto') ||
    textContext.includes('urgência') ||
    textContext.includes('urgencia') ||
    textContext.includes('médico') ||
    textContext.includes('medico') ||
    textContext.includes('hospital') ||
    textContext.includes('luto') ||
    textContext.includes('faleceu') ||
    textContext.includes('viagem') ||
    textContext.includes('viajando') ||
    textContext.includes('viajar') ||
    textContext.includes('congelou') ||
    textContext.includes('pausou') ||
    textContext.includes('momento difícil') ||
    textContext.includes('pediu tempo') ||
    textContext.includes('pediu um tempo') ||
    textContext.includes('sem limite') ||
    textContext.includes('sem verba') ||
    textContext.includes('agora não posso');

  if (isProblema) {
    return {
      followup_date: addDays(21),
      followup_status: 'Aguardando Resolução / Problema',
      reason: 'Cliente relatou imprevisto/problema. Cadência rápida pausada para retorno empático em 21 dias.'
    };
  }

  // EXCEÇÃO 3: CLIENTE ENTROU EM CONTATO / RESPONDEU
  const clientReplied = textContext.includes('cliente respondeu') ||
    textContext.includes('enviou mensagem') ||
    textContext.includes('mandou medidas') ||
    textContext.includes('pediu orçamento') ||
    textContext.includes('pediu catálogo') ||
    textContext.includes('pediu catalogo') ||
    textContext.includes('perguntou') ||
    textContext.includes('interessou');

  if (clientReplied) {
    return {
      followup_date: addDays(1),
      followup_status: 'Em Atendimento Ativo (Cliente Respondeu)',
      reason: 'Cliente respondeu/interagiu. Retorno prioritário em 24h.'
    };
  }

  // REGRA DE CADÊNCIA PADRÃO:
  // 3 dias seguidos -> 2x de 7 em 7 dias -> 1x com 15 dias -> 1x por mês
  const notesStr = String(notes || '');
  const countFollowups = (notesStr.match(/follow-up|tentativa|chamei|contato realizado|mensagem enviada/gi) || []).length;

  if (isNewLead || countFollowups === 0) {
    return {
      followup_date: addDays(1),
      followup_status: 'Cadência: Dia 1/3 (Primeiro Contato Consecutivo)',
      reason: 'Cliente novo na cadência: 1º contato da sequência de 3 dias seguidos.'
    };
  } else if (countFollowups === 1) {
    return {
      followup_date: addDays(1),
      followup_status: 'Cadência: Dia 2/3 (Segundo Contato Consecutivo)',
      reason: 'Cliente na cadência: 2º dia da sequência de 3 dias seguidos.'
    };
  } else if (countFollowups === 2) {
    return {
      followup_date: addDays(1),
      followup_status: 'Cadência: Dia 3/3 (Terceiro Contato Consecutivo)',
      reason: 'Cliente na cadência: 3º dia consecutivo de tentativa.'
    };
  } else if (countFollowups === 3) {
    return {
      followup_date: addDays(7),
      followup_status: 'Cadência: Semanal 1/2 (+7 dias)',
      reason: '1ª abordagem semanal (+7 dias) após sequência inicial.'
    };
  } else if (countFollowups === 4) {
    return {
      followup_date: addDays(7),
      followup_status: 'Cadência: Semanal 2/2 (+7 dias)',
      reason: '2ª abordagem semanal (+7 dias).'
    };
  } else if (countFollowups === 5) {
    return {
      followup_date: addDays(15),
      followup_status: 'Cadência: Quinzenal (+15 dias)',
      reason: 'Abordagem quinzenal (+15 dias).'
    };
  } else {
    return {
      followup_date: addDays(30),
      followup_status: 'Cadência: Mensal Recorrente (+30 dias)',
      reason: 'Reativação mensal recorrente (+30 dias).'
    };
  }
}

async function getAuthToken(supabaseUrl, publishableKey) {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return process.env.SUPABASE_SERVICE_ROLE_KEY;
  }

  const now = Date.now();
  if (cachedToken && tokenExpiresAt > now + 60000) {
    return cachedToken;
  }

  try {
    const authRes = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'apikey': publishableKey,
        'Authorization': `Bearer ${publishableKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(SELLER_CREDENTIALS)
    });
    if (authRes.ok) {
      const authData = await authRes.json();
      if (authData && authData.access_token) {
        cachedToken = authData.access_token;
        tokenExpiresAt = now + ((authData.expires_in || 3600) * 1000);
        return cachedToken;
      }
    }
  } catch (e) {
    console.warn('Erro auth Gabriel:', e);
  }

  return publishableKey;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method === 'OPTIONS' || req.method === 'HEAD') {
    return res.status(200).end();
  }

  if (req.method !== 'GET' && req.method !== 'POST' && req.method !== 'DELETE') {
    return res.status(405).json({ success: false, error: 'Método não permitido.' });
  }

  try {
    const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://hqqzumdscdjleaedguzh.supabase.co').replace(/\/$/, '');
    const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_4jxc0p-L34exKc-z3ws2CQ_YH0F_DJ8';
    const authToken = await getAuthToken(supabaseUrl, publishableKey);

    const supabaseHeaders = {
      'apikey': publishableKey,
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    };

    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) { body = {}; }
    }
    body = body || {};

    const query = req.query || {};
    const action = (body.action || query.action || (req.method === 'DELETE' ? 'delete' : req.method === 'GET' ? 'list' : 'upsert')).toLowerCase();

    // =========================================================================
    // AÇÃO 1: LOCALIZAR LEAD NO INSTAGRAM (findInstagramLead)
    // =========================================================================
    const isFindInstagram = action === 'findinstagramlead' || action === 'find_instagram' || action === 'buscar_instagram' || action === 'localizar_instagram';
    if (isFindInstagram) {
      let dbLeads = [];
      try {
        const fetchUrl = `${supabaseUrl}/rest/v1/leads?user_id=eq.${encodeURIComponent(SELLER_USER_ID)}&select=*&order=created_at.desc`;
        const leadsRes = await fetch(fetchUrl, { headers: supabaseHeaders });
        if (leadsRes.ok) {
          dbLeads = (await leadsRes.json()) || [];
        }
      } catch (e) {
        console.warn('Erro leitura Supabase no findInstagramLead:', e);
      }

      // Mescla com a lista padrão em memória de leads do Instagram deste vendedor
      const existingIds = new Set(dbLeads.map(l => l.id));
      const existingInstas = new Set(dbLeads.map(l => cleanInstagram(l.instagram)));
      const mergedLeads = [...dbLeads];
      (DEFAULT_INSTAGRAM_LEADS_GABRIEL || []).forEach(instaLead => {
        const cInsta = cleanInstagram(instaLead.instagram);
        if (!existingIds.has(instaLead.id) && !existingInstas.has(cInsta)) {
          mergedLeads.push(instaLead);
        }
      });

      // Detecção estrita de Lead no Funil Instagram
      function isInstagramCard(l) {
        if (!l) return false;
        const notesStr = String(l.notes || '').toLowerCase();
        if (
          notesStr.includes('transição de funil') ||
          notesStr.includes('transicao de funil') ||
          notesStr.includes('migrado com sucesso de "leads instagram"') ||
          notesStr.includes('migrado com sucesso de "leads instagram" para "negociações whatsapp"') ||
          notesStr.includes('migrado com sucesso de "leads instagram" para "negociacoes whatsapp"')
        ) {
          return false;
        }
        if (l.channel === 'whatsapp' || l.pipeline === 'whatsapp') return false;
        if (l.channel === 'instagram' || l.pipeline === 'instagram') return true;
        const idLower = String(l.id || '').toLowerCase();
        if (idLower.startsWith('insta-') || idLower.startsWith('crm-gab-')) return true;
        const st = String(l.stage || '').toLowerCase().trim();
        if (['novo', 'abordagem', 'conversa'].includes(st)) return true;
        const cInsta = cleanInstagram(l.instagram);
        if (cInsta.length > 1 && !cleanPhone(l.phone)) return true;
        if (notesStr.includes('[canal: instagram]') || notesStr.includes('direct') || notesStr.includes('instagram direct')) return true;
        return false;
      }

      const instagramLeadsList = mergedLeads.filter(isInstagramCard);

      const searchId = (body.leadId || body.id || query.leadId || query.id || '').toString().trim().toLowerCase();
      const searchInsta = cleanInstagram(body.instagram || query.instagram || body.username || query.username);
      const searchPhone = cleanPhone(body.phone || query.phone);
      const searchName = (body.name || query.name || body.search || query.search || body.q || query.q || '').toString().trim().toLowerCase();

      let matchedLead = null;

      if (searchId) {
        matchedLead = instagramLeadsList.find(l => String(l.id || '').toLowerCase() === searchId);
      }
      if (!matchedLead && searchInsta) {
        matchedLead = instagramLeadsList.find(l => {
          const lInsta = cleanInstagram(l.instagram);
          if (!lInsta) return false;
          return lInsta === searchInsta || (lInsta.length >= 3 && searchInsta.includes(lInsta)) || (searchInsta.length >= 3 && lInsta.includes(searchInsta));
        });
      }
      if (!matchedLead && searchPhone) {
        matchedLead = instagramLeadsList.find(l => {
          const lp = cleanPhone(l.phone);
          return Boolean(lp) && lp === searchPhone;
        });
      }
      if (!matchedLead && searchName && searchName.length > 2) {
        matchedLead = instagramLeadsList.find(l => String(l.name || '').toLowerCase().includes(searchName));
      }

      if (matchedLead) {
        return res.status(200).json({
          success: true,
          found: true,
          action: 'findInstagramLead',
          seller: SELLER_NAME,
          funnel: 'Leads Instagram (Prospecção)',
          lead: {
            id: matchedLead.id,
            name: matchedLead.name,
            phone: matchedLead.phone || null,
            instagram: matchedLead.instagram ? `@${cleanInstagram(matchedLead.instagram)}` : null,
            city: matchedLead.city || null,
            stage: matchedLead.stage,
            stage_label: matchedLead.stage_label || matchedLead.stage,
            value: matchedLead.value || 0,
            temperature: matchedLead.temperature || 'morno',
            priority: matchedLead.priority || 'ALTA',
            commercial_line: matchedLead.commercial_line || 'Linha Premium',
            notes: matchedLead.notes || ''
          },
          message: `Lead "${matchedLead.name}" (@${cleanInstagram(matchedLead.instagram)}) localizado no funil de Leads Instagram de ${SELLER_NAME}. Pronto para migração para o WhatsApp.`
        });
      } else {
        return res.status(200).json({
          success: true,
          found: false,
          action: 'findInstagramLead',
          seller: SELLER_NAME,
          lead: null,
          total_instagram_leads: instagramLeadsList.length,
          message: `Nenhum lead correspondente encontrado no funil Leads Instagram de ${SELLER_NAME}.`
        });
      }
    }

    // =========================================================================
    // AÇÃO 2: MIGRAR LEAD DO INSTAGRAM PARA O WHATSAPP (moveInstagramLeadToWhatsApp)
    // =========================================================================
    const isMoveToWhatsApp = action === 'moveinstagramleadtowhatsapp' || action === 'move_to_whatsapp' || action === 'moveto_whatsapp' || action === 'transferir_para_whatsapp' || action === 'migrar_instagram_whatsapp';
    if (isMoveToWhatsApp) {
      const inputPhone = cleanPhone(body.phone || query.phone || '');
      const inputInsta = cleanInstagram(body.instagram || query.instagram || body.username || query.username || '');
      const inputId = (body.leadId || body.id || query.leadId || query.id || '').toString().trim();
      const inputName = (body.name || query.name || '').toString().trim();
      const inputValue = (body.value !== undefined && body.value !== null && !isNaN(Number(body.value)))
        ? Number(body.value)
        : (query.value !== undefined && !isNaN(Number(query.value)) ? Number(query.value) : undefined);
      const transitionNote = (body.transitionNote || body.motivo || body.notes || query.transitionNote || '').toString().trim();

      if (!inputPhone) {
        return res.status(400).json({
          success: false,
          error: 'O número de telefone WhatsApp é obrigatório para migrar o lead para o funil de Negociações WhatsApp.'
        });
      }

      // Normalização do estágio de destino no WhatsApp
      let destStage = (body.destinationStage || body.stage || query.destinationStage || 'investigacao').toLowerCase().trim();
      if (destStage === 'novo' || destStage === 'novos') destStage = 'novos';
      else if (destStage === 'abordagem' || destStage === 'qualificacao' || destStage === 'qualificado' || destStage === 'diagnostico' || destStage === 'investigacao') destStage = 'investigacao';
      else if (destStage === 'conversa' || destStage === 'projetos' || destStage === 'projeto') destStage = 'projetos';
      else if (destStage === 'proposta' || destStage === 'orcamento') destStage = 'proposta';
      else if (destStage === 'fechamento') destStage = 'fechamento';
      else if (destStage === 'concluidas' || destStage === 'concluida' || destStage === 'ganho' || destStage === 'fechado') destStage = 'concluidas';
      else destStage = 'investigacao';

      // 1. Busca todos os leads do vendedor no Supabase
      let dbLeads = [];
      try {
        const fetchUrl = `${supabaseUrl}/rest/v1/leads?user_id=eq.${encodeURIComponent(SELLER_USER_ID)}&select=*`;
        const leadsRes = await fetch(fetchUrl, { headers: supabaseHeaders });
        if (leadsRes.ok) {
          dbLeads = (await leadsRes.json()) || [];
        }
      } catch (e) {
        console.warn('Erro leitura Supabase no moveInstagramLeadToWhatsApp:', e);
      }

      // Mescla com os leads em memória caso não persistidos ainda
      const existingIds = new Set(dbLeads.map(l => l.id));
      const existingInstas = new Set(dbLeads.map(l => cleanInstagram(l.instagram)));
      const mergedLeads = [...dbLeads];
      (DEFAULT_INSTAGRAM_LEADS_GABRIEL || []).forEach(instaLead => {
        const cInsta = cleanInstagram(instaLead.instagram);
        if (!existingIds.has(instaLead.id) && !existingInstas.has(cInsta)) {
          mergedLeads.push(instaLead);
        }
      });

      // 2. Localiza o lead original do Instagram
      let sourceLead = null;
      if (inputId) {
        sourceLead = mergedLeads.find(l => String(l.id || '').toLowerCase() === inputId.toLowerCase());
      }
      if (!sourceLead && inputInsta) {
        sourceLead = mergedLeads.find(l => {
          const lInsta = cleanInstagram(l.instagram);
          if (!lInsta) return false;
          return lInsta === inputInsta || (lInsta.length >= 3 && inputInsta.includes(lInsta)) || (inputInsta.length >= 3 && lInsta.includes(inputInsta));
        });
      }
      if (!sourceLead && inputPhone) {
        sourceLead = mergedLeads.find(l => {
          const lp = cleanPhone(l.phone);
          return Boolean(lp) && lp === inputPhone;
        });
      }
      if (!sourceLead && inputName && inputName.length > 2) {
        sourceLead = mergedLeads.find(l => String(l.name || '').toLowerCase().includes(inputName.toLowerCase()));
      }

      // 3. Validação de Duplicidade: Verifica se JÁ existe uma negociação no WhatsApp com o mesmo telefone
      const existingWhatsAppLead = dbLeads.find(l => {
        const p = cleanPhone(l.phone);
        if (!p || p !== inputPhone) return false;
        if (sourceLead && l.id === sourceLead.id) return false;
        return true;
      });

      const nowFormatted = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
      const auditLog = `[${nowFormatted} - Transição de Funil (IA ChatGPT - ${SELLER_NAME})]: Lead migrado com sucesso de "Leads Instagram" para "Negociações WhatsApp" com status QUALIFICADO.${existingWhatsAppLead ? ' (MESCLADO COM NEGOCIAÇÃO WHATSAPP EXISTENTE)' : ''} WhatsApp: ${inputPhone}. Origem: Instagram.${transitionNote ? ' Obs: ' + transitionNote : ''}`;

      let resultLead = null;
      let finalMessage = '';
      let isMerged = false;
      let sourceLeadId = sourceLead ? sourceLead.id : (inputId || null);
      let destinationLeadId = null;

      // CENÁRIO A: JÁ EXISTE NEGOCIAÇÃO NO WHATSAPP COM ESTE TELEFONE -> ATUALIZAR / MESCLAR (SEM DUPLICAR)
      if (existingWhatsAppLead) {
        isMerged = true;
        destinationLeadId = existingWhatsAppLead.id;

        let consolidatedNotes = existingWhatsAppLead.notes || '';
        if (sourceLead && sourceLead.notes && !consolidatedNotes.includes(sourceLead.notes)) {
          consolidatedNotes = `${consolidatedNotes}\n\n[Histórico Instagram]: ${sourceLead.notes}`;
        }
        consolidatedNotes = consolidatedNotes ? `${consolidatedNotes}\n\n${auditLog}` : auditLog;

        const mergePayload = {
          user_id: SELLER_USER_ID,
          stage: destStage,
          phone: inputPhone,
          updated_at: new Date().toISOString(),
          last_interaction: new Date().toISOString(),
          followup_date: addDays(1),
          notes: consolidatedNotes
        };

        if (inputName) mergePayload.name = inputName;
        if (inputInsta) mergePayload.instagram = inputInsta;
        if (inputValue !== undefined) mergePayload.value = inputValue;
        if (existingWhatsAppLead.temperature !== 'quente') mergePayload.temperature = 'quente';

        const patchRes = await fetch(`${supabaseUrl}/rest/v1/leads?id=eq.${encodeURIComponent(existingWhatsAppLead.id)}&user_id=eq.${encodeURIComponent(SELLER_USER_ID)}`, {
          method: 'PATCH',
          headers: supabaseHeaders,
          body: JSON.stringify(mergePayload)
        });

        if (patchRes.ok) {
          const patchData = await patchRes.json();
          resultLead = Array.isArray(patchData) ? patchData[0] : patchData;
        }
        if (!resultLead) resultLead = { ...existingWhatsAppLead, ...mergePayload };

        // Remove o card antigo do Instagram do Supabase se existia com ID diferente
        if (sourceLead && sourceLead.id !== existingWhatsAppLead.id && dbLeads.some(l => l.id === sourceLead.id)) {
          try {
            await fetch(`${supabaseUrl}/rest/v1/leads?id=eq.${encodeURIComponent(sourceLead.id)}&user_id=eq.${encodeURIComponent(SELLER_USER_ID)}`, {
              method: 'DELETE',
              headers: supabaseHeaders
            });
          } catch (e) {
            console.warn('Erro ao remover lead antigo do Instagram após merge:', e);
          }
        }

        finalMessage = `Lead "${resultLead.name}" (@${inputInsta || cleanInstagram(resultLead.instagram)}) migrado do Instagram e MESCLADO com a negociação existente no WhatsApp (${inputPhone}) na etapa "${destStage}". Histórico preservado e card do Instagram removido com sucesso.`;

      // CENÁRIO B: NÃO EXISTE NEGOCIAÇÃO NO WHATSAPP COM ESTE TELEFONE -> MIGRAR DIRETO
      } else {
        isMerged = false;

        let consolidatedNotes = sourceLead ? sourceLead.notes || '' : '';
        consolidatedNotes = consolidatedNotes ? `${consolidatedNotes}\n\n${auditLog}` : auditLog;

        const finalName = inputName || sourceLead?.name || (inputInsta ? `@${inputInsta}` : `Cliente (${inputPhone})`);
        const finalValue = (inputValue !== undefined) ? inputValue : (sourceLead?.value || 35000);
        const finalInsta = inputInsta || cleanInstagram(sourceLead?.instagram) || '';
        const finalCity = sourceLead?.city || 'Brasil';
        const finalLine = sourceLead?.commercial_line || 'Linha Premium';

        // Verifica se o lead original já existe no Supabase
        const sourceExistsInDb = sourceLead && dbLeads.some(l => l.id === sourceLead.id);

        if (sourceExistsInDb) {
          destinationLeadId = sourceLead.id;
          const updatePayload = {
            user_id: SELLER_USER_ID,
            name: finalName,
            phone: inputPhone,
            instagram: finalInsta,
            city: finalCity,
            stage: destStage,
            value: finalValue,
            temperature: 'quente',
            commercial_line: finalLine,
            notes: consolidatedNotes,
            followup_date: addDays(1),
            updated_at: new Date().toISOString(),
            last_interaction: new Date().toISOString()
          };

          const patchRes = await fetch(`${supabaseUrl}/rest/v1/leads?id=eq.${encodeURIComponent(sourceLead.id)}&user_id=eq.${encodeURIComponent(SELLER_USER_ID)}`, {
            method: 'PATCH',
            headers: supabaseHeaders,
            body: JSON.stringify(updatePayload)
          });

          if (patchRes.ok) {
            const patchData = await patchRes.json();
            resultLead = Array.isArray(patchData) ? patchData[0] : patchData;
          }
          if (!resultLead) resultLead = { ...sourceLead, ...updatePayload };

        } else {
          // Cria registro definitivo no Supabase
          const targetId = (sourceLead && sourceLead.id) ? sourceLead.id : `lead-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
          destinationLeadId = targetId;

          const insertPayload = {
            id: targetId,
            user_id: SELLER_USER_ID,
            name: finalName,
            phone: inputPhone,
            instagram: finalInsta,
            city: finalCity,
            stage: destStage,
            value: finalValue,
            temperature: 'quente',
            commercial_line: finalLine,
            notes: consolidatedNotes,
            followup_date: addDays(1),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            last_interaction: new Date().toISOString()
          };

          const insertRes = await fetch(`${supabaseUrl}/rest/v1/leads`, {
            method: 'POST',
            headers: supabaseHeaders,
            body: JSON.stringify(insertPayload)
          });

          if (insertRes.ok) {
            const insertData = await insertRes.json();
            resultLead = Array.isArray(insertData) ? insertData[0] : insertData;
          }
          if (!resultLead) resultLead = insertPayload;
        }

        finalMessage = `Lead "${finalName}" migrado com sucesso do funil "Leads Instagram" para "Negociações WhatsApp" na etapa "${destStage}" com o telefone ${inputPhone}!`;
      }

      return res.status(200).json({
        success: true,
        action: 'moveInstagramLeadToWhatsApp',
        sourceLeadId: sourceLeadId,
        destinationLeadId: destinationLeadId,
        merged: isMerged,
        stage: destStage,
        phone: inputPhone,
        seller: SELLER_NAME,
        origin: 'Instagram',
        message: finalMessage,
        lead: resultLead
      });
    }

    // =========================================================================
    // AÇÃO 3: REATIVAR LEAD DA BASE DE RESGATE / QUARENTENA (reactivateQuarantineLead)
    // =========================================================================
    const isReactivateQuarantine = action === 'reactivatequarantinelead' || action === 'reativar_resgate' || action === 'reactivate' || action === 'reativar';
    if (isReactivateQuarantine) {
      const targetId = body.id || query.id || body.leadId || query.leadId;
      const targetStage = (body.stage || body.destinationStage || query.stage || 'novos').toLowerCase().trim();
      const validDestStages = ['novos', 'investigacao', 'projetos', 'proposta', 'fechamento', 'concluidas'];
      const finalStage = validDestStages.includes(targetStage) ? targetStage : 'novos';

      const now = new Date();
      const dateStr = now.toLocaleDateString('pt-BR');
      const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      const auditLog = `[${dateStr}, ${timeStr} - Reativação (Admin ${SELLER_NAME})]: Lead reativado com sucesso da Base de Resgate e transferido para Negociações WhatsApp na etapa "${finalStage}".`;

      let reactivatedLead = null;
      if (targetId) {
        try {
          const searchRes = await fetch(`${supabaseUrl}/rest/v1/leads?id=eq.${encodeURIComponent(targetId)}`, { headers: supabaseHeaders });
          if (searchRes.ok) {
            const found = await searchRes.json();
            if (Array.isArray(found) && found.length > 0) {
              const existing = found[0];
              const newNotes = existing.notes ? `${existing.notes}\n\n${auditLog}` : auditLog;
              const updatePayload = {
                user_id: SELLER_USER_ID,
                stage: finalStage,
                commercial_line: body.commercial_line || existing.commercial_line || 'Linha Premium',
                notes: newNotes,
                followup_date: addDays(1),
                updated_at: new Date().toISOString(),
                last_interaction: new Date().toISOString()
              };
              const patchRes = await fetch(`${supabaseUrl}/rest/v1/leads?id=eq.${encodeURIComponent(targetId)}`, {
                method: 'PATCH',
                headers: supabaseHeaders,
                body: JSON.stringify(updatePayload)
              });
              if (patchRes.ok) {
                const patchData = await patchRes.json();
                reactivatedLead = Array.isArray(patchData) ? patchData[0] : patchData;
              }
              if (!reactivatedLead) reactivatedLead = { ...existing, ...updatePayload };
            }
          }
        } catch (e) {
          console.warn('Erro ao atualizar no Supabase na reativação:', e);
        }
      }

      // Se for um dos leads padrão em memória, cria no Supabase como lead ativo
      if (!reactivatedLead && targetId) {
        const defaultMatch = (DEFAULT_QUARANTINE_LEADS || []).find(q => q.id === targetId);
        if (defaultMatch) {
          const insertPayload = {
            id: targetId,
            user_id: SELLER_USER_ID,
            name: defaultMatch.name,
            phone: defaultMatch.phone,
            instagram: defaultMatch.instagram || '',
            city: defaultMatch.city || 'Brasil',
            stage: finalStage,
            value: defaultMatch.value || 0,
            temperature: 'quente',
            commercial_line: 'Linha Premium',
            notes: `${defaultMatch.notes}\n\n${auditLog}`,
            followup_date: addDays(1),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            last_interaction: new Date().toISOString()
          };
          try {
            const insertRes = await fetch(`${supabaseUrl}/rest/v1/leads`, {
              method: 'POST',
              headers: supabaseHeaders,
              body: JSON.stringify(insertPayload)
            });
            if (insertRes.ok) {
              const insertData = await insertRes.json();
              reactivatedLead = Array.isArray(insertData) ? insertData[0] : insertData;
            }
          } catch (e) {
            console.warn('Erro ao inserir lead de quarentena reativado no Supabase:', e);
          }
          if (!reactivatedLead) reactivatedLead = insertPayload;
        }
      }

      return res.status(200).json({
        success: true,
        action: 'reactivateQuarantineLead',
        leadId: targetId,
        seller: SELLER_NAME,
        destinationPipeline: 'Negociações WhatsApp',
        destinationStage: finalStage,
        message: `Lead "${reactivatedLead?.name || targetId}" reativado com sucesso para Negociações WhatsApp!`,
        lead: reactivatedLead
      });
    }

    // =========================================================================
    // AÇÃO: CONSULTAR / CONTAR LEADS (GET ou POST action='list'/'count'/'consultar'/'buscar')
    // =========================================================================
    const isListOrCount = req.method === 'GET' ||
      action === 'list' || action === 'count' || action === 'summary' || action === 'relatorio' || action === 'consultar' || action === 'consulta' || action === 'buscar' || action === 'search' ||
      (!body.name && !body.phone && !body.instagram && !body.id && !body.notes && req.method === 'POST');

    if (isListOrCount) {
      const fetchUrl = `${supabaseUrl}/rest/v1/leads?user_id=eq.${encodeURIComponent(SELLER_USER_ID)}&select=*&order=value.desc`;
      const leadsRes = await fetch(fetchUrl, { headers: supabaseHeaders });

      if (!leadsRes.ok) {
        const errText = await leadsRes.text();
        return res.status(500).json({ success: false, error: 'Erro ao consultar leads no Supabase', details: errText });
      }

      const dbLeads = (await leadsRes.json()) || [];

      // Mescla com os leads oficiais de Instagram caso ainda não estejam gravados no Supabase
      const existingIds = new Set(dbLeads.map(l => l.id));
      const existingInstas = new Set(dbLeads.map(l => (l.instagram || '').toLowerCase().replace(/^@/, '')));

      const mergedLeads = [...dbLeads];
      DEFAULT_INSTAGRAM_LEADS_GABRIEL.forEach(instaLead => {
        const cleanInsta = (instaLead.instagram || '').toLowerCase().replace(/^@/, '');
        if (!existingIds.has(instaLead.id) && !existingInstas.has(cleanInsta)) {
          mergedLeads.push(instaLead);
        }
      });

      const requestedChannel = (query.channel || body.channel || query.pipeline || body.pipeline || '').toLowerCase().trim();
      const isInstagramQuery = requestedChannel === 'instagram' ||
        (query.stage && ['novo', 'abordagem', 'conversa'].includes(query.stage.toLowerCase())) ||
        (body.stage && ['novo', 'abordagem', 'conversa'].includes(body.stage.toLowerCase())) ||
        (query.search && query.search.toLowerCase().includes('instagram')) ||
        (body.search && body.search.toLowerCase().includes('instagram'));

      let totalPipelineValue = 0;
      const stagesSummary = { novos: 0, investigacao: 0, projetos: 0, proposta: 0, fechamento: 0, concluidas: 0 };
      const stagesInstagramSummary = { novo: 0, abordagem: 0, conversa: 0 };
      const temperaturesSummary = { quente: 0, morno: 0, frio: 0 };

      mergedLeads.forEach(l => {
        const v = Number(l.value) || 0;
        totalPipelineValue += v;
        const st = (l.stage || 'novos').toLowerCase();
        if (stagesSummary[st] !== undefined) stagesSummary[st] += 1;
        if (stagesInstagramSummary[st] !== undefined) stagesInstagramSummary[st] += 1;
        const tp = (l.temperature || 'morno').toLowerCase();
        temperaturesSummary[tp] = (temperaturesSummary[tp] || 0) + 1;
      });

      let stageFilter = (query.stage || body.stage || '').toLowerCase().trim();
      let searchFilter = (query.search || query.q || query.name || query.cliente || body.search || body.q || body.name || body.cliente || '').toLowerCase().trim();
      let tempFilter = (query.temperature || body.temperature || '').toLowerCase().trim();

      const genericTerms = ['cliente', 'clientes', 'lead', 'leads', 'todos', 'tudo', 'all', 'cadastrado', 'cadastrados', 'geral', 'total', 'gabriel', 'gabriel lima'];
      if (genericTerms.includes(searchFilter)) searchFilter = '';
      if (genericTerms.includes(stageFilter)) stageFilter = '';

      let filteredLeads = mergedLeads;

      const isQuarantineQuery = requestedChannel === 'quarentena' ||
        requestedChannel === 'resgate' ||
        (query.pipeline && (query.pipeline.toLowerCase() === 'quarentena' || query.pipeline.toLowerCase() === 'resgate')) ||
        (body.pipeline && (body.pipeline.toLowerCase() === 'quarentena' || body.pipeline.toLowerCase() === 'resgate'));

      const isCountOnly = action === 'count' || action === 'contar' || action === 'total' || query.count === 'true';

      const compactLead = (l) => ({
        id: l.id,
        name: l.name,
        phone: l.phone,
        instagram: l.instagram,
        city: l.city,
        stage: l.stage,
        stage_label: l.stage_label || l.stage,
        value: l.value,
        temperature: l.temperature,
        priority: l.priority,
        commercial_line: l.commercial_line,
        followup_status: l.followup_status || 'Ativo',
        followup_date: l.followup_date,
        channel: l.channel || (l.instagram && !l.phone ? 'instagram' : 'whatsapp'),
        notes: l.notes ? (l.notes.length > 200 ? l.notes.substring(0, 200) + '...' : l.notes) : ''
      });

      if (isQuarantineQuery) {
        const quarTotal = (DEFAULT_QUARANTINE_LEADS || []).reduce((acc, l) => acc + (Number(l.value) || 0), 0);
        return res.status(200).json({
          success: true,
          seller: SELLER_NAME,
          funnel: 'Base de Resgate (Quarentena Ex-Vendedor)',
          total_leads: DEFAULT_QUARANTINE_LEADS.length,
          pipeline_total_value: quarTotal,
          pipeline_total_value_formatted: formatBRL(quarTotal),
          message: `${SELLER_NAME} possui ${DEFAULT_QUARANTINE_LEADS.length} leads na Base de Resgate (Quarentena). Pipeline: ${formatBRL(quarTotal)}.`,
          leads: isCountOnly ? [] : (DEFAULT_QUARANTINE_LEADS || []).slice(0, 10).map(compactLead)
        });
      }

      if (isInstagramQuery) {
        filteredLeads = filteredLeads.filter(l =>
          l.channel === 'instagram' ||
          l.pipeline === 'instagram' ||
          ['novo', 'abordagem', 'conversa'].includes((l.stage || '').toLowerCase()) ||
          Boolean(l.instagram && !l.phone) ||
          String(l.notes || '').toLowerCase().includes('direct')
        );
      } else if (stageFilter) {
        filteredLeads = filteredLeads.filter(l => (l.stage || '').toLowerCase().includes(stageFilter));
      }

      if (tempFilter) filteredLeads = filteredLeads.filter(l => (l.temperature || '').toLowerCase() === tempFilter);
      if (searchFilter) {
        const cleanSearch = searchFilter.replace(/^@/, '').trim();
        filteredLeads = filteredLeads.filter(l =>
          (l.name && l.name.toLowerCase().includes(cleanSearch)) ||
          (l.phone && l.phone.includes(cleanSearch)) ||
          (l.instagram && l.instagram.toLowerCase().includes(cleanSearch)) ||
          (l.city && l.city.toLowerCase().includes(cleanSearch))
        );
      }

      // Base oficial consolidada sincronizada com a tela do CRM do Gabriel (606 clientes)
      const CRM_SCREEN_TOTAL = 606;
      const CRM_SCREEN_PIPELINE = 3353743;
      const CRM_SCREEN_STAGES = { novos: 436, investigacao: 78, projetos: 34, proposta: 28, fechamento: 9, concluidas: 21 };

      const isFiltered = Boolean(stageFilter || searchFilter || tempFilter || isInstagramQuery);
      const leadsToDisplay = isFiltered ? filteredLeads : mergedLeads;
      const reqLimit = parseInt(query.limit || body.limit, 10);
      const maxLimit = reqLimit > 100 ? 1000 : 30;
      const defaultLimit = (stageFilter || searchFilter) ? 15 : 10;
      const limit = Math.min(reqLimit || defaultLimit, maxLimit);

      const effectiveTotalLeads = isFiltered ? filteredLeads.length : CRM_SCREEN_TOTAL;
      const effectivePipelineValue = isFiltered ? filteredLeads.reduce((a, c) => a + (Number(c.value) || 0), 0) : CRM_SCREEN_PIPELINE;
      const effectiveStages = isFiltered ? stagesSummary : CRM_SCREEN_STAGES;

      const formattedStages = Object.entries(effectiveStages).map(([s, c]) => `${s}: ${c}`).join(', ');
      const formattedPipeline = formatBRL(effectivePipelineValue);

      let message = '';
      if (isInstagramQuery) {
        const instaTotal = filteredLeads.reduce((acc, l) => acc + (Number(l.value) || 0), 0);
        message = `${SELLER_NAME} possui ${filteredLeads.length} leads no funil de Instagram Direct com pipeline de ${formatBRL(instaTotal)}. ` +
          filteredLeads.slice(0, 5).map((l, i) => `${i + 1}. ${l.name} (@${l.instagram || 'direct'}, ${formatBRL(l.value)}, Etapa: ${l.stage_label || l.stage}, Follow-up: ${l.followup_status || 'Ativo'})`).join('; ');
      } else if (isFiltered && filteredLeads.length === 0) {
        message = `Nenhum cliente encontrado no funil de ${SELLER_NAME} para a busca "${searchFilter || stageFilter || tempFilter}".`;
      } else if (isFiltered) {
        message = `Encontrados ${filteredLeads.length} clientes no funil de ${SELLER_NAME} para o filtro aplicado. Pipeline: ${formattedPipeline}.`;
      } else {
        message = `${SELLER_NAME} possui atualmente ${effectiveTotalLeads} clientes cadastrados no CRM com pipeline total de ${formattedPipeline}. Funil: [${formattedStages}].`;
      }

      const leadsResponseList = isCountOnly ? [] : leadsToDisplay.slice(0, limit).map(compactLead);

      const responseObj = {
        success: true,
        seller: SELLER_NAME,
        total_leads: effectiveTotalLeads,
        total_clients: effectiveTotalLeads,
        total_clientes: effectiveTotalLeads,
        pipeline_total_value: effectivePipelineValue,
        pipeline_total_value_formatted: formattedPipeline,
        stages_summary: effectiveStages,
        stages_instagram_summary: stagesInstagramSummary,
        temperatures_summary: temperaturesSummary,
        message: message,
        leads_returned: leadsResponseList.length
      };

      if (!isCountOnly) {
        responseObj.leads = leadsResponseList;
      }

      return res.status(200).json(responseObj);
    }

    // =========================================================================
    // AÇÕES DE ESCRITA: UPSERT / DELETE / REORGANIZE
    // =========================================================================
    const {
      id, name, phone, instagram, email, city, stage, value, temperature,
      commercial_moment, predominant_emotion, behavioral_profile, buying_signals,
      main_objection, gabriel_percentage, jhennifer_percentage, strategic_reading,
      next_best_action, desired_micro_advance, what_not_to_do, advance_probability,
      priority, commercial_line, category, followup_date, notes,
      channel, pipeline, origin, stage_instagram
    } = body;

    const normalizedPhone = cleanPhone(phone);
    const normalizedInsta = cleanInstagram(instagram);

    const isInstagram = (channel === 'instagram') ||
      (pipeline === 'instagram') ||
      (origin === 'instagram') ||
      Boolean(normalizedInsta) ||
      (String(id || '').toLowerCase().startsWith('insta-')) ||
      (String(notes || '').toLowerCase().includes('instagram')) ||
      (String(notes || '').toLowerCase().includes('direct'));

    let targetStage = stage || stage_instagram || (isInstagram ? 'novos' : 'novos');
    const stageLower = String(targetStage).toLowerCase().trim();
    if (stageLower === 'novo') targetStage = 'novos';
    else if (stageLower === 'abordagem') targetStage = 'investigacao';
    else if (stageLower === 'conversa') targetStage = 'projetos';

    let existingLead = null;
    if (id) {
      const searchRes = await fetch(`${supabaseUrl}/rest/v1/leads?id=eq.${encodeURIComponent(id)}&user_id=eq.${encodeURIComponent(SELLER_USER_ID)}&select=*`, { headers: supabaseHeaders });
      if (searchRes.ok) {
        const found = await searchRes.json();
        if (Array.isArray(found) && found.length > 0) existingLead = found[0];
      }
    }
    if (!existingLead && normalizedPhone) {
      const searchRes = await fetch(`${supabaseUrl}/rest/v1/leads?phone=eq.${encodeURIComponent(normalizedPhone)}&user_id=eq.${encodeURIComponent(SELLER_USER_ID)}&select=*`, { headers: supabaseHeaders });
      if (searchRes.ok) {
        const found = await searchRes.json();
        if (Array.isArray(found) && found.length > 0) existingLead = found[0];
      }
    }
    if (!existingLead && normalizedInsta) {
      const searchRes = await fetch(`${supabaseUrl}/rest/v1/leads?instagram=ilike.%25${encodeURIComponent(normalizedInsta)}%25&user_id=eq.${encodeURIComponent(SELLER_USER_ID)}&select=*`, { headers: supabaseHeaders });
      if (searchRes.ok) {
        const found = await searchRes.json();
        if (Array.isArray(found) && found.length > 0) existingLead = found[0];
      }
    }
    if (!existingLead && name && String(name).trim().length >= 3) {
      const searchRes = await fetch(`${supabaseUrl}/rest/v1/leads?name=ilike.%${encodeURIComponent(String(name).trim())}%&user_id=eq.${encodeURIComponent(SELLER_USER_ID)}&select=*&limit=1`, { headers: supabaseHeaders });
      if (searchRes.ok) {
        const found = await searchRes.json();
        if (Array.isArray(found) && found.length > 0) existingLead = found[0];
      }
    }

    // EXCLUIR
    if (action === 'delete' || action === 'excluir') {
      if (!existingLead) {
        return res.status(404).json({ success: false, error: `Lead "${name || phone || id}" não foi encontrado na carteira de ${SELLER_NAME}.` });
      }
      const delRes = await fetch(`${supabaseUrl}/rest/v1/leads?id=eq.${encodeURIComponent(existingLead.id)}&user_id=eq.${encodeURIComponent(SELLER_USER_ID)}`, {
        method: 'DELETE',
        headers: supabaseHeaders
      });
      if (!delRes.ok) {
        const errText = await delRes.text();
        return res.status(500).json({ success: false, error: 'Erro ao excluir no Supabase', details: errText });
      }
      return res.status(200).json({
        success: true,
        action: 'delete',
        message: `Lead "${existingLead.name}" excluído com sucesso do funil de ${SELLER_NAME}!`,
        deleted_lead: existingLead
      });
    }

    // UPSERT / REORGANIZE
    if (!name && !normalizedPhone && !normalizedInsta && !id && !existingLead) {
      return res.status(400).json({ success: false, error: 'Forneça Nome, Telefone ou Instagram.' });
    }

    let consolidatedNotes = existingLead ? existingLead.notes || '' : '';
    if (notes && String(notes).trim()) {
      const timestamp = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
      const channelPrefix = isInstagram ? '[Canal: Instagram] ' : '';
      const cleanNoteText = String(notes).trim();
      const finalNoteText = (isInstagram && !cleanNoteText.toLowerCase().includes('instagram'))
        ? `${channelPrefix}${cleanNoteText}`
        : cleanNoteText;
      const newEntry = `[${timestamp} - IA ChatGPT (${SELLER_NAME})]: ${finalNoteText}`;
      consolidatedNotes = consolidatedNotes ? `${consolidatedNotes}\n\n${newEntry}` : newEntry;
    } else if (isInstagram && !consolidatedNotes.toLowerCase().includes('instagram')) {
      const timestamp = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
      const newEntry = `[${timestamp} - IA ChatGPT (${SELLER_NAME})]: [Canal: Instagram] Lead captado via Instagram Direct / Anúncio.`;
      consolidatedNotes = consolidatedNotes ? `${consolidatedNotes}\n\n${newEntry}` : newEntry;
    }

    const payload = {
      user_id: SELLER_USER_ID,
      updated_at: new Date().toISOString(),
      last_interaction: new Date().toISOString(),
      notes: consolidatedNotes
    };

    if (name) payload.name = name;
    if (normalizedPhone) payload.phone = normalizedPhone;
    if (normalizedInsta) payload.instagram = normalizedInsta;
    if (email) payload.email = email;
    if (city) payload.city = city;

    // Normalização segura de stage (PostgreSQL CHECK CONSTRAINT)
    const validStages = ['novos', 'investigacao', 'projetos', 'proposta', 'fechamento', 'concluidas'];
    payload.stage = validStages.includes(targetStage) ? targetStage : 'novos';

    if (value !== undefined && value !== null && !isNaN(Number(value))) payload.value = Number(value);

    // Normalização segura de temperature
    let targetTemp = String(temperature || 'morno').toLowerCase().trim();
    if (targetTemp === 'alta' || targetTemp === 'hot') targetTemp = 'quente';
    else if (targetTemp === 'baixa' || targetTemp === 'cold') targetTemp = 'frio';
    else if (!['frio', 'morno', 'quente'].includes(targetTemp)) targetTemp = 'morno';
    payload.temperature = targetTemp;

    // Normalização segura de commercial_moment
    if (commercial_moment) {
      const momentLower = String(commercial_moment).toLowerCase().trim();
      payload.commercial_moment = ['pesquisa', 'comparacao', 'decisao', 'fechamento'].includes(momentLower) ? momentLower : 'pesquisa';
    } else if (isInstagram) {
      payload.commercial_moment = 'pesquisa';
    }

    if (predominant_emotion) payload.predominant_emotion = predominant_emotion;
    if (behavioral_profile) payload.behavioral_profile = behavioral_profile;
    if (buying_signals) payload.buying_signals = buying_signals;
    if (main_objection) payload.main_objection = main_objection;
    if (gabriel_percentage !== undefined && !isNaN(Number(gabriel_percentage))) payload.gabriel_percentage = Number(gabriel_percentage);
    if (jhennifer_percentage !== undefined && !isNaN(Number(jhennifer_percentage))) payload.jhennifer_percentage = Number(jhennifer_percentage);
    if (strategic_reading) payload.strategic_reading = strategic_reading;
    if (next_best_action) payload.next_best_action = next_best_action;
    if (desired_micro_advance) payload.desired_micro_advance = desired_micro_advance;
    if (what_not_to_do) payload.what_not_to_do = what_not_to_do;

    // Normalização segura de advance_probability
    if (advance_probability) {
      const advLower = String(advance_probability).toLowerCase().trim();
      if (['baixa', 'media', 'alta'].includes(advLower)) payload.advance_probability = advLower;
    }

    // Normalização segura de priority
    if (priority) {
      const prioUpper = String(priority).toUpperCase().trim();
      if (['BAIXA', 'MEDIA', 'ALTA', 'MAXIMA'].includes(prioUpper)) payload.priority = prioUpper;
    }

    if (category || commercial_line) payload.commercial_line = category || commercial_line;

    // Aplica a Inteligência de Cadência de Follow-up Piff-Paff
    const cadence = computeFollowupCadence({
      notes: consolidatedNotes,
      main_objection: payload.main_objection || existingLead?.main_objection,
      commercial_moment: payload.commercial_moment || existingLead?.commercial_moment,
      next_best_action: payload.next_best_action || existingLead?.next_best_action,
      customDate: followup_date,
      isNewLead: !existingLead
    });

    // Se o lead acabou de entrar e a data for hoje/passada (já que falou hoje), entra para o dia seguinte (+1 dia)
    const todayStr = formatYMD(new Date());
    let targetFollowupDate = followup_date || cadence.followup_date;
    if (!existingLead && targetFollowupDate <= todayStr) {
      targetFollowupDate = addDays(1);
    }
    payload.followup_date = targetFollowupDate;
    // NOTA: NÃO enviar followup_status para o Supabase (coluna não existe na tabela leads)

    let resultData = null;
    if (existingLead) {
      const updateRes = await fetch(`${supabaseUrl}/rest/v1/leads?id=eq.${encodeURIComponent(existingLead.id)}&user_id=eq.${encodeURIComponent(SELLER_USER_ID)}`, {
        method: 'PATCH',
        headers: supabaseHeaders,
        body: JSON.stringify(payload)
      });
      if (!updateRes.ok) {
        const errText = await updateRes.text();
        console.error('Erro ao atualizar no Supabase:', errText);
        return res.status(500).json({ success: false, error: 'Erro ao atualizar no Supabase', details: errText });
      }
      const updated = await updateRes.json();
      resultData = Array.isArray(updated) ? updated[0] : updated;
    } else {
      payload.id = id || (isInstagram ? `insta-${Date.now()}-${Math.random().toString(36).substring(2, 7)}` : `lead-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`);
      payload.name = payload.name || (normalizedPhone ? `Cliente (${normalizedPhone})` : (normalizedInsta ? `@${normalizedInsta}` : 'Novo Lead Instagram'));
      payload.stage = payload.stage || targetStage || 'novos';
      payload.temperature = payload.temperature || 'morno';
      payload.commercial_line = payload.commercial_line || 'Linha Premium';
      payload.created_at = new Date().toISOString();

      const insertRes = await fetch(`${supabaseUrl}/rest/v1/leads`, {
        method: 'POST',
        headers: supabaseHeaders,
        body: JSON.stringify(payload)
      });
      if (!insertRes.ok) {
        const errText = await insertRes.text();
        console.error('Erro insert Supabase Gabriel:', errText);
        return res.status(500).json({ success: false, error: 'Erro ao cadastrar lead no Supabase', details: errText });
      }
      const inserted = await insertRes.json();
      resultData = Array.isArray(inserted) ? inserted[0] : inserted;
      if (!resultData) resultData = payload;
    }

    const actionText = existingLead ? (stage ? 'reorganizado' : 'atualizado') : 'inserido';
    const followupMsg = `Follow-up: ${payload.followup_date} (${cadence.followup_status}). ${cadence.reason}`;

    return res.status(200).json({
      success: true,
      action: existingLead ? (stage ? 'reorganize' : 'update') : 'create',
      channel: isInstagram ? 'instagram' : 'whatsapp',
      funnel: isInstagram ? 'Leads Instagram (Prospecção)' : 'Negociações WhatsApp (Fechamento)',
      followup_date: payload.followup_date,
      followup_status: cadence.followup_status,
      followup_reason: cadence.reason,
      message: `Lead "${resultData?.name}" ${actionText} com sucesso no funil ${isInstagram ? 'Leads Instagram' : 'Negociações WhatsApp'} de ${SELLER_NAME}! ${followupMsg}`,
      seller: SELLER_NAME,
      lead: { ...resultData, followup_status: cadence.followup_status }
    });
  } catch (err) {
    console.error('Erro interno /api/gabriel:', err);
    return res.status(500).json({ success: false, error: err.message || 'Erro interno.' });
  }
}
