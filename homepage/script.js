// Função que roda quando carrega a página

document.addEventListener('DOMContentLoaded', () => {
    let bodyChildren = document.querySelector('body').children; // Todos os filhos do body

    Array.from(bodyChildren).forEach((el, index) => { // Margin para animação de baixo
        el.style.opacity = '0'
        if (index == 1) {
            el.style.marginTop = '0px'
        } else {
            el.style.marginTop = '1000px'
        }
        
        setTimeout(() => {
            el.style.transition = 'opacity 1s, margin-top 1s'
            el.style.opacity = '1'
            el.style.marginTop = ''
        }, 400)
    })
});


// Tema escuro e claro

let body = document.querySelector('body');
let alterarTema = document.getElementById('temaFundo');
let temaAtual = "escuro"

alterarTema.addEventListener('click', () => {
    if (temaAtual == "escuro") {
        body.classList.remove('temaEscuro');
        body.classList.add('temaClaro');

        temaAtual = "claro";

        document.getElementById('temaEscuro').style.display = 'none'
        document.getElementById('temaClaro').style.display = 'block'
    } else {
        body.classList.remove('temaClaro');
        body.classList.add('temaEscuro');

        temaAtual = "escuro";

        document.getElementById('temaClaro').style.display = 'none'
        document.getElementById('temaEscuro').style.display = 'block'
    }
})

// Cards responsivos

let cardsContainer = document.getElementById('cardsResp');
let cardsResponsivos = cardsContainer.children;
let bolinhasContainer = document.getElementById('dotsResp');
let bolinhas = bolinhasContainer.children;
let cardAtual = 0;

let intervalo;
let intervaloTempo = 5000;

function trocarCard(card) {
    cardsResponsivos[card].classList.remove('focused');
    cardsResponsivos[card].classList.add('notFocused');
    bolinhas[card].classList.remove('posAtual')
    if (card == 2) {
        card = 0;
    } else {
        card++;
    }
    cardsResponsivos[card].style.display = 'flex'
    cardsResponsivos[card].classList.add('focused');
    cardsResponsivos[card].classList.remove('notFocused');
    bolinhas[card].classList.add('posAtual');

    cardAtual = card;
}

cardsContainer.addEventListener('click', () => {
    trocarCard(cardAtual);
    clearInterval(intervalo);
    intervalo = setInterval(() => trocarCard(cardAtual), intervaloTempo);
});

intervalo = setInterval(() => trocarCard(cardAtual), intervaloTempo);

// Mudar 'href' dependendo do tamanho da tela

let saberMaisBotao = document.getElementById('saberMais')

if (screen.width < 1400) {
    saberMaisBotao.setAttribute('href', '#cardsResp');
} else {
    saberMaisBotao.setAttribute('href', '#cards');
}   