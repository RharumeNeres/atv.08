const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const perguntas = [
  {
    pergunta: "Qual é o nome completo do líder do BTS?",
    alternativas: [
      "a) Kim Namjoon",
      "b) Kim Seokjin",
      "c) Kim Taehyung"
    ],
    resposta: "a",
    nivel: 1,
    premio: 1000
  },
  {
    pergunta: "Qual membro do BTS é conhecido como 'Golden Maknae'?",
    alternativas: [
      "a) Jungkook",
      "b) Jimin",
      "c) V"
    ],
    resposta: "a",
    nivel: 2,
    premio: 9000
  },
  {
    pergunta: "Qual música do BTS contém a letra 'I'm the one I should love in this world'?",
    alternativas: [
      "a) Epiphany",
      "b) Serendipity",
      "c) Euphoria"
    ],
    resposta: "a",
    nivel: 3,
    premio: 40000
  },
  {
    pergunta: "Qual foi o primeiro show do BTS no Wembley Stadium?",
    alternativas: [
      "a) Love Yourself: Speak Yourself",
      "b) Map of the Soul",
      "c) Permission to Dance"
    ],
    resposta: "a",
    nivel: 4,
    premio: 150000
  },
  {
    pergunta: "Qual membro do BTS lançou a mixtape 'Hope World'?",
    alternativas: [
      "a) J-Hope",
      "b) RM",
      "c) Suga"
    ],
    resposta: "a",
    nivel: 5,
    premio: 800000
  }
];

let nomeJogador = "";
let rodadaAtual = 1;
let premioAcumulado = 0;
let premioGarantido = 0;
let jogoAtivo = true;
let perguntasDisponiveis = [...perguntas];
let perguntaAtual = null;
let ajudasDisponiveis = {
  pular: true,
  eliminar: true
};

function selecionarPergunta(nivel) {
  const perguntasNivel = perguntasDisponiveis.filter(p => p.nivel === nivel);
  if (perguntasNivel.length === 0) return null;
  const indice = Math.floor(Math.random() * perguntasNivel.length);
  const perguntaSelecionada = perguntasNivel[indice];
  perguntasDisponiveis = perguntasDisponiveis.filter(p => p !== perguntaSelecionada);
  return perguntaSelecionada;
}

function exibirPergunta() {
  console.log(`\n--- Rodada ${rodadaAtual} ---`);
  console.log(`Prêmio atual: R$ ${premioAcumulado.toLocaleString()}`);
  console.log(`Prêmio para esta pergunta: R$ ${perguntaAtual.premio.toLocaleString()}`);
  console.log(`\n${perguntaAtual.pergunta}\n`);
  perguntaAtual.alternativas.forEach(alt => console.log(alt));
  console.log("\nd) Parar");

  console.log("\nAjudas disponíveis:");
  if (ajudasDisponiveis.pular) console.log("p) Pular pergunta");
  if (ajudasDisponiveis.eliminar) console.log("e) Eliminar uma alternativa errada");
}

function ajudaEliminar() {
  const respostaCorreta = perguntaAtual.resposta;
  const alternativas = ['a', 'b', 'c'];
  const alternativasErradas = alternativas.filter(a => a !== respostaCorreta);
  const alternativaEliminada = alternativasErradas[Math.floor(Math.random() * alternativasErradas.length)];

  console.log(`\nFoi eliminada a alternativa ${alternativaEliminada.toUpperCase()}!`);
  console.log("Alternativas restantes:");
  perguntaAtual.alternativas
    .filter(alt => !alt.startsWith(alternativaEliminada))
    .forEach(alt => console.log(alt));
}

function processarResposta(resposta) {
  resposta = resposta.toLowerCase();

  if (resposta === 'p' && ajudasDisponiveis.pular) {
    ajudasDisponiveis.pular = false;
    console.log("\nVocê pulou a pergunta!");
    iniciarRodada();
    return;
  }

  if (resposta === 'e' && ajudasDisponiveis.eliminar) {
    ajudasDisponiveis.eliminar = false;
    ajudaEliminar();
    rl.question("\nSua resposta (a/b/c/d): ", processarResposta);
    return;
  }

  if (resposta === 'd') {
    console.log(`\nVocê escolheu parar. Leva para casa R$ ${premioAcumulado.toLocaleString()}!`);
    jogoAtivo = false;
    finalizarJogo();
    return;
  }

  if (resposta === perguntaAtual.resposta) {
    premioAcumulado += perguntaAtual.premio;

    
    if (rodadaAtual === 2 || rodadaAtual === 4) {
      premioGarantido = premioAcumulado;
    }

    console.log(`\nResposta correta! Seu prêmio agora é R$ ${premioAcumulado.toLocaleString()}!`);

    if (rodadaAtual === 5) {
      console.log("\n🎉 PARABÉNS! Você completou todas as rodadas e ganhou o prêmio de R$ 1.000.000! 💜");
      jogoAtivo = false;
      finalizarJogo();
    } else {
      rodadaAtual++;
      iniciarRodada();
    }
  } else {
    console.log(`\nResposta incorreta! A resposta correta era ${perguntaAtual.resposta.toUpperCase()}.`);
    console.log(`Você leva para casa R$ ${premioGarantido.toLocaleString()}.`);
    premioAcumulado = premioGarantido;
    jogoAtivo = false;
    finalizarJogo();
  }
}

function iniciarRodada() {
  perguntaAtual = selecionarPergunta(rodadaAtual);
  if (!perguntaAtual) {
    console.log("Não há mais perguntas disponíveis para este nível.");
    jogoAtivo = false;
    finalizarJogo();
    return;
  }

  exibirPergunta();
  rl.question("\nSua resposta (a/b/c/d): ", processarResposta);
}

function finalizarJogo() {
  console.log("\n--- FIM DO JOGO ---");
  console.log(`Jogador: ${nomeJogador}`);
  console.log(`Rodada alcançada: ${rodadaAtual} de 5`);
  console.log(`Resposta correta da última pergunta: ${perguntaAtual.resposta.toUpperCase()}`);
  console.log(`Prêmio final: R$ ${premioAcumulado.toLocaleString()}`);

  rl.question("\nDeseja jogar novamente? (s/n): ", (resposta) => {
    if (resposta.toLowerCase() === 's') {
      reiniciarJogo();
    } else {
      console.log("\nObrigado por jogar! Borahae! 💜");
      rl.close();
    }
  });
}

function reiniciarJogo() {
  rodadaAtual = 1;
  premioAcumulado = 0;
  premioGarantido = 0;
  jogoAtivo = true;
  perguntasDisponiveis = [...perguntas];
  perguntaAtual = null;
  ajudasDisponiveis = { pular: true, eliminar: true };

  console.log("\n=== NOVO JOGO ===");
  iniciarRodada();
}

console.log("=== SHOW DO MILHÃO - EDIÇÃO BTS ===");
console.log("💜 Bem-vindo ao quiz oficial sobre BTS! 💜");

rl.question("\nQual é o seu nome ARMY? ", (nome) => {
  nomeJogador = nome;
  console.log(`\nBem-vindo(a), ${nomeJogador}! Vamos começar o jogo!`);
  console.log("Regras:");
  console.log("- 5 rodadas com perguntas sobre BTS");
  console.log("- Você pode parar a qualquer momento respondendo 'd'");
  console.log("- Se errar, volta para o último prêmio garantido");
  console.log("- Ajudas disponíveis:");
  console.log("  * p) Pular pergunta (1 uso)");
  console.log("  * e) Eliminar uma alternativa errada (1 uso)\n");

  iniciarRodada();
});
