const localUserQuizzIds = [];

function toggleVisibility() {
    document.querySelector("div.own_quizz_empty").classList.toggle("hidden");
    document.querySelector("div.quizz_title:first-of-type").classList.toggle("hidden");
    document.querySelector("div.quizz_container:not(:last-of-type)").classList.toggle("hidden");
}
function quizzTemplate(title, image) {
    return `<div class="quizz">
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
    console.log(quizzes);
    quizzes.forEach((quizz) => {
        handleQuizz(quizz);
    });
    if (localUserQuizzIds.length !== 0) toggleVisibility();
}
function startWebsite() {
    const getQuizzes = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");
    getQuizzes.then(quizListLoad);
}
startWebsite();
