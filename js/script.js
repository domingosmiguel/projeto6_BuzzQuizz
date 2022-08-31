let localUserQuizzIds = [];

let quizzTitle;
let quizzImgURL;
let quizzQuestionNum;
let quizzLevelNum;

// funcao para teste de URL (cria uma promessa que testa a URL e caso de erro retorna false, se der sucesso retorna true)
const isValidUrl = (urlInput) => {
    try {
        return Boolean(new URL(urlInput));
    } catch (e) {
        return false;
    }
};

//funcao que testa os valores inseridos e atribui os valores as variaveis globais que vao ser usadas para criar o objeto para enviar
// para a API e criar o Quizz
function prosseguirParaPerguntas() {
    quizzTitle = document.querySelector("#quizzNameInput").value;
    quizzImgURL = document.querySelector("#quizzImgURLInput").value;
    quizzQuestionNum = document.querySelector("#quizzQuestionNumInput").value;
    quizzLevelNum = document.querySelector("#quizzLevelNumInput").value;

    if (quizzTitle.length > 65 || quizzTitle.length < 20) {
        alert("insira um titulo entre 25 e 60 caracteres e clique novamente!");
    } else if (
        quizzImgURL == "" ||
        quizzQuestionNum == "" ||
        quizzLevelNum == "" ||
        isValidUrl(quizzImgURL) === false
    ) {
        alert("voce nao preencheu corretamente, preencha e clique novamente!");
    } else {
        document.querySelector(".createQuizBasic").classList.add("hidden");
        // qualquer acao que interfira no codigo inteiro deve ser feita aqui
    }
}
function toggleVisibility(itemsToHide, itemsToShow) {
    itemsToHide.forEach((item) => {
        item.classList.add("hidden");
    });
    itemsToShow.forEach((item) => {
        item.classList.remove("hidden");
    });
}
function quizzTemplate(title, image) {
    return `<div data-identifier="quizz-card" class="quizz">
                <img src="${image}" alt="quizz_image">
                <p class="dsp_flex">${title}</p>
            </div>`;
}
function renderQuizz(quizzContainer, quizz) {
    quizzContainer.innerHTML += quizzTemplate(quizz.title, quizz.image);
}
function handleQuizz(quizz) {
    const serverQuizzContainer = document.querySelector("div.quizz_container:last-of-type");
    const locarQuizzContainer = document.querySelector("div.quizz_container:not(:last-of-type)");
    let thisIsALocalQuizz = false;
    localUserQuizzIds.some((localUserQuizzId) => {
        if (localUserQuizzId === quizz.id) {
            renderQuizz(locarQuizzContainer, quizz);
            thisIsALocalQuizz = true;
            return true;
        }
        return false;
    });
    if (!thisIsALocalQuizz) renderQuizz(serverQuizzContainer, quizz);
}
function quizListLoad(promise) {
    const quizzes = promise.data;
    quizzes.forEach((quizz) => {
        handleQuizz(quizz);
    });
    if (localUserQuizzIds.length !== 0) {
        const hideThis = document.querySelector("div.own_quizz_empty").classList.toggle("hidden");
        const showThis_one = document
            .querySelector("div.quizz_title:first-of-type")
            .classList.toggle("hidden");
        const showThis_two = document
            .querySelector("div.quizz_container:not(:last-of-type)")
            .classList.toggle("hidden");
        toggleVisibility(hideThis, [showThis_one, showThis_two]);
    }
}
function startWebsite() {
    const getQuizzes = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");
    getQuizzes.then(quizListLoad);
}
startWebsite();
