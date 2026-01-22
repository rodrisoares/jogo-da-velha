// Elementos da tela de seleção
const telaSelecao = document.getElementById('tela-selecao');
const jogadorXBtn = document.getElementById('jogador-x');
const jogadorOBtn = document.getElementById('jogador-o');

// Elementos do jogo
const telaJogo = document.getElementById('tela-jogo');
const quadrados = document.querySelectorAll('.quadrado');
const jogadorSelecionadoLabel = document.getElementById('jogador-selecionado');
const vencedorSelecionadoLabel = document.getElementById('vencedor-selecionado');
const novoJogoBtn = document.getElementById('novo-jogo');
const proximaPartidaBtn = document.getElementById('proxima-partida');
const telaVencedor = document.querySelector('.vencedor');
const telaJogador = document.querySelector('.jogador');

// Elementos do placar
const pontosXLabel = document.getElementById('pontos-x');
const pontosOLabel = document.getElementById('pontos-o');
const pontosVelhaLabel = document.getElementById('pontos-velha');

let jogadorAtual = null;
let vencedor = null;
let primeiroJogador = null;
let pontosX = 0;
let pontosO = 0;
let pontosVelha = 0;

// Funções
function escolherQuadrado(event) {
    if (vencedor !== null) {
        return;
    }

    const quadrado = event.target;
    if (quadrado.innerHTML !== '-') {
        return;
    }

    quadrado.innerHTML = jogadorAtual;
    quadrado.classList.add('clicked'); 
    setTimeout(() => {
        quadrado.classList.remove('clicked');
    }, 300);

    if (jogadorAtual === 'X') {
        jogadorAtual = 'O';
    } else {
        jogadorAtual = 'X';
    }

    mudarJogador(jogadorAtual);
    checaVencedor();
}

function mudarJogador(valor) {
    jogadorAtual = valor;
    jogadorSelecionadoLabel.innerHTML = `<span class="game-status-label">Vez do jogador:</span> <span class="game-status-value">${jogadorAtual}</span>`;
}

function checaVencedor() {
    const combinacoes = [
        [1, 2, 3], [4, 5, 6], [7, 8, 9], // Horizontais
        [1, 4, 7], [2, 5, 8], [3, 6, 9], // Verticais
        [1, 5, 9], [3, 5, 7]             // Diagonais
    ];

    let haVencedor = false;
    for (const combinacao of combinacoes) {
        const [a, b, c] = combinacao;
        const quadradoA = document.getElementById(a);
        const quadradoB = document.getElementById(b);
        const quadradoC = document.getElementById(c);

        if (checaSequencia(quadradoA, quadradoB, quadradoC)) {
            mudaCorQuadrado(quadradoA, quadradoB, quadradoC);
            mudarVencedor(quadradoA);
            haVencedor = true;
            return;
        }
    }

    // Verificar empate (se não houver vencedor e todos os quadrados estiverem preenchidos)
    if (!haVencedor && Array.from(quadrados).every(quadrado => quadrado.innerHTML !== '-')) {
        mudarVencedorVelha();
    }
}


function mudarVencedor(quadrado) {
    vencedor = quadrado.innerHTML;
    vencedorSelecionadoLabel.innerHTML = vencedor;
    telaVencedor.style.display = 'block'; 
    telaJogador.style.display = 'none'; 
    proximaPartidaBtn.style.display = 'block';
    novoJogoBtn.style.display = 'block';

    if (vencedor === 'X') {
        pontosX++;
    } else if (vencedor === 'O') {
        pontosO++;
    }

    atualizarPlacar();
}

// NEW: Função para quando a Velha ganha (empate)
function mudarVencedorVelha() {
    vencedor = 'Velha';
    vencedorSelecionadoLabel.innerHTML = 'Velha!';
    telaVencedor.style.display = 'block';
    telaJogador.style.display = 'none';
    proximaPartidaBtn.style.display = 'block';
    novoJogoBtn.style.display = 'block';
    pontosVelha++;
    atualizarPlacar();
}

function atualizarPlacar() {
    pontosXLabel.innerHTML = pontosX;
    pontosOLabel.innerHTML = pontosO;
    pontosVelhaLabel.innerHTML = pontosVelha;
}

function mudaCorQuadrado(quadrado1, quadrado2, quadrado3) {
    quadrado1.classList.add('winning-square');
    quadrado2.classList.add('winning-square');
    quadrado3.classList.add('winning-square');
}

function checaSequencia(quadrado1, quadrado2, quadrado3) {
    return (quadrado1.innerHTML !== '-' && quadrado1.innerHTML === quadrado2.innerHTML && quadrado2.innerHTML === quadrado3.innerHTML);
}

function resetarJogo() {
    vencedor = null;
    vencedorSelecionadoLabel.innerHTML = '';
    telaVencedor.style.display = 'none'; 
    telaJogador.style.display = 'block'; 
    jogadorAtual = primeiroJogador;

    quadrados.forEach(quadrado => {
        quadrado.classList.remove('winning-square', 'clicked'); 
        quadrado.style.background = '';
        quadrado.style.color = ''; 
        quadrado.innerHTML = '-';
    });

    mudarJogador(primeiroJogador);
}

function proximaPartida() {
    resetarJogo();
    proximaPartidaBtn.style.display = 'none';
    novoJogoBtn.style.display = 'block';
}

function novoJogo() {
    telaJogo.classList.add('fade-out');
    telaJogo.addEventListener('transitionend', function handler() {
        telaJogo.removeEventListener('transitionend', handler);
        telaJogo.style.display = 'none';
        telaJogo.classList.remove('fade-out');

        resetarJogoCompleto();
        telaSelecao.style.display = 'block';
        telaSelecao.classList.add('fade-in');
        // Remover fade-in após a animação
        telaSelecao.addEventListener('transitionend', function handlerFadeIn() {
            telaSelecao.removeEventListener('transitionend', handlerFadeIn);
            telaSelecao.classList.remove('fade-in');
        });
        document.getElementById('placar').style.display = 'none';
    });
}

function resetarJogoCompleto() {
    vencedor = null;
    vencedorSelecionadoLabel.innerHTML = '';
    telaVencedor.style.display = 'none'; 
    telaJogador.style.display = 'none'; 
    primeiroJogador = null;
    jogadorAtual = null;
    jogadorSelecionadoLabel.innerHTML = `<span class="game-status-label">Vez do jogador:</span>`; // Clear label for selection screen.

    // Resetar o tabuleiro visualmente
    quadrados.forEach(quadrado => {
        quadrado.classList.remove('winning-square', 'clicked');
        quadrado.style.background = '';
        quadrado.style.color = '';
        quadrado.innerHTML = '-';
    });

    pontosX = 0;
    pontosO = 0;
    pontosVelha = 0;
    atualizarPlacar();
    proximaPartidaBtn.style.display = 'none';
    novoJogoBtn.style.display = 'none';
}

function iniciarJogo(jogador) {
    primeiroJogador = jogador;
    mudarJogador(jogador);
    telaJogador.style.display = 'block';
    document.getElementById('placar').style.display = 'block';
    
    telaSelecao.classList.add('fade-out');
    telaSelecao.addEventListener('transitionend', function handler() {
        telaSelecao.removeEventListener('transitionend', handler);
        telaSelecao.style.display = 'none';
        telaSelecao.classList.remove('fade-out');

        resetarJogo(); // Resetar o tabuleiro para o novo jogo
        telaJogo.style.display = 'block';
        telaJogo.classList.add('fade-in');
        // Remover fade-in após a animação
        telaJogo.addEventListener('transitionend', function handlerFadeIn() {
            telaSelecao.removeEventListener('transitionend', handlerFadeIn);
            telaSelecao.classList.remove('fade-in');
        });
    });
    proximaPartidaBtn.style.display = 'none';
    novoJogoBtn.style.display = 'block';
}

// Event Listeners
jogadorXBtn.addEventListener('click', () => iniciarJogo('X'));
jogadorOBtn.addEventListener('click', () => iniciarJogo('O'));
proximaPartidaBtn.addEventListener('click', proximaPartida);
novoJogoBtn.addEventListener('click', novoJogo);

quadrados.forEach(quadrado => {
    quadrado.addEventListener('click', escolherQuadrado);
});

// Inicializa o placar e oculta a tela de jogo no carregamento
document.addEventListener('DOMContentLoaded', () => {
    atualizarPlacar();
    telaJogo.style.display = 'none';
    telaSelecao.style.display = 'block'; 
    proximaPartidaBtn.style.display = 'none';
    novoJogoBtn.style.display = 'none';
});