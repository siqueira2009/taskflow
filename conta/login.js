let userDB = JSON.parse(localStorage.getItem("usuario")) || {};



let escuroIcone = document.getElementById("temaEscuro");
let claroIcone = document.getElementById("temaClaro");

let body = document.querySelector("body");
let temaAtual = "escuro";

let botaoTema = document.getElementById("color-mode");
botaoTema.addEventListener("click", () => {
    if (temaAtual === "escuro") {
    
        claroIcone.style.display = "flex";
        escuroIcone.style.display = "none";

        body.classList.remove("temaEscuro");
        body.classList.add("temaClaro");
        temaAtual = "claro";

    }
    else {

        escuroIcone.style.display = "flex";
        claroIcone.style.display = "none"; 

        body.classList.remove("temaClaro");
        body.classList.add("temaEscuro");
        temaAtual = "escuro";

    }

    userDB = {
        tema : temaAtual
    }

    localStorage.setItem("usuario", JSON.stringify(userDB));

});

document.addEventListener("DOMContentLoaded", () => {
    if(userDB.tema === "claro") {

        claroIcone.style.display = "flex";
        escuroIcone.style.display = "none";

        body.classList.remove("temaEscuro");
        body.classList.add("temaClaro");
        temaAtual = "claro";

    }
    else {
        escuroIcone.style.display = "flex";
        claroIcone.style.display = "none";

        body.classList.remove("temaClaro");
        body.classList.add("temaEscuro");
        temaAtual = "escuro";
    }

});

let botaoLogin = document.getElementById('botao-login');

botaoLogin.addEventListener('click', () => {
    window.location.href = "../listas/listas.html"
})