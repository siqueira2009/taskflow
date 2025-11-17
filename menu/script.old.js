// Funções globais

function toggleClasses(el, remove, add) {
    if (remove) el.classList.remove(remove);
    if (add) el.classList.add(add);
}

function toggleIcon(el, cheio) {
    const regular = 'fa-regular'
    const solid = 'fa-solid'
    el.classList.replace(cheio ? regular : solid, cheio ? solid : regular)
    el.classList.toggle('selecionado', cheio);
}

function criarElemento(tag, html = '') {
    const elemento = document.createElement(tag);
    if (html) el.innerHTML = html

    return el;
}

function distribuirSections(items) {
    const sectionEsquerda = document.getElementById('sectionEsquerda')
    const sectionDireita = document.getElementById('sectionDireita');

    items.forEach((el, index) => {
        if (index % 2 == 0) {
            sectionEsquerda.appendChild(el);
        } else {
            sectionDireita.appendChild(el);
        }
    })
}

function display(el, estado = 'block') {
    el.style.display = estado;
}

function alterarSemListas(texto, listas) {
    let main = document.querySelector('main')
    const semListasMain = document.createElement('div');
    semListasMain.id = 'nenhumaListaMain'
    semListasMain.innerHTML = 
    `
        <img src="">
        <h1></h1>
    `

    if (listas.length == 0) {
            if (main.children.length == 2) {
                main.appendChild(semListasMain);
            }
            let listaTitle = document.getElementById('listasTitleMain');
        
            listaTitle.style.display = 'none';
            var nenhumaListaMain = document.getElementById('nenhumaListaMain');
            nenhumaListaMain.children[0].src = '../imgs/SVGs/Vazio.svg'
            nenhumaListaMain.children[1].innerHTML = texto
    }   
}

// Função de seleção de filtros
function selecionarFiltro(index) {
    renderizarListas();

    let filtrosBtns = document.getElementsByClassName('filtroBotao');
    let todasListas = document.querySelectorAll('.lista');
    let listaTitle = document.getElementById('listasTitleMain');
    let sectionEsquerda = document.getElementById('listasEsquerda');
    let sectionDireita = document.getElementById('listasDireita');

    Array.from(filtrosBtns).forEach(el => {
        el.classList.remove('selecionado');
    });

    filtrosBtns[index].classList.add('selecionado');

    sectionDireita.innerHTML = "";
    sectionEsquerda.innerHTML = "";

    let listasVisiveis = [];

    switch (index) {        
        case 0:
            listasVisiveis = Array.from(todasListas);
            listaTitle.innerHTML = 'Todas as <span>listas</span>';

            alterarSemListas('Ainda <span>não há</span> nenhuma lista...', listasVisiveis)
            break;
        case 1:
            listasVisiveis = Array.from(todasListas).filter(el => el.classList.contains('favoritada'));
            listaTitle.innerHTML = 'Listas <span>favoritas</span>';

            alterarSemListas('<span>Nenhuma</span> lista favorita', listasVisiveis)
            break;
        case 2:
            listasVisiveis = Array.from(todasListas).filter(el => el.classList.contains('importante'));
            listaTitle.innerHTML = 'Listas <span>importantes</span>';

            alterarSemListas('<span>Nenhuma</span> lista importante', listasVisiveis)
            break;
        default:
            listasVisiveis = Array.from(todasListas);
            listaTitle.innerHTML = 'Todas as <span>listas</span>';

            alterarSemListas('Ainda <span>não há</span> nenhuma lista...', listasVisiveis)
            break;
    }

    listasVisiveis.forEach((el, index) => {
        if (index % 2 == 0) {
            sectionEsquerda.appendChild(el);
        } else {
            sectionDireita.appendChild(el);
        }
    });
}

// Fechar listas
let fecharListas = document.getElementById('fecharListas');
let listas = document.getElementById('listas')
let listasAberto = true;

fecharListas.addEventListener('click', () => {
    if (listasAberto) {
        fecharListas.style.rotate = '180deg';
        listas.style.height = '0px';
        listas.style.padding = '0';
        Array.from(listas.children).forEach (el => {
            el.style.display = 'none';
        });
    } else {
        fecharListas.style.rotate = '';
        listas.style.height = '';
        listas.style.padding = '';
        Array.from(listas.children).forEach (el => {
            el.style.display = '';
        });
    }

    listasAberto = !listasAberto;
})

// Fechar menu

let menuIcon = document.getElementById('fecharMenu');
let menu = document.querySelector('aside');
let menuAberto = true;

menuIcon.addEventListener('click', () => {
    if (menuAberto) {
        Array.from(menu.children).forEach(el => {
            el.style.width = menu.offsetWidth + 'px';
        });

        menu.style.width = '0px';
        menu.classList.replace('aberto', 'fechado');
    } else {
        menu.style.width = '';
    
        setTimeout(() => {
            Array.from(menu.children).forEach(el => {
                el.style.width = '';
            });
        }, 400);

        menu.classList.replace('fechado', 'aberto');
    }

    menuAberto = !menuAberto;
})

// Trocar tema

let switcherTema = document.getElementById('switch');
let body = document.querySelector('body')

switcherTema.addEventListener('change', () => {
    if (switcherTema.checked) {
        body.classList.replace('temaEscuro', 'temaClaro')
    } else {
        body.classList.replace('temaClaro', 'temaEscuro')
    }
})

// Animação hover das listas 

let listasCards = document.getElementsByClassName('lista');

Array.from(listasCards).forEach(el => {

    el.addEventListener('mouseenter', () => {
        el.children[1].children[0].style.transition = 'margin-right 0.3s';
        el.children[1].children[0].style.marginRight = '30px';

        setTimeout(() => {
            el.children[1].children[0].style.marginRight = '-10px';
        }, 400);

        setTimeout(() => {
            el.children[1].children[0].style.marginRight = '0px';
        }, 800);
    })
});

// Abrir modal de criar lista

let botaoModal = document.getElementById('adicionarBotao');
let modal = document.getElementById('criarLista');
let container = document.getElementById('container');
let header = document.querySelector('header')
let modalAberto = false;
let cancelarBtn = document.getElementById('cancelarCriacao');

botaoModal.addEventListener('click', () => {
    modal.classList.add('ativo');
    
    if (!modalAberto) {
        container.style.filter = 'blur(2px)';
        header.style.filter = 'blur(2px)';
    }
    
    modal.addEventListener('click', (event) => {
        if (event.target.id == 'criarLista') {
            modal.classList.remove('ativo');
            container.style.filter = 'blur(0px)';
            header.style.filter = 'blur(0px)';
        }
    })
});

cancelarBtn.addEventListener('click', () => {
    modal.classList.remove('ativo');
    container.style.filter = 'blur(0px)';
    header.style.filter = 'blur(0px)';
})

// Scrollar ícones

let avancar = document.getElementById('avancarIcones');
let voltar = document.getElementById('voltarIcones');
let opcoesIcones = document.getElementById('opcoesIcones');
let qntdAvanco = opcoesIcones.clientWidth * (0.2)

if (opcoesIcones.scrollWidth < opcoesIcones.clientWidth) {
    avancar.style.display = 'none'
    voltar.style.display = 'none'
}

avancar.addEventListener('click', () => {
    opcoesIcones.scrollBy({
        left: qntdAvanco,
        behavior: 'smooth'
    });
})

voltar.addEventListener('click', () => {
    opcoesIcones.scrollBy({
        left: -qntdAvanco,
        behavior: 'smooth'
    });
})


// Escolher ícone

let icones = opcoesIcones.children;
let iconeEscolhido = document.getElementById('iconeEscolhido')

Array.from(icones).forEach(el => {
    el.addEventListener('click', () => {

        Array.from(icones).forEach(el => {
            el.classList.remove('iconeSelecionado');
        })


        iconeEscolhido.classList.replace(iconeEscolhido.classList[1], el.classList[1]);
        el.classList.add('iconeSelecionado');
    })
})

// Criar lista

let criarBtn = document.getElementById('confirmarCriacao');
let inputNome = document.getElementById('inputNome');

inputNome.addEventListener('keyup', () => {
    if (inputNome.value == "") {
        criarBtn.setAttribute('disabled', true);
    } else {
        criarBtn.removeAttribute('disabled');
    }
});

let listasDB = JSON.parse(localStorage.getItem('listas')) || {}; // Cria um novo local storage

function salvarListas() {
    localStorage.setItem('listas', JSON.stringify(listasDB)); // Salva todas as novas listas no navegador
}

function renderizarListas() {
    const semListasMenu = document.createElement('li');
    semListasMenu.id = 'nenhumaLista';
    semListasMenu.innerHTML = 
    `
        <i class="fa-solid fa-clock"></i>Nenhuma lista...
    `

    let sectionEsquerda = document.getElementById('listasEsquerda');
    let sectionDireita = document.getElementById('listasDireita');
    let main = document.querySelector('main');
    let listasMenu = document.getElementById('listas');
    let listasTitle = document.getElementById('listasTitleMain');
    listas.innerHTML = "";
    sectionEsquerda.innerHTML = "";
    sectionDireita.innerHTML = "";

    let keys = Object.keys(listasDB); // Pega todas as listas existentes

    if (keys.length == 0) { // Se não existir nenhuma lista, aparece mensagem estilizada
        listasMenu.appendChild(semListasMenu);

        listas.style.minHeight = 'auto';
        sectionDireita.style.padding = '0px';
        sectionEsquerda.style.padding = '0px';
        listasTitle.style.display = 'none';
        return;
    } else {
        let semListasMain = document.getElementById('nenhumaListaMain');
        
        if (semListasMain) {
            semListasMain.remove()
        }
        
        
        listasTitle.style.display = '';
        listas.style.minHeight = '';
        sectionDireita.style.padding = '';
        sectionEsquerda.style.padding = '';
    }

    // RENDERIZAR LISTA DO MENU/MAIN

    keys.forEach((key, index) => { // Para cada chave, cria um novo item da lista e cards
        const listaAtual = listasDB[key];
        let novoLi = document.createElement('li');

        novoLi.innerHTML = `<span id="nomeLista"><i class="fa-solid ${listaAtual.icone} iconeLista"></i>${listaAtual.nome}</span><i class="fa-solid fa-angle-right abrir"></i>`
        
        listas.appendChild(novoLi);

        let novoArticle = document.createElement('article');
        novoArticle.classList.add("lista");
        novoArticle.id = listaAtual.nome;

        novoArticle.innerHTML = 
            `<div class="esquerda">
                <h1 class="listaTitle"><i class="fa-solid ${listaAtual.icone} listaIcon"></i>${listaAtual.nome}</h1>
                <h4 class="listaInfo"><span class="atualizacao">criada em ${listaAtual.dataCriacao}</span> • <span class="itens">${listaAtual.tarefas.length} itens</span></h4>
            </div>

            <div class="direita">
                <i style="margin-right: 5px" class="fa-solid fa-trash excluirLista"></i>
                <i data-marcado="${listaAtual.importante}" style="margin-right: 5px" class="fa-regular fa-bookmark listaFiltros"></i>
                <i data-marcado="${listaAtual.favoritado}" class="fa-regular fa-star listaFiltros"></i>
                <i class="fa-solid fa-angle-right listaOpen"></i>
            </div>`

        if (index % 2 != 0) {
            sectionDireita.appendChild(novoArticle);
        } else if (index % 2 == 0) {
            sectionEsquerda.appendChild(novoArticle);
        }

        // Ícones de filtro (favorito e importante)
        
        let iconesFiltrosDaLista = novoArticle.getElementsByClassName('listaFiltros');

        if (listaAtual.favoritado == true) {
            iconesFiltrosDaLista[1].classList.replace('fa-regular', 'fa-solid');
            iconesFiltrosDaLista[1].classList.add('selecionado');
            
            novoArticle.classList.add('favoritada');
        }
        
        if (listaAtual.importante == true) {
            iconesFiltrosDaLista[0].classList.replace('fa-regular', 'fa-solid');
            iconesFiltrosDaLista[0].classList.add('selecionado');

            novoArticle.classList.add('importante');
        }
    })

    // Favoritar/importante
    let iconesFiltros = document.getElementsByClassName('listaFiltros');

    Array.from(iconesFiltros).forEach(el => {
        el.addEventListener('click', () => {
            let listaPai = el.parentElement.parentElement;
            let nomeDaLista = listaPai.id;

            if (el.classList[1] == 'fa-bookmark') {
                if (listasDB[nomeDaLista].importante == false) { // Favorita
                    el.classList.replace('fa-regular', 'fa-solid');
                    el.classList.add('selecionado');

                    listaPai.classList.add('importante');
                } else { // Desfavorita
                    el.classList.replace('fa-solid', 'fa-regular');
                    el.classList.remove('selecionado');

                    listaPai.classList.remove('importante');
                }
                
                listasDB[nomeDaLista].importante = !listasDB[nomeDaLista].importante;
            } else {
                if (listasDB[nomeDaLista].favoritado == false) {
                    el.classList.replace('fa-regular', 'fa-solid');
                    el.classList.add('selecionado');

                    listaPai.classList.add('favoritada');
                } else {
                    el.classList.replace('fa-solid', 'fa-regular');
                    el.classList.remove('selecionado');

                    listaPai.classList.remove('favoritada');
                }

                listasDB[nomeDaLista].favoritado = !listasDB[nomeDaLista].favoritado;
            }

            salvarListas();
        })
    })

    // Excluir listas

    let deletarListaBtn = document.getElementsByClassName('excluirLista');
    
    Array.from(deletarListaBtn).forEach(el => {
        el.addEventListener('click', () => {
            let lista = el.parentElement.parentElement;
            let listaNome = lista.id;
            let sectionDaLista = lista.parentElement;
            sectionDaLista.removeChild(lista);

            delete listasDB[listaNome];
            
            selecionarFiltro(0);
            salvarListas();
            renderizarListas();
        })
    })
}

criarBtn.addEventListener('click', () => {
    let nome = inputNome.value.trim();
    let icone = iconeEscolhido.classList[1];
    let data = new Date();

    if (listasDB[nome]) { // Se já houver lista com o nome escolhido, aparece erro
        window.alert("Já existe uma lista com este nome!");
        return;
    }

    let novaLista = { // Cria um novo objeto, com nome, ícone e data de criação
        nome,
        icone,
        dataCriacao: data.toLocaleString('pt-BR').split(',')[0],
        tarefas: [],
        favoritado: false,
        importante: false
    }

    listasDB[nome] = novaLista; // Coloca o objeto numa nova key
    salvarListas(); // Salva as listas novas no navegador

    renderizarListas(); // Renderiza todas as listas

    // Fecha e reseta o modal
    modal.classList.remove('ativo');
    container.style.filter = 'blur(0px)';
    header.style.filter = 'blur(0px)';
    inputNome.value = '';
    criarBtn.setAttribute('disabled', true)
})

// Função que roda assim que a página carrega

document.addEventListener('DOMContentLoaded', () => {
    let switcherTema = document.getElementById('switch');

    if (switcherTema.checked) {
        body.classList.replace('temaEscuro', 'temaClaro')
    } else {
        body.classList.replace('temaClaro', 'temaEscuro')
    }

    renderizarListas();
    selecionarFiltro(0);
})