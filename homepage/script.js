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