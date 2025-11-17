// Função que roda quando carrega a página

document.addEventListener('DOMContentLoaded', () => {
    let main = document.querySelector('main');

    main.style.opacity = '0'
    main.style.marginTop = '1000px'
    
    setTimeout(() => {
        main.style.transition = 'opacity 1s, margin-top 1s'
        main.style.opacity = '1'
        main.style.marginTop = ''
    }, 400)
});


// Tema escuro e claro

let body = document.querySelector('body');
let alterarTema = document.getElementById('temaFundo');
let temaAtual = "escuro"
let sparkle = document.getElementById('sparkleIcon');

alterarTema.addEventListener('click', () => {
    if (temaAtual == "escuro") {
        body.classList.remove('temaEscuro');
        body.classList.add('temaClaro');
        sparkle.setAttribute('fill', 'rgba(0, 0, 0, 0.8)');
        
        temaAtual = "claro";
        
        document.getElementById('temaEscuro').style.display = 'none'
        document.getElementById('temaClaro').style.display = 'block'
    } else {
        body.classList.remove('temaClaro');
        body.classList.add('temaEscuro');
        sparkle.setAttribute('fill', '#fff');

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
    bolinhas[card].classList.remove('posAtual');
    if (card == 2) {
        card = 0;
    } else {
        card++;
    }
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