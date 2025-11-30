// ============================================
// 📝 LISTAS - DADOS E GERENCIAMENTO
// ============================================

let listasDB = JSON.parse(localStorage.getItem('listas')) || {};
let userDB = JSON.parse(localStorage.getItem('usuario')) || {};
let nomeAtual;
let iconeLista;

function salvarListas() {
    localStorage.setItem('listas', JSON.stringify(listasDB)); // Coloca no armazentamento do navegador o listasDB, ou seja, tudo de novo e velho
}

function renderizarListas() {
    let listasMenu = document.getElementById('listas');
    let sectionEsquerda = document.getElementById('listasEsquerda');
    let sectionDireita = document.getElementById('listasDireita');
    listasMenu.innerHTML = "";
    sectionEsquerda.innerHTML = "";
    sectionDireita.innerHTML = "";

    const keys = Object.keys(listasDB);

    // Verifica se não há nenhuma lista, se for true, mostra mensagem de nenhuma lista e dá "return" para acabar a função
    if (keys.length == 0) {
        mostrarMensagemSemListas("menu");
        mostrarMensagemSemListas("main", "todas");
        return;
    }

    // Se tiver lista, pega a lista atual (key X da extraída da listasDB)
    Array.from(keys).forEach((key, index) => {
        const lista = listasDB[key]; // Pega a lista, usando a key
        // Cria a lista no menu e no main
        criarItemMenu(lista);
        criarItemMain(lista, index);
    });

    // Adiciona evento de clique nos ícones da lista (excluir, editar, favoritar e deixa importante)
    eventosIcones();
}

function criarListas(nome, icone) {
    // Usa uma função para remover todos os caracteres com acento
    // Isso é usado para não ter erro quando passar a lista como parâmetro para a página de tarefas
    // A função é simples e funciona assim:
    // .normalize('NFD') separa o texto acentuado em dois, gerando o caractere normal e o acento
    // .replace(...) é uma função do próprio JavaScript, mas os seus parâmetros são do REGEX
    // O primeiro parâmetro (/[\u0300-\u036f]/g) pega todos os acentos (/g de global)
    // O segundo parâmetro substitui o que foi encontrado por nada ("")
    let nomeSemAcento = nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    // Se já existir uma lista com o nome desejado aparece uma mensagem de erro
    // Normalmente essa etapa nunca acontece, porque é bloqueado no próprio modal
    if (listasDB[nome]) {
        alert("Já existe uma lista com este nome, tente novamente");
        return;
    }

    // Criação da lista de fato
    let data = new Date();
    // Objeto com as informações da lista
    let novaLista = {
        nome: nome,
        icone: icone,
        dataCriacao: data.toLocaleString('pt-BR').split(',')[0], // Transforma a data no formato americano e tira as horas
        tarefas: [],
        favoritado: false,
        importante: false
    }

    listasDB[nomeSemAcento] = novaLista; // Adiciona a lista no banco de dados (sem acento)
    salvarListas(); // Salva os novos dados no navegador
    esconderMensagemSemListas(); // Esconde a mensagme de sem listas, caso ela exista

    setTimeout(resetarModal, 400); // Reseta o modal (input e ícone escolhido)
}

function atualizarListas(nome, icone) { 
    let nomeSemAcento = nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Mesma função para tirar acento

    // Cria uma nova lista com novos dados
    const listaAtualizada = { 
        nome: nome,
        icone: icone,
        dataCriacao: listasDB[nomeAtual].dataCriacao,
        tarefas: listasDB[nomeAtual].tarefas,
        favoritado: listasDB[nomeAtual].favoritado,
        importante: listasDB[nomeAtual].importante
    }

    delete listasDB[nomeAtual]; // Deleta a lista antiga
    listasDB[nomeSemAcento] = listaAtualizada; // Adiciona a nova lista (atualizada) no banco de dados local

    salvarListas(); // Põem tudo no navegador
}

function resetarModal() {
    let inputNome = document.getElementById('inputNome');
    let iconeEscolhido = document.getElementById('iconeEscolhido');
    let opcoesIcones = document.getElementById('opcoesIcones');
    let criarBtn = document.getElementById('confirmarCriacao')

    // Limpa os dados do modal
    inputNome.value = ''; 
    iconeEscolhido.classList.replace(iconeEscolhido.classList[1], 'fa-graduation-cap'); 
    opcoesIcones.scrollBy({left: -1000});
    Array.from(opcoesIcones.children).forEach(el => {
        el.classList.remove('iconeSelecionado');
    })
    opcoesIcones.children[0].classList.add('iconeSelecionado');
    criarBtn.setAttribute('disabled', true)
}

function mostrarMensagemSemListas(elemento, tipoMain) {
    // Se for do menu...
    if (elemento == "menu") {
        let listasMenu = document.getElementById('listas');
        listasMenu.innerHTML = `            
        <li id="nenhumaLista">
                <i class="fa-solid fa-clock"></i>Nenhuma lista...
        </li>`
    } else if (elemento == "main") { // Se for do main (onde terá os cards das listas)
        let main = document.querySelector('main');

        // Se não tiver mensagem de erro, cria uma
        if (main.children.length == 2) {
            let listaTitle = document.getElementById('listasTitleMain');
            listaTitle.style.display = 'none';

            let div = document.createElement('div');
            let h1 = document.createElement('h1');
            let img = document.createElement('img');
            div.appendChild(img);
            div.appendChild(h1);
            img.src = "../imgs/SVGs/Vazio.svg"
            div.id = "nenhumaListaMain"

            if (tipoMain == "todas") {
                h1.innerHTML = `Ainda <span>não há</span> nenhuma lista...`;
            } else if (tipoMain == "favoritas") {
                h1.innerHTML = `<span>Nenhuma</span> lista favorita...`;
            } else if (tipoMain == "importante") {
                h1.innerHTML = `<span>Nenhuma</span> lista importante...`
            }

            main.appendChild(div)
        } else { // Se já tiver, altera (isso acontece em troca de filtro)
            let div = document.getElementById('nenhumaListaMain');

            if (tipoMain == "todas") {
                div.children[1].innerHTML = `Ainda <span>não há</span> nenhuma lista...`;
            } else if (tipoMain == "favoritas") {
                div.children[1].innerHTML = `<span>Nenhuma</span> lista favorita...`;
            } else if (tipoMain == "importante") {
                div.children[1].innerHTML = `<span>Nenhuma</span> lista importante...`
            }
        }
    }
}

function esconderMensagemSemListas() {
    let nenhumaListaMain = document.getElementById('nenhumaListaMain');
    let nenhumaListaMenu = document.getElementById('nenhumaLista');
    let listasTitleMain = document.getElementById('listasTitleMain');
    
    // Remove só se existir
    if (nenhumaListaMain) {
        nenhumaListaMain.remove();
    }
    
    if (nenhumaListaMenu) {
        nenhumaListaMenu.remove();
    }

    // Faz o título voltar a aparecer (tinha sido removido na funçãode mostrar mensagem de sem listas)
    listasTitleMain.style.display = '';
}

function criarItemMenu(lista) {
    let listasMenu = document.getElementById('listas')
    // Cria um novo li com os dados da função
    let li = document.createElement('li');
    let nomeListaSemAcento = lista.nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    li.innerHTML = `
    <span class="nomeLista">
        <i class="fa-solid ${lista.icone} iconeLista"></i>
        <span>${lista.nome}</span>
    </span>
    <i class="fa-solid fa-angle-right abrir"></i>
    `

    li.addEventListener('click', () => {
        window.location.href = `../tarefas/tarefas.html?${nomeListaSemAcento}`
    })

    li.classList.add('listaMenu');

    listasMenu.appendChild(li); // E abriga no <ul>
}

function criarItemMain(lista, index) {
    let sectionEsquerda = document.getElementById('listasEsquerda');
    let sectionDireita = document.getElementById('listasDireita');

    // Cria um article
    let article = document.createElement('article');
    article.id = lista.nome;
    article.classList.add('lista');

    // Se for favoritada/importante, adiciona a classe disto
    if (lista.favoritado) {
        article.classList.add('favoritada')
    }

    if (lista.importante) {
        article.classList.add('importante')
    }

    // Coloca os dados da lista
    article.innerHTML = `
    <div class="esquerda">
        <h1 class="listaTitle">
            <i class="fa-solid ${lista.icone} listaIcon"></i>
            <span>${lista.nome}</span>
        </h1>
        <h4 class="listaInfo">
            <span class="atualizacao">criada em ${lista.dataCriacao}</span> • 
            <span class="itens">${lista.tarefas.length} itens</span>
        </h4>
    </div>
    <div class="direita">
        <i class="fa-solid fa-trash-can excluirLista iconeLista"></i>
        <i class="fa-solid fa-pen-ruler editarLista iconeLista"></i>
        <i data-marcado="${lista.importante}" class="fa-${lista.importante ? 'solid' : 'regular'} fa-bookmark listaFiltros ${lista.importante ? 'selecionado' : ''} iconeLista"></i>
        <i data-marcado="${lista.favoritado}" class="fa-${lista.favoritado ? 'solid' : 'regular'} fa-star listaFiltros ${lista.favoritado ? 'selecionado' : ''} iconeLista"></i>
    </div>
    `

    // Coloca um evento ao clicar (redireciona para a página de tarefas, com o parâmetro de nome sem acento)
    // Esse parâmetro serve pra quê?
    // Serve para saber qual lista está acessando em outra página
    article.addEventListener('click', () => {
        window.location.href = `../tarefas/tarefas.html?${lista.nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`
    })

    // Se for par, entra na esquerda
    if (index % 2 == 0) {
        sectionEsquerda.appendChild(article);
    } else { // Se for ímpar na direita
        sectionDireita.appendChild(article);
    }

}

function eventosIcones() {
    // Evento de favorito e importante
    const iconesFiltros = document.getElementsByClassName('listaFiltros');
    Array.from(iconesFiltros).forEach(icone => {
        icone.addEventListener('click', (event) => {
            event.stopPropagation(); // Faz o clique não contar na própria lista

            let listaPai = icone.closest('.lista');
            let nomeLista = listaPai.id;
            let isFavorito = icone.classList.contains('fa-star'); // Se foi clicado na estrela
            let tipo = isFavorito ? 'favoritado' : 'importante'; // Se foi clicado na estrela, o tipo é favorito, senão é importante
            let classe = isFavorito ? 'favoritada' : 'importante'; // A classe é baseada no tipo (usa outra variável porque o nome da classe muda)

            // Adiciona/remove as classes padrões
            icone.classList.toggle('fa-regular');
            icone.classList.toggle('fa-solid');
            icone.classList.toggle('selecionado');
            // Adiciona/remove a classe do que foi clicado (importante/favorito)
            listaPai.classList.toggle(classe);

            // Salva no DB
            listasDB[nomeLista][tipo] = !listasDB[nomeLista][tipo];
            salvarListas();

            // Pega o filtro que tava selecionado pra acionar depois do reload (renderização)
            let filtroBotao = document.getElementsByClassName('filtroBotao');
            let filtroSelecionado;
            Array.from(filtroBotao).forEach((el, index) => {
                if (el.classList.contains('selecionado')) {
                    filtroSelecionado = index;
                }
            })
            
            selecionarFiltro(filtroSelecionado);
        });
    });

    // Evento de excluir lista
    const excluirLista = document.getElementsByClassName('excluirLista');
    Array.from(excluirLista).forEach(icone => {
        // Simplesmente pega a lista e deleta ela
        // Depois salva no DB e renderiza tudo de novo (pra ela sumir de fato)
        icone.addEventListener('click', (event) => {
            event.stopPropagation();
            
            let listaPai = icone.closest('.lista');
            delete listasDB[listaPai.id];
            salvarListas();
            renderizarListas();
        });
    });

    // Evento de editar lista
    const editarLista = document.getElementsByClassName('editarLista');
    Array.from(editarLista).forEach(icone => {
        // Usa o mesmo modal de criar lista, mas muda algumas informações
        icone.addEventListener('click', (event) => {
            event.stopPropagation();
            
            nomeAtual = icone.parentElement.parentElement.id.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
            iconeLista = listasDB[nomeAtual].icone
            abrirModal("editar", iconeLista);
        })
    })
} 

function selecionarFiltro(index) {
    // Renderiza as listas primeiro, para ter o que filtrar (selecionar via classe)
    renderizarListas();

    let filtrosBtn = document.getElementsByClassName('filtroBotao');
    let todasListas = document.querySelectorAll('.lista'); // Aqui ela só consegue pegar por causa do renderizarListas()
    let listaTitle = document.getElementById('listasTitleMain');
    let sectionEsquerda = document.getElementById('listasEsquerda');
    let sectionDireita = document.getElementById('listasDireita');

    // Pra cada botão, tira a classe de selecionado
    Array.from(filtrosBtn).forEach(botao => {
        botao.classList.remove('selecionado')
    })
    filtrosBtn[index].classList.add('selecionado'); // Pro botão clicado, adiciona essa classe

    // Limpa todas as listas (apesar de renderizadas)
    sectionEsquerda.innerHTML = "";
    sectionDireita.innerHTML = "";

    let listasVisiveis = []; // Array com as listas que DEVEM aparecer (modificado depois)

    switch(index) {
        case 0: // Todas as listas
            listasVisiveis = Array.from(todasListas); // Adiciona todas as listas, já que são todas (dã...)
            listaTitle.innerHTML = "Todas as <span>listas</span>"; // Adiciona o texto mostrando que filtro é

            // Se não tiver, chama a função de sem lista
            if (listasVisiveis.length == 0) {
                mostrarMensagemSemListas("main", "todas");
            } else { // Caso tenho, chama a função de esconder sem lista
                esconderMensagemSemListas();
            }
            break;
        case 1: // Favoritas
            // Filtro que faz o seguinte:
            // Pega todas as listas, e faz uma verificação em cada uma delas
            // Só deixas as que possuem a classe "favoritada"
            listasVisiveis = Array.from(todasListas).filter(lista => lista.classList.contains('favoritada'));
            listaTitle.innerHTML = "Listas <span>favoritas</span>"; 

            if (listasVisiveis.length == 0) {
                mostrarMensagemSemListas("main", "favoritas");
            } else {
                esconderMensagemSemListas();
            }
            break;
        case 2: // Importantes
            // Filtro que faz o seguinte:
            // Pega todas as listas, e faz uma verificação em cada uma delas
            // Só deixas as que possuem a classe "importante"
            listasVisiveis = Array.from(todasListas).filter(lista => lista.classList.contains('importante'));
            listaTitle.innerHTML = "Listas <span>importantes</span>";

            if (listasVisiveis.length == 0) {
                mostrarMensagemSemListas("main", "importante");
            } else {
                esconderMensagemSemListas();
            }
            break;
        default: // Padrão
            // O padrão é o de todas as listas :)
            listasVisiveis = Array.from(todasListas);
            listaTitle.innerHTML = "Todas as <span>listas</span>";

            if (listasVisiveis.length == 0) {
                mostrarMensagemSemListas("main", "todas");
            } else {
                esconderMensagemSemListas();
            }
            break;
    }

    // Aqui ela faz a mesma coisa que o de renderizar listas
    // Coloca os pares na esquerda e os ímpares na direita
    Array.from(listasVisiveis).forEach((el, index) => {
        if (index % 2 == 0) {
            sectionEsquerda.appendChild(el);
        } else {
            sectionDireita.appendChild(el);
        }
    });
}

// ============================================
// 🎨 INTERFACE - MODAL, MENU, TEMA, ANIMAÇÕES
// ============================================

// Constante de objeto que armazena os estados de coisas (mais fácil de acessar)
const estadosUI = {
    listasAberto: true,
    menuAberto: true,
    modalAberto: false
}

// Função de abrir modal, usando dois parâmetros:
// Tipo (editar ou criar) e ícone atual
function abrirModal(tipo, icone) {
    let modal = document.getElementById('modalContainer');
    let modalTitle = modal.children[0].children[0];
    let modalIconeEscolhido = modal.children[0].children[1].children[0];
    let modalLabel = document.getElementById('inputNomeLabel');
    let modalInput = document.getElementById('inputNome');
    let modalIcones = document.getElementById('opcoesIcones').children;
    let criarBtn = document.getElementById('confirmarCriacao');
    let container = document.getElementById('container');
    let header = document.querySelector('header');

    // Limpa tudo antes
    modalInput.value = "";
    modalIconeEscolhido.classList.replace(modalIconeEscolhido.classList[1], "fa-graduation-cap");

    // Se for para criar
    if (tipo == "criar") {
        modalTitle.innerHTML = `Adicionar <span>lista</span>` // Muda o título
        modalLabel.innerHTML = "Nome da lista"; // Muda o label
        criarBtn.innerHTML = "Criar" // Muda o botão
    } else if (tipo == "editar") { // Se for para editar
        modalTitle.innerHTML = `Editar <span>lista</span>` // Muda o título
        modalLabel.innerHTML = "Novo nome" // Muda o label
        criarBtn.innerHTML = "Atualizar" // Muda o botão
        modalInput.value = listasDB[nomeAtual].nome; // Muda o valor do input pro nome atual
        modalIconeEscolhido.classList.replace(modalIconeEscolhido.classList[1], icone) // Muda o ícone escolhido pro ícone atual
        // Seleciona o ícone atual também
        Array.from(modalIcones).forEach(iconeAtual => {
            if (iconeAtual.classList.contains(icone)) {
                iconeAtual.classList.add('iconeSelecionado');
            } else {
                iconeAtual.classList.remove('iconeSelecionado');
            }
        });
    }

    // Aqui faz duas verificação: se for sem vazio ou já existente, desabilita o botão
    // Caso contrário, habilita
    // Essa verificação que impede de entrar naquele alert
    if (modalInput.value == "" || listasDB[modalInput.value]) {
        criarBtn.setAttribute('disabled', true);
    } else {
        criarBtn.removeAttribute('disabled');
    }

    // Ativa uma coisa no fundo: blur :O
    modal.classList.toggle('ativo');
    container.style.filter = 'blur(2px)';
    header.style.filter = 'blur(2px)';

    estadosUI.modalAberto = true; // Altera o estado do modal no objeto
}

function fecharModal() {
    let modal = document.getElementById('modalContainer');
    let container = document.getElementById('container');
    let header = document.querySelector('header');

    // Tira o blur legalzinho >:(
    modal.classList.toggle('ativo');
    container.style.filter = '';
    header.style.filter = '';

    // Muda a condição no objeto
    estadosUI.modalAberto = false;
}

function modal() {
    // Abrir modal
    let modalContainerBtn = document.getElementById('adicionarBotao');
    modalContainerBtn.addEventListener('click', () => {
        abrirModal("criar");
    });

    // Fecha o modal ao clicar fora dele
    let modal = document.getElementById('modalContainer');
    modal.addEventListener('click', (e) => {
        if (e.target.id == "modalContainer") {
            fecharModal();
        }
    });

    // Fecha modal ao clicar em cancelar
    let cancelarBtn = document.getElementById('cancelarCriacao');
    cancelarBtn.addEventListener('click', fecharModal);

    // Validação de criação (input) toda vez que nova tecla é pressionada (não só quando muda alguma coisa ou perde foco). Beeem dinâmico
    let inputNome = document.getElementById('inputNome');
    let criarBtn = document.getElementById('confirmarCriacao');
    inputNome.addEventListener('keyup', () => {
        if (inputNome.value == "" || listasDB[inputNome.value]) {
            criarBtn.setAttribute('disabled', true);
        } else {
            criarBtn.removeAttribute('disabled');
        }
    });

    // Validação de criação (ícone) toda vez que muda o ícone
    // Isso serve pra conseguir mudar só o ícone
    let opcoesIcones = document.getElementById("opcoesIcones").children;
    Array.from(opcoesIcones).forEach(icone => {
        icone.addEventListener('click', () => {
            let iconeEscolhido = listasDB[nomeAtual].icone
            if (icone.classList[1] == iconeEscolhido) {
                criarBtn.setAttribute('disabled', true);
                console.log('igual')
            } else {
                criarBtn.removeAttribute('disabled');
                console.log('diferente')
            }
        });
    });

    // Quando clica no botão de criar (quando tiver habilitado, obviamente)
    criarBtn.addEventListener('click', () => {
        let iconeEscolhido = document.getElementById('iconeEscolhido');
        let iconeSelecionado = iconeEscolhido.classList[1];
        
        // Pega o nome da lista e o ícone selecionado (que é a classe)
        let nomeLista = inputNome.value;
        let iconeLista = iconeSelecionado;

        if (criarBtn.innerHTML == "Criar") { // Se o conteúdo do botão for criar (ou seja, o modal for para a criação), cria uma lista
            criarListas(nomeLista, iconeLista);
        } else if (criarBtn.innerHTML == "Atualizar") { // Se for pra atualizar uma lista
            atualizarListas(nomeLista, iconeLista); // Ele atualiza a lista, uau!!!!
        }

        // Renderiza, seleciona o filtro geral e fecha o modal
        renderizarListas();
        selecionarFiltro(0);
        fecharModal(); 
    });
}

function escolherIcone() {
    let opcoesIcones = document.getElementById('opcoesIcones');
    let icones = opcoesIcones.children;
    let iconeEscolhido = document.getElementById('iconeEscolhido');
    
    // Quando clica em qualquer ícone disponível, ele põem classe de seleciona e atualiza o ícone escolhido
    Array.from(icones).forEach(el => {
        el.addEventListener('click', () => {
            Array.from(icones).forEach(el => el.classList.remove('iconeSelecionado'));

            iconeEscolhido.classList.replace(iconeEscolhido.classList[1], el.classList[1])
            el.classList.add('iconeSelecionado')
        });
    });
}

function scrollIcones() {
    let opcoesIcones = document.getElementById('opcoesIcones');
    let avancarIcone = document.getElementById('avancarIcone');
    let voltarIcone = document.getElementById('voltarIcone');
    let quantidadeAvanco = opcoesIcones.clientWidth * 0.2; // Tamanho do conteúdo de ícones (sem scroll) * 0.2 pra não avançar muito ;)

    // Aqui ele vê, se, o tamanho com scroll é menor que o tamanho normal, se for ele oculta as setas e retorna pra não scrollar nada sem existir nada
    if (opcoesIcones.scrollWidth < opcoesIcones.clientWidth) {
        avancarIcone.style.display = 'none';
        voltarIcone.style.display = 'none';

        return;
    }

    // Mas caso seja maior ele scrolla dependendo da seta clicada (left e right)
    avancarIcone.addEventListener('click', () => {
        opcoesIcones.scrollBy({left: quantidadeAvanco, behavior: 'smooth'});
    });

    voltarIcone.addEventListener('click', () => {
        opcoesIcones.scrollBy({left: -quantidadeAvanco, behavior: 'smooth'});
    });
}

function menuLateral() {
    // Expandir/recolher listas do menu
    let fecharListasIcon = document.getElementById('fecharListas');
    let listas = document.getElementById('listas')
 
    // Faz quando clica na setinha
    fecharListasIcon.addEventListener('click', () => {
        if (estadosUI.listasAberto == true) {
            listas.style.height = '0px'
            listas.style.padding = '0px'

            fecharListasIcon.style.rotate = '180deg'
        } else {
            listas.style.height = ''
            listas.style.padding = ''

            fecharListasIcon.style.rotate = '0deg'
        }

        // Muda o estado no objeto para o oposto
        estadosUI.listasAberto = !estadosUI.listasAberto;
    })

    // Fechar/abrir menu lateral
    let menuIcon = document.getElementById('fecharMenu');
    let menu = document.getElementById('menu');
    let filhosMenu = menu.children;

    // Quando clica pra fechar o menu
    menuIcon.addEventListener('click', () => {
        if (estadosUI.menuAberto == true) {
            // Ele faz os filhos terem o mesmo tamanho do pai
            // Isso pra quê? Pra eles não distorcerem na hora que o menu está diminuindo de largura
            // Qual a explicação técnica pra isso? O navegador, por algum motivo, não se importa com os elementos com mesmo tamanho do pai
            Array.from(filhosMenu).forEach(el => {
                el.style.width = menu.offsetWidth + 'px';
            });

            // Diminui o menu e coloca classe de fechado (útil pra controlar o tamanho do main em telas menores)
            menu.style.width = '0px';
            menu.style.padding = '0px'
            menu.classList.replace('aberto', 'fechado');
        } else { // Caso o objeto seja pra fechar, ele faz tudo oposto
            menu.style.width = '';
            menu.style.padding = '';
            menu.classList.replace('fechado', 'aberto');

            setTimeout(() => {
                Array.from(filhosMenu).forEach(el => {
                    el.style.width = '';
                })
            }, 400);
        }

        // Inverte o estado do menu no objeto
        estadosUI.menuAberto = !estadosUI.menuAberto;
    });
}

function verificarTema() {
    let switcherTema = document.getElementById('switch');
    let body = document.querySelector('body')
    
    // Quando muda o switcher (checkbox disfarçado...)
    switcherTema.addEventListener('change', () => {
        if (switcherTema.checked == true) { // Se for true, ele coloca tema claro no body
            body.classList.replace('temaEscuro', 'temaClaro');
            userDB = { // adiciona no userDB também
                tema: "claro"
            }
        } else { // Caso seja falso, aplica tema escuro
            body.classList.replace('temaClaro', 'temaEscuro');
            userDB = { // e adiciona no userDB
                tema: "escuro"
            }
        }

        localStorage.setItem('usuario', JSON.stringify(userDB));
    });

    // Condição que vê se o tema é claro ou escuro usando o userDB 
    if (userDB.tema == "claro") {
        body.classList.replace('temaEscuro', 'temaClaro');
        switcherTema.checked = true
    } else if (userDB.tema = "escuro") {
        body.classList.replace('temaClaro', 'temaEscuro');
        switcherTema.checked = false
    }
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

// Função que roda assim que inicia a página
document.addEventListener('DOMContentLoaded', () => {
    // Interface
    escolherIcone();
    scrollIcones();
    menuLateral();
    modal();
    verificarTema();
    alterarFonteRem();
    
    // Listas
    renderizarListas();
    selecionarFiltro(0);
})

// Função que roda quando uma tecla é apertada (pra fechar o modal com ESC e criar com ENTER)
document.addEventListener('keydown', (e) => {
    // Se o modal estiver fechado, ignora (queremos ele aberto)
    if (!estadosUI.modalAberto) {
        return
    };

    let inputNome = document.getElementById('inputNome');

    // Fechar o modal quando clica ESC
    if (e.key === "Escape") {
        e.preventDefault();
        fecharModal();
        return;
    }

    // Criar lista quando clica ENTER (se for válido)
    if (e.key === "Enter") {
        e.preventDefault();

        let nomeLista = inputNome.value;
        let iconeLista = document.getElementById('iconeEscolhido').classList[1];
        let criarBtn = document.getElementById('confirmarCriacao');

        // Verifica antes de criar lista
        if (criarBtn.innerHTML == "Criar" && (nomeLista !== "" && !listasDB[nomeLista])) {
            criarListas(nomeLista, iconeLista);
            renderizarListas();
            selecionarFiltro(0);
            fecharModal();
        }
    }
});