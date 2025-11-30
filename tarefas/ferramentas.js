// =================================================================
// ⏲️ POMODORO - INÍCIO/FIM, TEMPO E INTERVALOS
// =================================================================

let pomodoro = document.getElementById('pomodoro');
let taskbot = document.getElementById('taskBot')
let tempoRestante = document.getElementById('tempoRestante');
let estadoAtual = document.getElementById('estadoAtual');
let comecarBtn = document.getElementById('comecar')
let resetarBtn = document.getElementById('recomecar');
let audioFoco = document.getElementById('audioFoco')
let audioIntervalo = document.getElementById('audioIntervalo')
let tempoFoco = 10; // Tempo de foco (10 segundos pra ficar utilizável, mas o padrão é 25 MINUTOS)
let tempoIntervaloP = 5; // Tempo de intervalo curto (o padrão é 5 MINUTOS)
let tempoIntervaloL = 7; // Tempo de intervalo longo, que aparece depois de 3 focos (o padrão é 15 MINUTOS)
let etapaAtual = 0; // Foco, descando curto ou longo
let qntdFocos = 0;
let intervalo; // Intervalo que vai diminuir o tempo

// Só um valor, mas vale deixar pela padronização
const estadosPomodoro = {
    rodando: false
}

function atualizarTimer() {
    let tempoAtual; // Cria uma variável que vai armazenar o tempo atual

    if (etapaAtual == 0) { // Se a etapa for de foco  
        tempoAtual = tempoFoco; // O tempo será de foco
        estadoAtual.innerHTML = "Foco" // E o texto também
    } else if (etapaAtual == 1) { // Mesma coisa para intervalo curto
        tempoAtual = tempoIntervaloP;
        estadoAtual.innerHTML = "Intervalo Curto"
    } else if (etapaAtual == 2) { // E mesma coisa para intervalo longo
        tempoAtual = tempoIntervaloL;
        estadoAtual.innerHTML = "Intervalo Longo"
    }

    // Aqui temos duas constantes:
    // Uma de minutos, que pega a quantidade de segundos e divide por 60 arredonda pra baixo
    // Outra de segundos, que pega o resto dos minutos
    const minutos = Math.floor(tempoAtual / 60);
    const segundos = tempoAtual % 60;

    // Atualiza o tempo
    // A função padStart() coloca um caractere desejável até preencher a quantidade desejável (no caso 0 e 2, respectivamente)
    tempoRestante.innerHTML = 
    `
    ${minutos.toString().padStart(2, "0")}
    :
    ${segundos.toString().padStart(2, "0")}
    `
}

function comecarTimer() {
    if (etapaAtual == 0) { // Se for etapa de foco
        console.log('Hora de focar')
        intervalo = setInterval(() => { // A cada segundo...
            tempoFoco--; // Diminui o timer
            atualizarTimer(); // Atualiza o timer também
        
            if (tempoFoco == 0) { // Se chegar a 0
                qntdFocos++; // Aumenta a quantidade de focos
                if (qntdFocos == 3) { // Se a quantidade de focos for 3
                    qntdFocos = 0; // Reseta
                    etapaAtual = 2; // Vai pro intervalo longo
                } else { // Se não
                    etapaAtual = 1; // Vai pro intervalo curto
                }
                clearInterval(intervalo); // Faz o intervalo parar de rodar
                audioFoco.play(); // Sonzinho de concluído
                
                // Reseta as variáveis de tempo
                tempoFoco = 10; 
                tempoIntervaloP = 5;
                tempoIntervaloL = 7;
                estadosPomodoro.rodando = false;
                atualizarTimer();
                comecarBtn.classList.replace('fa-pause', 'fa-play'); // Botão de pause volta ao normal
            }
        }, 1000);
    } else if (etapaAtual == 1) { // Se for hora de descando curto
        intervalo = setInterval(() => {
            // Faz a mesma coisa do foco, mas com o tempo de descanso curto
            tempoIntervaloP--;
            atualizarTimer();
            
            if (tempoIntervaloP == 0) { // Se chegar a 0, volta ao foco
                clearInterval(intervalo);
                etapaAtual = 0;
                audioIntervalo.play(); // Som de concluído (diferente do de foco)
                tempoFoco = 10;
                tempoIntervaloP = 5;
                tempoIntervaloL = 7;
                estadosPomodoro.rodando = false;
                atualizarTimer();
                comecarBtn.classList.replace('fa-pause', 'fa-play');
            }
        }, 1000);
    } else if (etapaAtual == 2) { // Se for hora do descanso longo
        intervalo = setInterval(() => {
            tempoIntervaloL--;
            atualizarTimer();
            
            if (tempoIntervaloL == 0) { // Quando acabar, volta para o foco 
                clearInterval(intervalo);
                etapaAtual = 0;
                audioIntervalo.play(); // Som de concluído (igual ao de descanso curto)

                tempoFoco = 10;
                tempoIntervaloP = 5;
                tempoIntervaloL = 7;
                estadosPomodoro.rodando = false;
                atualizarTimer();
                comecarBtn.classList.replace('fa-pause', 'fa-play');
            }
        }, 1000);
    }
}

function pausarTimer() {
    // Para pausar o timer
    clearInterval(intervalo); // Parar o intervalo, ou seja, para de rodar a cada segundo
}

function resetarTimer() {
    // Para resetar o timer
    clearInterval(intervalo); // Para o intervalo
    // Reseta as variáveis de tempo
    tempoFoco = 10;
    tempoIntervaloP = 5;
    tempoIntervaloL = 7;
    atualizarTimer();
}

function botoesEventos() {
    comecarBtn.addEventListener('click', () => {
        // Quando clicar no botão de começar
        if (estadosPomodoro.rodando == false) { // Se não tiver rodando, começa o timer
            comecarTimer();
            comecarBtn.classList.replace('fa-play', 'fa-pause') // Troca pra pausar
        } else { // Se tiver todando, para o timer
            pausarTimer(); 
            comecarBtn.classList.replace('fa-pause', 'fa-play') // Troca para rodar
        }
        estadosPomodoro.rodando = !estadosPomodoro.rodando; // Inverte a variável de controle se está rodando
    })

    resetarBtn.addEventListener('click', () => {
        // Quando clicar em resetar o timer
        resetarTimer(); // Reseta o timer
        comecarBtn.classList.replace('fa-pause', 'fa-play'); // Troca o ícone para rodar
    })
}

// =================================================================
// 🤖 CHATBOT - MENSAGENS PROGRAMADAS
// =================================================================

function eventoPerguntas() {
    let perguntasBtn = document.getElementsByClassName('perguntaBtn');
    let balaoPergunta = document.getElementById('perguntaText');
    let balaoResposta = document.getElementById('respostaText');
    // Array com as respostas predefinidas
    let respostas = [
        "Para usar o Pomodoro no TaskFlow, basta iniciar o timer. Enquanto ele roda, você trabalha na tarefa que quiser. O timer segue o ciclo Pomodoro padrão: 3x focos, 2x pausas curtas e 1x pausa longa. Quando terminar sua tarefa, é só marcá-la como concluída normalmente.",
        "Claro! As lista de tarefas reorganizadas é: português, história, lição de casa, geografia. Deste jeito, segue-se um fluxo mais tranquilo e mais leve!",
        "Para completar as suas tarefas (português, história, lição de casa, geografia) em 5 horas você deve dividir as 5 horas entre as tarefas e depois usar o Pomodoro para manter foco nelas.",
        "Para reduzir distrações, mantenha apenas o que você precisa enquanto realiza tarefas. Feche abas e apps desnecessários, ative o modo “não perturbe” do celular e deixe seu ambiente organizado. O TaskFlow também pode te ajudar: use o Pomodoro para focar por blocos curtos e só conferir mensagens nas pausas. Assim você mantém atenção total no que realmente importa."
    ]

    // Array com as respostas predefinidas
    let perguntas = [
        "Como uso o Pomodoro com as minhas tarefas?",
        "Reorganize as minhas tarefas, por gentileza.",
        "Como posso realizar minhas tarefas em 5 horas?",
        "Como eliminar minhas distrações?"
    ]

    // Pra cada botão de pergunta, adiciona evento de clique
    Array.from(perguntasBtn).forEach((button, index) => {
        button.addEventListener('click', () => {
            // Quando clica, percorre cada botão e remove a classe
            for (let i = 0; i < perguntasBtn.length; i++) {
                perguntasBtn[i].classList.remove('selecionado');
            }

            button.classList.toggle('selecionado'); // Adiciona a classe no botão selecionado
            // Pega o índice do botão clicado e pega do Array (botão 1 pega pergunta e resposta 1)
            balaoPergunta.innerHTML = perguntas[index];
            balaoResposta.innerHTML = respostas[index];

            // Alinha o perfil com o balão da pergunta (se tiver mais de uma linha)
            alinharComPerfil(balaoPergunta)
            alinharComPerfil(balaoResposta)
        });
    })
}

// ==================================================================
// 🎨 INTERFACE - CONFETES, TROCA DE FERRAMENTA, TEMA, ACESSIBILIDADE
// ==================================================================

// OBS: não precisa redeclarar o userDB, por que já foi declarado no outro script desta página

function trocarTool(ferramenta, el) {
    let btnsTrocarTool = document.getElementsByClassName('navDireita');

    // Quando clica no botão da ferramenta selecionada, remove o selecionado de todos os botões
    Array.from(btnsTrocarTool).forEach(btn => {
        btn.classList.remove('selecionado')
    })
    // Adiciona classe
    el.classList.add('selecionado')

    switch (ferramenta) {
        case 0: // Se tiver clicado em Pomodoro
            // Remove a classe de ocultado do Pomodoro
            // Adiciona a classe no TaskBot
            pomodoro.classList.remove('oculto');
            taskbot.classList.add('oculto');
            break;
        case 1: // Se tiver clicado em TaskBot
            // Adiciona a classe de ocultado do Pomodoro
            // Remove a classe no TaskBot
            pomodoro.classList.add('oculto');
            taskbot.classList.remove('oculto');
            break;
        default: // O padrão é o pomodoro
            pomodoro.classList.remove('oculto');
            taskbot.classList.add('oculto');
            break;
    }
} 

function alinharComPerfil(el) {
    // Essa função alinha o perfil com o balão de mensagem
    // Por quê?
    // Porque se usarmos "align-items: start" em todos, as mensagens com 1 linha ficam MUITO para cima
    // Então foi criado um algoritmo que verifica a quantidade de linhas
    let estilo = window.getComputedStyle(el);
    let altura = parseFloat(estilo.height); // Pega a altura do elemento
    let lineHeight = parseFloat(estilo.lineHeight); // Pega a altura da linha
    let qntdLinhas = Math.round(altura / lineHeight); // Divide altura por altura da linha (resulta na quantidade de linhas...)

    // Agora é fácil, se for maior que 2, adiciona a classe 'multinhaLinha', que põem 'align-items: start' e tira o center
    if (qntdLinhas > 2) {
        el.closest('.balaoConversa').classList.add('multiLinha')
    }
}

function alterarTema() {
    let body = document.querySelector('body');
    let alterarTema = document.getElementById('temaFundo');
    let temaAtual = userDB.tema;

    alterarTema.addEventListener('click', () => {
        if (temaAtual == "escuro") { // Altera o tema para o modo claro
            body.classList.remove('temaEscuro');
            body.classList.add('temaClaro');
            
            temaAtual = "claro";
            
            document.getElementById('temaEscuro').style.display = 'none'
            document.getElementById('temaClaro').style.display = 'block'
        } else { // Altera o tema para o modo escuro
            body.classList.remove('temaClaro');
            body.classList.add('temaEscuro');
    
            temaAtual = "escuro";
    
            document.getElementById('temaClaro').style.display = 'none'
            document.getElementById('temaEscuro').style.display = 'block'
        }

        userDB = { // Salva no DB
            tema: temaAtual
        }
        localStorage.setItem('usuario', JSON.stringify(userDB)); // Atualiza no navegador
    })

    
}

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

// ============================================
// 🚀 INICIALIZAÇÃO
// ============================================

// Funções que rodam assim que a página inicia
document.addEventListener('DOMContentLoaded', () => {
    // Eventos
    botoesEventos();
    eventoPerguntas();

    // Interface
    alterarTema();
    verificarTema();
    alterarFonteRem();
}) 