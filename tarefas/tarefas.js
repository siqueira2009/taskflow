// ================================================
// 📝 TAREFAS - DADOS E GERENCIAMENTO
// ================================================

let listasDB = JSON.parse(localStorage.getItem('listas')) || {};
let userDB = JSON.parse(localStorage.getItem('usuario')) || {};
const listaAtual = window.location.href.split('?')[1]
let tarefasConcluidas = [];
let tarefasNaoConcluidas = [];

// Classe que cria objetos das tarefas
class Tarefa {
    constructor (nome, descricao, data, done) {
        this.nome = nome
        this.descricao = descricao
        this.data = data
        this.done = done // Se está feita ou não
    }
}

// Função que salva as listas no navegador
function salvarListas() {
    localStorage.setItem('listas', JSON.stringify(listasDB));
}

function criarTarefas(nome, desc, data) {
    // Separa a data (naturalmente separada em -)
    let dataCortada = data.split('-');
    // Pega cada parte cortada e coloca / (para ficar igual a gente conhece)
    let dataFormatada = dataCortada[2] + "/" + dataCortada[1] + "/" + dataCortada[0]
    // Cria um novo objeto de tarefa usando a Classe criada
    const novaTarefa = new Tarefa(nome, desc, dataFormatada, false);

    // Pega todas as tarefas, pra ver onde adicionar a última
    // Adiciona no último espaço (se tiver 0 tarefas, adiciona na posição 0)
    let todasTarefas = listasDB[listaAtual].tarefas.length;
    listasDB[listaAtual].tarefas[todasTarefas] = novaTarefa;
    salvarListas();
    renderizarTarefas();
    resetarModal();
}

function atualizarTarefas(nome, novoNome, desc, data) {
    // Pega todas as tarefas existentes da lista atual
    let tarefas = listasDB[listaAtual].tarefas;

    // Pra cada tarefa, vê se é a que deseja alterar (parâmetro "nome")
    for (let i = 0; i < tarefas.length; i++) {
        if (tarefas[i].nome == nome) { // Se for, atualiza o nome, descrição e data (inalterável)
            tarefas[i].nome = novoNome;
            tarefas[i].descricao = desc;
            tarefas[i].data = data;
            salvarListas();
            renderizarTarefas();
            return; // Dá return pra parar de pesquisar
        }
    }
}

function verificarTarefas() {
    let tarefas = listasDB[listaAtual].tarefas;
    let tarefasContainer = document.getElementById('tarefas');
    tarefasConcluidas = [];
    tarefasNaoConcluidas = [];

    // Percorre todas as tarefas da lista
    // Vê se está feita em cada uma delas
    // Se tiver, adiciona no array de tarefas concluídas, se não adiciona em tarefas não concluídas
    for (let i = 0; i < tarefas.length; i++) {            
        if (!tarefas[i]) continue;
        if (tarefas[i].done == true) {
            tarefasConcluidas.push(i)
        } else {
            tarefasNaoConcluidas.push(i)
        }
    }

    // Aqui ele vai agir dependendo de duas condições:
    // 1. Se não tiver tarefa concluída
    // 2. Se tiver tarefa concluída
    let divNenhumaTarefa = document.getElementById('nenhumaTarefa');
    if (tarefasNaoConcluidas.length == 0) {
        // Se todas as tarefas estiverem concluídas (isto é, não tiver tarefa não concluida)
        // Cria uma div com mensagem de todas as tarefas concluídas
        if (!divNenhumaTarefa) {
            let novoDiv = document.createElement('div');
            novoDiv.id = "nenhumaTarefa";
            novoDiv.innerHTML = 
            `
            <img src="../imgs/SVGs/TudoFeito.svg" alt="Nenhuma tarefa">
            <h2><span>Nenhuma</span> tarefa!</h2>
            <h4>Tire esse tempo para <span>descansar</span></h4>
            `

            tarefasContainer.appendChild(novoDiv);
        }
    }  else {
        // Se alguma tarefa estiver não concluída (isto é, tarefas não concluidas maior que zero)
        // Remove a mensagem de tarefas concluídas (se estiver, se não dá pau, porque ele não encontra :/)
        if (divNenhumaTarefa) {
            divNenhumaTarefa.remove();
        }
    }

    // Aqui ele coloca a mensagem de nenhuma tarefa concluída (aparece em "Tarefas concluídas")
    let nenhumaTarefaConcluida = document.getElementById('nenhumaTarefaConcluida')
    // Ele verifica o Array de tarefas concluídas, se estiver vazio, aparece a mensagem, se estiver com algo, tira a mensagem
    if (tarefasConcluidas.length == 0) {
        nenhumaTarefaConcluida.style.display = "block"
    } else {
        nenhumaTarefaConcluida.style.display = ""
    }
}

function renderizarTarefas() {
    let tarefas = listasDB[listaAtual].tarefas;
    let tarefasContainer = document.getElementById('tarefas');
    let concluidasContainer = document.getElementById('tarefasConcluidas');
    let concluidasExistentes = document.querySelectorAll('.concluida')
    let tarefasExistentes = tarefasContainer.querySelectorAll('.tarefa');

    // Remove todas as tarefas concluídas
    Array.from(concluidasExistentes).forEach(tarefa => {
        tarefa.remove();
    })

    // Remove todas as tarefas não concluídas também
    Array.from(tarefasExistentes).forEach(tarefa => {
        tarefa.remove();
    })

    // Aqui percorre um loop para acessar cada uma das tarefas DAQUELA lista
    for (let i = 0; i < tarefas.length; i++) {
        // Cria uma nova LI
        let novaTarefa = document.createElement('li');
        novaTarefa.classList.add('tarefa');
        // Adiciona dois atributos (muito úteis depois :D)
        novaTarefa.setAttribute("tarefaNome", tarefas[i].nome.toLowerCase()) // Do nome da tarefa
        novaTarefa.setAttribute("tarefaData", tarefas[i].data) // Data da tarefa

        // Coloca texto dentro do LI, com dados da tarefa (salva no DB)
        novaTarefa.innerHTML = 
        `
            <div class="esquerda">
                <div class="checkbox">
                    <input type="checkbox" class="marcarConcluida">
                    <i class="fa-solid fa-circle-check tarefaConcluida"></i>
                    </div>
                    <i class="fa-solid fa-trash-can deletarTarefa deletarResponsiva"></i>
            </div>
            
            <div class="direita">
                <h3 class="tarefaTitleContainer">
                    <span class="tarefaTitle">${tarefas[i].nome}</span>
                    <i class="fa-solid fa-trash-can deletarTarefa"></i>
                </h3>
                <h5 class="tarefaDesc">${tarefas[i].descricao}</h5>
                <h5 class="tarefaData">${tarefas[i].data}</h5>
            </div>
        `
        
        // Depois verifica se essa tarefa está concluída
        if (tarefas[i].done == true) {
            // Se estiver, marca o checkbox
            let checkTarefa = novaTarefa.querySelector('input');
            checkTarefa.checked = true;

            // E adiciona classe de concluída (não muda nada no estilo, mas é bom pra controle...)
            novaTarefa.classList.add('concluida');
        }
        
        // Se a tarefa tiver a classe, coloca na UL de tarefas concluídas
        if (novaTarefa.classList.contains('concluida')) {
            concluidasContainer.appendChild(novaTarefa);
        } else {
            // Se não tiver a classe, coloca na parte de tarefas não concluídas (normais)
            tarefasContainer.appendChild(novaTarefa);
        }

    }

    // Roda muitas funções importantes...
    iconesEventos(); // Coloca evento nas tarefas
    editarEventos(); // Coloca evento de editar
    concluirTarefas(); // Coloca evento de concluir
    verificarTarefas(); // Verifica pra ver se coloca mensagem de tarefa concluída ou não

    // Pega o filtro anteriormente selecionado, usando a classe dele
    let filtroBtns = document.getElementsByClassName('filtroOpcao');

    // Aqui de fato seleciona o botão e roda a função de filtro (mais pra frente...)
    Array.from(filtroBtns).forEach(button => {
        if (button.classList.contains('selecionado')) {
            if (button.id == "filtroNome") {
                filtrarNome();
            } else {
                filtrarData();
            }
        }
    })
}

function iconesEventos() {
    // Funcionalidade de excluir tarefa (a única que tem mesmo...)
    let excluirIcones = document.querySelectorAll('.deletarTarefa');

    // Quando clica no ícone de excluir:
    // Simplesmente pega o nome da tarefa, encontra no DB e usa a função splice
    // O que essa função faz? Pega um index e substitui ele, fazendo ele parar de existir! Isso quer dizer, basicamente, deletar ele
    Array.from(excluirIcones).forEach(icone => {
        icone.addEventListener('click', () => {
            let tarefaPai = icone.closest('.tarefa');
            let tarefaPaiNome = tarefaPai.querySelector('.tarefaTitle').innerHTML.split("<")[0];
            let todasTarefas = listasDB[listaAtual].tarefas;
            
            Array.from(todasTarefas).forEach((tarefa, index) => {
                if (tarefa.nome == tarefaPaiNome) {
                    todasTarefas.splice(index, 1);
                }
            })

            // Salva e renderiza as listas
            salvarListas();
            renderizarTarefas();
        })
    })
}

function editarEventos() {
    // Trocar nome da tarefa
    let tarefasTitles = document.getElementsByClassName('tarefaTitle');

    // Quanto clica no nome dela, cria um input
    Array.from(tarefasTitles).forEach(title => {
        title.addEventListener('click', () => {
            const newInput = document.createElement('input');
            let tarefaAtual =  title.innerHTML;
            newInput.classList.add('inputAlteracao');
            newInput.value = tarefaAtual;
            let direita = title.closest('.direita')
            let descricao = direita.querySelector('.tarefaDesc');
            let data = direita.querySelector('.tarefaData');
            let excluirIcone = direita.querySelector('.deletarTarefa');
            excluirIcone.style.display = 'none'
            title.style.display = 'none';
            direita.insertBefore(newInput, descricao);
            newInput.focus()

            let inputAlteracao = document.getElementsByClassName('inputAlteracao');
            
            // Quando o input perde o foco (ou seja, quando clica fora), ele atualiza a lista usando a função com parâmetros
            // Isso só não acontece se o input estiver vazio
            // Depois deleta ele e mostra o nome normal
            Array.from(inputAlteracao).forEach(input => {
                input.addEventListener('focusout', () => {

                    if (input.value != "") {
                        atualizarTarefas(tarefaAtual, input.value, descricao.innerHTML, data.innerHTML)
                    }

                    let title = direita.querySelector('.tarefaTitle');
                    title.style.display = '';
                    excluirIcone.style.display = '';
                    input.remove();
                })
            })
        });
    });
    
    // Trocar descrição
    let tarefasDesc = document.getElementsByClassName('tarefaDesc');

    Array.from(tarefasDesc).forEach(desc => {
        desc.addEventListener('click', () => {
            const newTextArea = document.createElement('textarea');
            let tarefaAtual = desc.parentElement.querySelector('.tarefaTitleContainer').children[0].innerHTML;
            newTextArea.classList.add('textAreaAlteracao');
            newTextArea.value = desc.innerHTML;
            newTextArea.setAttribute('oninput', 'textAreaHeight(this)')
            
            let direita = desc.closest('.direita');
            let data = direita.querySelector('.tarefaData');
            direita.insertBefore(newTextArea, data);
            desc.style.display = 'none';
            newTextArea.focus();
            textAreaHeight(newTextArea)

            let textAreaAlteracao = document.getElementsByClassName('textAreaAlteracao');
            
            Array.from(textAreaAlteracao).forEach(input => {
                input.addEventListener('focusout', () => {

                    if (input.value != "") {
                        atualizarTarefas(tarefaAtual, tarefaAtual, input.value, data.innerHTML)
                    }

                    let desc = direita.querySelector('.tarefaDesc');
                    desc.style.display = '';
                    input.remove();
                })
            })

        })
    })
}

function concluirTarefas() {
    let checkboxes = document.getElementsByClassName('marcarConcluida');

    // Quando marca o checkbox da lista
    Array.from(checkboxes).forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            let tarefaDiv = checkbox.closest('.tarefa');
            let nomeTarefa = tarefaDiv.querySelector('.tarefaTitle').innerText;

            let concluidas = document.getElementById('tarefasConcluidas');
            let naoConcluidas = document.getElementById('tarefas');
            
            // Coloca classe de concluída pra controle legal depois
            tarefaDiv.classList.toggle('concluida');

            // Se tiver acabado de dar check
            if (checkbox.checked) {
                criarJoinha(checkbox); // Cria efeito legal de joinha
                // E tira o clique por alguns segundos
                checkbox.style.pointerEvents = "none";
                setTimeout(() => { // Esse timeOut existe pra criar um delay, assim a animação de joinha pode rodar por completo
                    concluidas.appendChild(tarefaDiv); // Coloca na parte de concluídas
                    checkbox.style.pointerEvents = "";
                }, 1100);
            } else {
                // Se tiver DESMARCADO
                // Coloca na lista normal
                naoConcluidas.appendChild(tarefaDiv);
            }

            // Percorre todas as tarefas da lista atual
            let tarefas = listasDB[listaAtual].tarefas;
            // Em cada uma delas, verifica se o nome é igual a clicada
            // Se for, altera o valor de "done" para o que foi alterado
            // Depois para, já que já achou :D
            for (let i = 0; i < tarefas.length; i++) {
                if (tarefas[i].nome == nomeTarefa) {
                    tarefas[i].done = checkbox.checked;
                    break;
                }
            }

            // Salva as listas no navegador
            salvarListas();

            // Depois de ter ido para a parte de concluídas
            // Tem delay porque tem delay pra ir para concluídas também (pra mostrar o joinha)
            if (checkbox.checked) {
                setTimeout(() => {
                    verificarTarefas();
                }, 1100)
            } else { // Se foi desmarcado, pode só rodar direto, já que não tem joinha :(
                verificarTarefas();
            }
        });
    });
}

function filtrarNome() {
    // Essa função ordena por nome
    // É meio complicada... mas vou tentar explicar
    let btnFiltroNome = document.getElementById('filtroNome')
    let filtroBtns = document.getElementsByClassName('filtroOpcao');

    // Primeiro remove o selecionado de todos os filtros e coloca selecionado no botão clicado
    Array.from(filtroBtns).forEach(button => {
        button.classList.remove('selecionado')
    })
    btnFiltroNome.classList.add('selecionado')

    console.log('ordendando por nome!')

    let body = document.querySelector('body')
    let tarefasContainer = document.getElementById('tarefas');
    let tarefas = document.querySelectorAll('.tarefa');
    let tarefasNomes = [];
    let tarefasOrdenadas = [];
    
    // Depois vai em cada tarefa (não concluída) e coloca o nome delas em um Array (por isso o atributo falso criado lá em cima)
    Array.from(tarefas).forEach(tarefa => {
        if (tarefa.classList.contains('concluida') == false) {
            tarefasNomes.push(tarefa.getAttribute('tarefaNome'));
            body.appendChild(tarefa); // Depois põem a tarefa no body (pra colocar na ordem certa depois)
        }
    });
    
    // Ordena a lista dos nomes usando a própria função .sort() do JavaScript, que ordena em String em ordem alfabética
    tarefasNomes.sort();

    // Depois de ordenada
    Array.from(tarefasNomes).forEach(nome => {
        // Vai em cada nome das tarefas
        for (let i = 0; i < tarefas.length; i++) {
            // Agora, EM CADA NOME, verifica em todas as tarefas, se é a lista certa (usando o valor .nome e o nome mesmo)
            if (tarefas[i].getAttribute('tarefaNome') == nome) {
                // Se for, coloca a tarefa no array de tarefas ordenadas (vai ficar em ordem, porque está usando .push())
                tarefasOrdenadas.push(tarefas[i])
            }
        }
    })

    // Depois percorre cada tarefa do Array ordenado e vai colocando na lista de não concluídas, em ordem
    Array.from(tarefasOrdenadas).forEach(tarefa => {
        tarefasContainer.appendChild(tarefa);
    })
}

function filtrarData() {
    let filtroBtns = document.getElementsByClassName('filtroOpcao');
    let btnFiltroData = document.getElementById('filtroData')

    // Tira a seleção do outro botão e coloca no certo
    Array.from(filtroBtns).forEach(button => {
        button.classList.remove('selecionado')
    })
    btnFiltroData.classList.add('selecionado')

    console.log('ordenand por data!')

    let body = document.querySelector('body')
    let tarefasContainer = document.getElementById('tarefas');
    let tarefas = document.querySelectorAll('.tarefa');
    let tarefasDatas = [];
    let datasOrdenadas = [];

    // Coloca todas as datas num Array
    Array.from(tarefas).forEach(tarefa => {
        if (tarefa.classList.contains('concluida') == false) {
            let dataSeparada = tarefa.getAttribute('tarefaData').split('/'); // Separa a data, mês e ano
            let data = dataSeparada[2] + '-' + dataSeparada[1] + '-' + dataSeparada[0] // Coloca com - pra ordernar
            // O ano vem primeiro, pois assim, temos os elementos mais significativos antes
            // ANO -> determina muita coisa
            tarefasDatas.push(data); // Depois coloca em todas as datas
            body.appendChild(tarefa); // Coloca a tarefa no body (pra ordenar certinho depois)
        }
    })

    // Também usa o .sort() do JavaScript, porque ele trata data como String, o que dá certo 
    // Ele considera o ano e ordena ele alfabeticamente
    // Se fosse o dia daria errado, porque ele desconsideraria o ano (que é determinador)
    tarefasDatas.sort();    
    console.log(tarefasDatas)
    console.log(tarefas)

    // Depois das datas ordenadas, ele percorre cada data (ordenada)
    Array.from(tarefasDatas).forEach(data => {
        // Em cada tarefa, ele retorna ao valor original, que era: dd/mm/aaaa (é o que tá no atributo da tarefa)
        let dataSeparada = data.split('-');
        let dataFormatada = dataSeparada[2] + '/' + dataSeparada[1] + '/' + dataSeparada[0] 

        // Depois ele percorre, pra CADA DATA, todas as tarefas daquela lista
        for (let i = 0; i < tarefas.length; i++) {
            console.log('entrou')
            console.log(tarefas[i].getAttribute('tarefaData'))
            console.log(dataFormatada)
            if (tarefas[i].getAttribute('tarefaData') == dataFormatada) { // Se a data for o mesmo
                datasOrdenadas.push(tarefas[i]); // Coloca essa tarefa no Array de ordenadas
            }
        }
    })

    // Depois de tudo ordenado, começa a colocar na parte de tarefas não concluídas
    Array.from(datasOrdenadas).forEach(tarefa => {
        tarefasContainer.appendChild(tarefa);
    })

}


// ================================================
// 🎨 INTERFACE - MODAL, CONFETES, TEMA, ANIMAÇÕES
// ================================================

// Mesma técnica de objeto para controlar estados
// Aqui é meio inútil, já que só tem um estado :(
// Mas é bom deixar por padronização...
const estadosUI = {
    modalAberto: false
}

function abrirModal() {
    let modal = document.getElementById('modalContainer')
    let container = document.getElementById('container');
    let header = document.querySelector('header');
    let body = document.querySelector('body');

    // Tira o scroll da página (muito útil pra responsividade)
    body.style.overflow = "hidden";
    
    // Coloca blur legal no fundo
    modal.classList.toggle('ativo');
    container.style.filter = 'blur(2px)';
    header.style.filter = 'blur(2px)';
    
    // Altera o estado no objeto
    estadosUI.modalAberto = !estadosUI.modalAberto;
}

function fecharModal() {
    let modal = document.getElementById('modalContainer')
    let container = document.getElementById('container');
    let header = document.querySelector('header');
    let body = document.querySelector('body');
    
    // Deixa scrollar de novo
    body.style.overflow = "";

    // Tira o blur do fundo
    modal.classList.toggle('ativo');
    container.style.filter = '';
    header.style.filter = '';

    // Altera o estado do modal no objeto
    estadosUI.modalAberto = !estadosUI.modalAberto;
}

function modal() {
    let inputNome = document.getElementById('inputNome')
    let inputDesc = document.getElementById('inputDesc');
    let inputData = document.getElementById('inputData');

    // Abrir modal
    let modalContainerBtn = document.getElementById('adicionarTarefas');
    modalContainerBtn.addEventListener('click', () => {
        abrirModal()
    });

    // Fechar modal quando clica fora dele
    let modal = document.getElementById('modalContainer');
    modal.addEventListener('click', (e) => {
        if (e.target.id == "modalContainer") {
            fecharModal();
        }
    });

    // Fechar modal quando clica em cancelar
    let cancelarBtn = document.getElementById('cancelarCriacao');
    cancelarBtn.addEventListener('click', fecharModal);

    // Validação
    let criarBtn = document.getElementById('confirmarCriacao');

    // Validação do input (se tiver alterado e tudo tiver algo, ele libera)
    inputNome.addEventListener('keyup', () => {
        if (inputNome.value != "" && inputDesc.value != "" && inputData.value != "" && inputData.checkValidity() == true) {
            criarBtn.removeAttribute('disabled');
        } else {
            criarBtn.setAttribute('disabled', true);
        }
    });

    // Validação do textarea (mesma condição do input)
    inputDesc.addEventListener('keyup', () => {
        if (inputNome.value != "" && inputDesc.value != "" && inputData.value != "" && inputData.checkValidity() == true) {
            criarBtn.removeAttribute('disabled');
        } else {
            criarBtn.setAttribute('disabled', true);
        }
    });

    // Validação do input data (mesma condição dos dois de cima)
    inputData.addEventListener('change', () => {
        if (inputNome.value != "" && inputDesc.value != "" && inputData.value != "" && inputData.checkValidity() == true) {
            criarBtn.removeAttribute('disabled');
        } else {
            criarBtn.setAttribute('disabled', true);
        }
    });

    // Foi necessário colocar um evento de troca em cada um dos inputs, pois assim quando se altera um e depois outro, ainda vale

    // Criar tarefa quando clica no botão de criar (se disponível)
    criarBtn.addEventListener('click', () => {
        criarTarefas(inputNome.value, inputDesc.value, inputData.value);
        fecharModal();
    })
}

function resetarModal() {
    let inputNome = document.getElementById('inputNome');
    let inputDesc = document.getElementById('inputDesc');
    let inputData = document.getElementById('inputData');
    let criarBtn = document.getElementById('confirmarCriacao');

    // Reseta o modal quando cria a tarefa
    inputNome.value = "";
    inputDesc.value = "";
    inputData.value = "";
    criarBtn.setAttribute('disabled', true);
}

function textAreaHeight(el) {
    // Essa função é bem simples, mas bem útil
    // Ela faz o tamanho do textarea de quando está se editando a descrição aumentar enquanto se digita
    // Mas como isso acontece?
    // Ele muda o tamanho do elemento pro tamanho do scroll, o que automaticamente tira o scroll...
    el.style.height = '5px'
    el.style.height = (el.scrollHeight) + "px";
}

function criarJoinha(elemento) { // Essa função cria aquele efeito legal de joinha quando conclui a tarefa
    // Primeiro cria uma tag de itálica (usado pelo Font Awesome)
    let novoIcone = document.createElement('i'); 
    novoIcone.classList.add('fa-solid'); // Classe de ícone sólida
    novoIcone.classList.add('fa-thumbs-up'); // Classe de joinha 
    novoIcone.classList.add('animacaoFeito'); // Classe de animação (margin e rotação)

    // Elemento pai do checkbox abriga esse ícone (pra ele ficar bem no centro dele)
    // Mas por que o elemento pai e não diretamente o elemento (checkbox)?
    // Porque alguns navegadores não permitem que tags "void" apadrinhem elementos
    // Mas o que são tags "void"?
    // São tags que não são fechadas e não podem ter nenhum texto dentro (no caso aqui, um INPUT :D)
    elemento.closest(".checkbox").appendChild(novoIcone); 

    setTimeout(() => { // Depois de 100 segundos, ele começa a animação
        novoIcone.style.marginBottom = '60px'; // de 0px para 60px (sobe)
        novoIcone.style.rotate = '360deg' // de 0deg para 360deg (gira)
        novoIcone.style.opacity = '0' // vai ficando transparente
    }, 100) // Isso tem um delay, pra não acontecer ao mesmo tempo da classe 

    setTimeout(() => { // Depois da animação bonitinha e depois de desaparecer, ele é excluído
        novoIcone.remove();
    }, 1100)
}

function concluidasEvento() {
    let exibirIcon = document.getElementById('mostrarConcluidas');
    let tarefasConcluidas = document.getElementById('tarefasConcluidas');

    // Quando clica no botão de esconder/mostrar tarefas concluídas
    exibirIcon.addEventListener('click', () => {
        tarefasConcluidas.classList.toggle('fechada'); // Adiciona a classe responsável pela altura do elemento (height)
        
        if (tarefasConcluidas.classList.contains('fechada')) { // Gira o ícone (feedback visual)
            exibirIcon.style.transform = "rotate(180deg)"
        } else {
            exibirIcon.style.transform = "rotate(0deg)"
        }
    })
}

function filtroEventos() {
    let filtroBtns = document.getElementsByClassName('filtroOpcao');

    // Quando clica em qualquer botão de filtro
    Array.from(filtroBtns).forEach(btn => {        
        btn.addEventListener('click', () => {
            if (btn.id == "filtroData") { // Se for de data, aciona a função de data
                filtrarData();
            } else if (btn.id == "filtroNome") { // Se for de nome, aciona a função de nome
                filtrarNome();
            }
        })
    })
}

// ============================================
// 🚀 INICIALIZAÇÃO
// ============================================

// Coisas que vão rodar ASSIM que a página iniciar
// Importante pra dar evento nas coisas
document.addEventListener('DOMContentLoaded', () => {
    // Verifica se há parâmetros
    let parametros = window.location.href.split('?')[1]; // Pega os parâmetros da página (no caso o nome da lista)
    
    if (!listasDB[parametros]) { // Se a lista não existe
        // Mostra um alerta explicando o erro
        // E volta para a página de listas
        console.log("Lista não existente")
        alert('Parâmetros inválidos!\n\nIsso provavelmente quer dizer que a lista não existe!\n\nRedirecionando para a página de listas');
        window.location.href = "../listas/listas.html"
    } else {
        // Caso exista, só continua mesmo
        console.log("Lista existente")
    }

    // Interface
    modal();
    concluidasEvento();
    filtroEventos();
    
    // Tarefas
    renderizarTarefas();
    filtrarNome();

    // Colocar título/ícone da lista na lista...
    let listaTitulo = document.getElementById('listaTitle');
    let listaIcone = document.getElementById('listaIcone');
    let tituloPagina = document.querySelector('head').querySelector('title');

    listaTitulo.innerHTML = listasDB[listaAtual].nome;
    tituloPagina.innerHTML = "Lista - " + listasDB[listaAtual].nome;
    listaIcone.classList.add(listasDB[listaAtual].icone)

})

// Função que roda sempre que alguma tecla é pressionada
document.addEventListener('keydown', (e) => {
    // Se o modal estiver fechado, ignora (queremos ele aberto)
    if (!estadosUI.modalAberto) {
        return
    };

    let inputNome = document.getElementById('inputNome');
    let inputDesc = document.getElementById('inputDesc');
    let inputData = document.getElementById('inputData');

    // Fechar o modal quando clica ESC
    if (e.key == "Escape") {
        e.preventDefault();
        fecharModal();
        return;
    }

    // Criar tarefa quando clica ENTER (se for válido)
    if (e.key == "Enter") {
        e.preventDefault();

        let nomeTarefa = inputNome.value;
        let descricaoTarefa = inputDesc.value;
        let dataTarefa = inputData.value;

        // Faz uma verificação dos campos do modal (pra não criar errado)
        if (nomeTarefa != "" && descricaoTarefa != "" && dataTarefa != "") {
            criarTarefas(nomeTarefa, descricaoTarefa, dataTarefa)
            fecharModal();
        }
    }
});