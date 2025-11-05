document.addEventListener('DOMContentLoaded', () => {
    let bodyChildren = document.querySelector('body').children;

    Array.from(bodyChildren).forEach((el, index) => {
        el.style.opacity = '0'
        if (index == 1) {
            el.style.marginTop = '0px'
        } else {
            el.style.marginTop = '100px'
        }
        
        setTimeout(() => {
            el.style.transition = 'opacity 1s, margin-top 1s'
            el.style.opacity = '1'
            el.style.marginTop = ''
        }, 400)
    })
});


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
let cardsResponsivos = document.querySelectorAll('.cardResp');
let bolinhasContainer = document.getElementById('dotsResp');
let bolinhas = bolinhasContainer.children;
let cardAtual = 0;
let cliques = 0;

function trocarCard(card) {
    cardsContainer.children[0].style.opacity = '0';

    cardsResponsivos[card].classList.remove('focused');
    cardsResponsivos[card].classList.add('notFocused');
    cardsResponsivos[card].style.display = 'none';
    bolinhas[card].classList.remove('posAtual')
    if (card == 2) {
        card = 0;
    } else {
        card++;
    }
    cardsResponsivos[card].style.display = 'flex'
    cardsResponsivos[card].classList.add('focused');
    cardsResponsivos[card].classList.remove('notFocused');
    bolinhas[card].classList.add('posAtual')
}

cardsContainer.addEventListener('click', () => {
    trocarCard(cardAtual);
    if (cardAtual == 2) {
        cardAtual = 0;
    } else {
        cardAtual++;
    }
})