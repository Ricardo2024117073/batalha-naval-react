# Batalha Naval Avançada ⚓

Jogo de Batalha Naval desenvolvido em **React** e **JavaScript** no âmbito da unidade curricular de **Linguagens Script**, do Instituto Superior de Engenharia de Coimbra (ISEC), no ano letivo **2025/2026**.

O jogador enfrenta o computador num tabuleiro de 10 × 10, com posicionamento manual de navios, combate por turnos e funcionalidades adicionais como combustível, cronómetro, radar e inteligência artificial.

## Tecnologias utilizadas

- **React 19** — componentes e gestão do estado da aplicação.
- **JavaScript (JSX)** — lógica do jogo e comportamento dos componentes.
- **HTML e CSS** — estrutura e apresentação da interface.
- **Vite 8** — servidor de desenvolvimento e compilação da aplicação.

## Funcionalidades

- **Preparação da frota:** colocação manual de seis navios (tamanhos 5, 4, 3, 3, 2 e 2), na horizontal ou vertical, com validação de limites e sobreposições.
- **Adversário controlado pelo computador:** escolha entre três frotas predefinidas (*Alpha*, *Bravo* e *Charlie*) ou uma frota gerada aleatoriamente.
- **Combate por turnos:** ataques numa grelha 10 × 10, com indicação de falhas, acertos e navios afundados.
- **Inteligência artificial:** alternância entre procura aleatória (*hunt*) e ataque a posições adjacentes após detetar um navio (*target*).
- **Gestão de combustível:** o jogador começa com 100 unidades, gasta 5 por disparo e recupera 10 ao acertar num navio. O tempo esgotado penaliza em 5 unidades.
- **Cronómetro:** cada turno do jogador tem um limite de 15 segundos.
- **Radar:** desbloqueado ao acertar num navio em menos de 3 segundos; destaca uma região 2 × 2 que contém parte de um navio ainda não atingida.
- **Fim de jogo:** ecrã de vitória ou derrota, número total de jogadas e opção de recomeçar.
- **Modo de depuração:** possibilidade de visualizar a frota do computador durante os testes.

## Como executar o projeto

### Requisitos

- [Node.js](https://nodejs.org/) compatível com o **Vite 8** (versão 20.19+ ou 22.12+).
- npm (incluído normalmente na instalação do Node.js).

### Instalação

Clone o repositório:

```bash
git clone https://github.com/Ricardo2024117073/batalha-naval-react.git
cd batalha-naval-react
```

Instale as dependências:

```bash
npm install
```

Inicie a aplicação:

```bash
npm run dev
```

Abra no browser o endereço apresentado pelo Vite no terminal (normalmente `http://localhost:5173`).

### Outros comandos

```bash
npm run build    # Gera a versão de produção em dist/
npm run preview  # Pré-visualiza a versão de produção
npm run lint     # Executa a análise estática com ESLint
```

## Como jogar

1. Introduza o nome do comandante.
2. Posicione os seis navios no tabuleiro, alternando entre horizontal e vertical.
3. Selecione uma frota do computador (predefinida ou aleatória).
4. Ataque posições no tabuleiro adversário antes de terminar o tempo do turno.
5. Utilize o radar quando ficar disponível e tente afundar todos os navios adversários antes de perder a sua frota ou esgotar o combustível.

## Organização do código

```text
src/
├── App.jsx                       # Fases e estado geral da aplicação
├── components/                  # Componentes da interface
│   ├── board/                   # Tabuleiro
│   ├── cell/                    # Células do tabuleiro
│   ├── computer-select/         # Seleção da frota adversária
│   ├── dashboard/               # Combustível, cronómetro e radar
│   ├── game-over/               # Resultado da partida
│   ├── game-panel/              # Lógica principal do combate
│   ├── setup/                   # Nome e colocação dos navios
│   └── timer/                   # Cronómetro do turno
├── constants/                   # Constantes e regras do jogo
├── helpers/
│   ├── aiHelpers.js             # Algoritmo do adversário
│   └── boardHelpers.js          # Tabuleiros, navios e disparos
└── main.jsx                     # Entrada da aplicação React
```

## Contexto académico

Projeto realizado para a unidade curricular de **Linguagens Script** (ISEC, 2025/2026), com o objetivo de aplicar desenvolvimento de interfaces em React, gestão de estado, programação em JavaScript e organização modular do código.

**Perfil GitHub:** [Ricardo Santos](https://github.com/Ricardo2024117073).
