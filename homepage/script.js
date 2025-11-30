// Tema escuro e claro
let body = document.querySelector('body');
let alterarTema = document.getElementById('temaFundo');
let temaAtual = "escuro"
let sparkle = document.getElementById('sparkleIcon');
let userDB = JSON.parse(localStorage.getItem('usuario')) || {};

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

    userDB = { // Salva no DB
        tema: temaAtual
    }
    localStorage.setItem('usuario', JSON.stringify(userDB)); // Atualiza no navegador
})

function verificarTema() {
    let body = document.querySelector('body');
    temaAtual = userDB.tema;

    // Condição que vê se o tema é claro ou escuro usando o userDB 
    if (userDB.tema == "claro") {
        body.classList.remove('temaEscuro');
        body.classList.add('temaClaro');
        
        temaAtual = "claro";
        
        document.getElementById('temaEscuro').style.display = 'none'
        document.getElementById('temaClaro').style.display = 'block'
    } else if (userDB.tema = "escuro") {
        body.classList.remove('temaClaro');
        body.classList.add('temaEscuro');

        temaAtual = "escuro";

        document.getElementById('temaClaro').style.display = 'none'
        document.getElementById('temaEscuro').style.display = 'block'
    }

    localStorage.setItem('usuario', JSON.stringify(userDB));
}

// Cards responsivos (para trocar)

let cardsContainer = document.getElementById('cardsResp');
let cardsResponsivos = cardsContainer.children;
let bolinhasContainer = document.getElementById('dotsResp');
let bolinhas = bolinhasContainer.children;
let cardAtual = 0;

let intervalo;
let intervaloTempo = 5000;

// Função que passa para o outro card
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

// Função que 
cardsContainer.addEventListener('click', () => {
    trocarCard(cardAtual);
    clearInterval(intervalo);
});

intervalo = setInterval(() => trocarCard(cardAtual), intervaloTempo);

// Mudar 'href' dependendo do tamanho da tela

let saberMaisBotao = document.getElementById('saberMais')

if (screen.width < 1400) {
    saberMaisBotao.setAttribute('href', '#cardsResp');
} else {
    saberMaisBotao.setAttribute('href', '#cards');
}   

// Acessibilidade

function alterarFonteRem() {
    // Função que altera todos os font-sizes de pixels para rem
    // Por quê?
    // Porque, com rem, podemos alterar o tamanho de uma fonte usando porcentagem
    // Então, com pixels, não poderíamos aumentar tudo em 110%
    // Mas com rem sim :D
    // Ahhh, essa parte entra em ACESSIBILIDADE

    document.querySelectorAll('*').forEach(elemento => {
        let style = getComputedStyle(elemento); // Pega as estilizações do elemento
        let fontSize = style.fontSize; // Depois pega o tamanho da fonte

        if (fontSize.endsWith('px') == false) { // Se já tiver em rem, ignora (dá return)
            return;
        };

        let valorPx = parseFloat(fontSize); // Se tiver em px mesmo, converte de String para decimal
        let valorRem = valorPx / 16; // Encontra o valor em rem
        // Por que dividido por 16?
        // Por que 1 rem equivale a 16 px ;)
        
        elemento.style.fontSize = valorRem + "rem"; // Aí só coloca o tamanho da fonte o tamanho em rem
    })
}

// CLASSES:
// 1. Grande: aumenta as fontes em 110%
// 2. Média: deixa em 100% (padrão) 
// 3. Pequena: diminui para 90%

function fontePequena() {
    console.log('pequena')
    let html = document.querySelector('html'); // Pega a tag <html>
    
    html.classList.remove('grande'); // Remove a classe de grande
    html.classList.add('pequena'); // Adiciona a de pequena
}

function fonteMedia() {
    console.log('media')
    let html = document.querySelector('html');
    
    // Remove as duas classes
    html.classList.remove('grande');
    html.classList.remove('pequena');
}

function fonteGrande() {
    console.log('grande')
    let html = document.querySelector('html');

    html.classList.add('grande'); // Adiciona a classe de grande
    html.classList.remove('pequena'); // Remove a classe de pequena
}

// Função que roda quando carrega a página

document.addEventListener('DOMContentLoaded', () => {
    // Faz a animação de itens subirem de baixo, com margin = 1000px para margin = 0px com transition  
    let main = document.querySelector('main');

    main.style.opacity = '0'
    main.style.marginTop = '1000px'
    
    setTimeout(() => {
        main.style.transition = 'opacity 1s, margin-top 1s'
        main.style.opacity = '1'
        main.style.marginTop = ''
    }, 400);

    // Mostra alerta de navegador e localhost para local storage
    window.alert("Para usar todas as funcionalidades do site, prefira os navegadores Chrome, Edge ou Opera.\n\nSe você estiver usando outro navegador, é só abrir o projeto em um localhost usando a extensão Live Server do VS Code.\n\nIsso acontece porque esses navegadores tratam as páginas do projeto como sendo da mesma origem, então o localStorage funciona normalmente entre elas. Nos outros navegadores isso não acontece, então o Live Server é necessário para criar um localhost e manter tudo na mesma origem.")

    // Acessibilidade
    alterarFonteRem();
    verificarTema();
});