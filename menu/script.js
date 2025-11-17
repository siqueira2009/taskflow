
// ============================================
// 📝 LISTAS - DADOS E GERENCIAMENTO
// ============================================


let listasDB = JSON.parse(localStorage.getItem('listas')) || {};

function salvarListas() {
    localStorage.setItem('listas', JSON.stringify(listasDB));
}

function renderizarListas() {
    let listasMenu = document.getElementById('listas');
    let sectionEsquerda = document.getElementById('listasEsquerda');
    let sectionDireita = document.getElementById('listasDireita');
    listasMenu.innerHTML = "";
    sectionEsquerda.innerHTML = "";
    sectionDireita.innerHTML = "";

    const keys = Object.keys(listasDB);

    if (keys.length == 0) {
        mostrarMensagemSemListas("menu");
        mostrarMensagemSemListas("main", "todas");
        return;
    }

    Array.from(keys).forEach((key, index) => {
        const lista = listasDB[key];
        criarItemMenu(lista);
        criarItemMain(lista, index);
    });

    eventosIcones();
}

function criarListas(nome, icone) {
    if (listasDB[nome]) {
        alert("Já existe uma lista com este nome, tente novamente");
        return;
    }

    let data = new Date();
    let novaLista = {
        nome: nome,
        icone: icone,
        dataCriacao: data.toLocaleString('pt-BR').split(',')[0],
        tarefas: [],
        favoritado: false,
        importante: false
    }

    listasDB[nome] = novaLista;
    salvarListas();
    esconderMensagemSemListas();

    let inputNome = document.getElementById('inputNome');
    let iconeEscolhido = document.getElementById('iconeEscolhido');
    let opcoesIcones = document.getElementById('opcoesIcones');
    let criarBtn = document.getElementById('confirmarCriacao')

    setTimeout(resetarModal, 400);
}

function resetarModal() {
    let inputNome = document.getElementById('inputNome');
    let iconeEscolhido = document.getElementById('iconeEscolhido');
    let opcoesIcones = document.getElementById('opcoesIcones');
    let criarBtn = document.getElementById('confirmarCriacao')

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
    if (elemento == "menu") {
        let listasMenu = document.getElementById('listas');
        listasMenu.innerHTML = `            
        <li id="nenhumaLista">
                <i class="fa-solid fa-clock"></i>Nenhuma lista...
        </li>`
    } else if (elemento == "main") {
        let main = document.querySelector('main');

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
        } else {
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
    
    if (nenhumaListaMain) {
        nenhumaListaMain.remove();
    }
    
    if (nenhumaListaMenu) {
        nenhumaListaMenu.remove();
    }

    listasTitleMain.style.display = '';
}

function criarItemMenu(lista) {
    let listasMenu = document.getElementById('listas')
    let li = document.createElement('li');
    li.innerHTML = `
    <span class="nomeLista">
        <i class="fa-solid ${lista.icone} iconeLista"></i>
        <span>${lista.nome}</span>
    </span>
    <i class="fa-solid fa-angle-right abrir"></i>
    `
    li.classList.add('listaMenu');

    listasMenu.appendChild(li);
}

function criarItemMain(lista, index) {
let sectionEsquerda = document.getElementById('listasEsquerda');
    let sectionDireita = document.getElementById('listasDireita');

    let article = document.createElement('article');
    article.id = lista.nome;
    article.classList.add('lista');

    if (lista.favoritado) {
        article.classList.add('favoritada')
    }

    if (lista.importante) {
        article.classList.add('importante')
    }

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
        <i class="fa-solid fa-trash-can excluirLista"></i>
        <i class="fa-solid fa-pen-ruler editarLista"></i>
        <i data-marcado="${lista.importante}" class="fa-${lista.importante ? 'solid' : 'regular'} fa-bookmark listaFiltros ${lista.importante ? 'selecionado' : ''}"></i>
        <i data-marcado="${lista.favoritado}" class="fa-${lista.favoritado ? 'solid' : 'regular'} fa-star listaFiltros ${lista.favoritado ? 'selecionado' : ''}"></i>
    </div>
    `

    if (index % 2 == 0) {
        sectionEsquerda.appendChild(article);
    } else {
        sectionDireita.appendChild(article);
    }

}

function eventosIcones() {
    const iconesFiltros = document.getElementsByClassName('listaFiltros');
    Array.from(iconesFiltros).forEach(icone => {
        icone.addEventListener('click', () => {
            let listaPai = icone.closest('.lista');
            let nomeLista = listaPai.id;
            let isFavorito = icone.classList.contains('fa-star');
            let tipo = isFavorito ? 'favoritado' : 'importante';
            let classe = isFavorito ? 'favoritada' : 'importante';

            icone.classList.toggle('fa-regular');
            icone.classList.toggle('fa-solid');
            icone.classList.toggle('selecionado');

            listaPai.classList.toggle(classe);

            listasDB[nomeLista][tipo] = !listasDB[nomeLista][tipo];
            salvarListas();
        });
    });

    const excluirLista = document.getElementsByClassName('excluirLista');
    Array.from(excluirLista).forEach(icone => {
        icone.addEventListener('click', () => {
            let listaPai = icone.closest('.lista');
            delete listasDB[listaPai.id];
            salvarListas();
            renderizarListas();
        });
    });
} 

function selecionarFiltro(index) {
    renderizarListas();

    let filtrosBtn = document.getElementsByClassName('filtroBotao');
    let todasListas = document.querySelectorAll('.lista')
    let listaTitle = document.getElementById('listasTitleMain');
    let sectionEsquerda = document.getElementById('listasEsquerda');
    let sectionDireita = document.getElementById('listasDireita');

    Array.from(filtrosBtn).forEach(botao => {
        botao.classList.remove('selecionado')
    })
    filtrosBtn[index].classList.add('selecionado');

    sectionEsquerda.innerHTML = "";
    sectionDireita.innerHTML = "";

    let listasVisiveis = []

    switch(index) {
        case 0: // Todas as listas
            listasVisiveis = Array.from(todasListas);
            listaTitle.innerHTML = "Todas as <span>listas</span>";

            if (listasVisiveis.length == 0) {
                mostrarMensagemSemListas("main", "todas");
            } else {
                esconderMensagemSemListas();
            }
            break;
        case 1: // Favoritas
            listasVisiveis = Array.from(todasListas).filter(lista => lista.classList.contains('favoritada'));
            listaTitle.innerHTML = "Listas <span>favoritas</span>";

            if (listasVisiveis.length == 0) {
                mostrarMensagemSemListas("main", "favoritas");
            } else {
                esconderMensagemSemListas();
            }
            break;
        case 2: // Importantes
            listasVisiveis = Array.from(todasListas).filter(lista => lista.classList.contains('importante'));
            listaTitle.innerHTML = "Listas <span>importantes</span>";

            if (listasVisiveis.length == 0) {
                mostrarMensagemSemListas("main", "importante");
            } else {
                esconderMensagemSemListas();
            }
            break;
        default: // Padrão
            listasVisiveis = Array.from(todasListas);
            listaTitle.innerHTML = "Todas as <span>listas</span>";

            if (listasVisiveis.length == 0) {
                mostrarMensagemSemListas("main", "todas");
            } else {
                esconderMensagemSemListas();
            }
            break;
    }

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

const estadosUI = {
    listasAberto: true,
    menuAberto: true,
    modalAberto: false
}

function abrirModal() {
    let modal = document.getElementById('criarLista');
    let container = document.getElementById('container');
    let header = document.querySelector('header');

    modal.classList.toggle('ativo');
    container.style.filter = 'blur(2px)';
    header.style.filter = 'blur(2px)';

    estadosUI.modalAberto = true;
}

function fecharModal() {
    let modal = document.getElementById('criarLista');
    let container = document.getElementById('container');
    let header = document.querySelector('header');

    modal.classList.toggle('ativo');
    container.style.filter = '';
    header.style.filter = '';

    estadosUI.modalAberto = false;
}

function modal() {
    // Abrir modal
    let criarListaBtn = document.getElementById('adicionarBotao');
    criarListaBtn.addEventListener('click', abrirModal);

    // Fechar modal
    let modal = document.getElementById('criarLista');
    modal.addEventListener('click', (e) => {
        if (e.target.id == "criarLista") {
            fecharModal();
        }
    });

    let cancelarBtn = document.getElementById('cancelarCriacao');
    cancelarBtn.addEventListener('click', fecharModal);

    // Validação de criação
    let inputNome = document.getElementById('inputNome');
    let criarBtn = document.getElementById('confirmarCriacao');
    inputNome.addEventListener('keyup', () => {
        if (inputNome.value.trim() == "" || listasDB[inputNome.value]) {
            criarBtn.setAttribute('disabled', true);
        } else {
            criarBtn.removeAttribute('disabled');
        }
    });

    criarBtn.addEventListener('click', () => {
        let iconeEscolhido = document.getElementById('iconeEscolhido');
        let iconeSelecionado = iconeEscolhido.classList[1];
        
        const nomeLista = inputNome.value.trim();
        const iconeLista = iconeSelecionado;

        criarListas(nomeLista, iconeLista);
        renderizarListas();
        selecionarFiltro(0);
        fecharModal();  
    });
}

function escolherIcone() {
    let opcoesIcones = document.getElementById('opcoesIcones');
    let icones = opcoesIcones.children;
    let iconeEscolhido = document.getElementById('iconeEscolhido');
    
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
    const quantidadeAvanco = opcoesIcones.clientWidth * 0.2;

    if (opcoesIcones.scrollWidth < opcoesIcones.clientWidth) {
        avancarIcone.style.display = 'none';
        voltarIcone.style.display = 'none';

        return;
    }

    avancarIcone.addEventListener('click', () => {
        opcoesIcones.scrollBy({left: quantidadeAvanco, behavior: 'smooth'});
    });

    voltarIcone.addEventListener('click', () => {
        opcoesIcones.scrollBy({left: -quantidadeAvanco, behavior: 'smooth'});
    });
}

function menuLateral() {
    // Expandir/recolher listas
    let fecharListasIcon = document.getElementById('fecharListas');
    let listas = document.getElementById('listas')
 
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

        estadosUI.listasAberto = !estadosUI.listasAberto;
    })

    // Fechar/abrir menu lateral
    let menuIcon = document.getElementById('fecharMenu');
    let menu = document.getElementById('menu');
    let filhosMenu = menu.children;

    menuIcon.addEventListener('click', () => {
        if (estadosUI.menuAberto == true) {
            Array.from(filhosMenu).forEach(el => {
                el.style.width = menu.offsetWidth + 'px';
            });

            menu.style.width = '0px';
            menu.style.padding = '0px'
            menu.classList.replace('aberto', 'fechado');
        } else {
            menu.style.width = '';
            menu.style.padding = '';
            menu.classList.replace('fechado', 'aberto');

            setTimeout(() => {
                Array.from(filhosMenu).forEach(el => {
                    el.style.width = '';
                })
            }, 400);
        }

        estadosUI.menuAberto = !estadosUI.menuAberto;
    });
}

function verificarTema() {
    let switcherTema = document.getElementById('switch');
    let body = document.querySelector('body')
    
    switcherTema.addEventListener('change', () => {
        if (switcherTema.checked == true) {
            body.classList.replace('temaEscuro', 'temaClaro');
        } else {
            body.classList.replace('temaClaro', 'temaEscuro');
        }
    });

    if (switcherTema.checked == true) {
        body.classList.replace('temaEscuro', 'temaClaro');
    } else {
        body.classList.replace('temaClaro', 'temaEscuro');
    }
}

// ============================================
// 🚀 INICIALIZAÇÃO
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Interface
    escolherIcone();
    scrollIcones();
    menuLateral();
    modal();
    verificarTema();
    
    // Listas
    renderizarListas();
    selecionarFiltro(0);
})

document.addEventListener('keydown', (e) => {
    // Só reage se o modal estiver aberto
    if (!estadosUI.modalAberto) {return};

    const inputNome = document.getElementById('inputNome');

    // Fechar o modal quando clica ESC
    if (e.key === "Escape") {
        e.preventDefault();
        fecharModal();
        return;
    }

    // Criar lista quando clica ENTER (se for válido)
    if (e.key === "Enter") {
        e.preventDefault();

        const nomeLista = inputNome.value.trim();
        const iconeLista = document.getElementById('iconeEscolhido').classList[1];

        if (nomeLista !== "" && !listasDB[nomeLista]) {
            criarListas(nomeLista, iconeLista);
            renderizarListas();
            selecionarFiltro(0);
            fecharModal();
        }
    }
});