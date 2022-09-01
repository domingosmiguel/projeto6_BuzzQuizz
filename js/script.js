const cssLoader = document.querySelector("div.loader");
const quizzListSection = document.querySelector("section.quizzList");
const createQuizSection = document.querySelector("section.createQuiz");
const emptyUserQuizzContainer = document.querySelector("section.quizzList div.own_quizz_empty");
const userQuizzTitle = document.querySelector("section.quizzList div.quizz_title:first-of-type");
const userQuizzContainer = document.querySelector(
    "section.quizzList div.quizz_container:not(:last-of-type)"
);
const serverQuizzContainer = document.querySelector(
    "section.quizzList div.quizz_container:last-of-type"
);

let localUserQuizzIds = [];

let quizzTitle;
let quizzImgURL;
let quizzQuestionNum;
let quizzLevelNum;
let questionsArray = [];

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
        questionCreationDisplay();
        document.querySelector(".createQuizBasic").classList.add("hidden");
        document.querySelector(".createQuestions").classList.remove("hidden");
    }
}
// creates a display with the number of questions selected to edit
function questionCreationDisplay() {
    for (let i = 0; i < quizzQuestionNum; i++) {
        const template = `<li>
            <div class="perguntaContainer" onclick="editPergunta(this)" id="pergunta${i+1}">
                <div class="perguntaHeader">
                    <p>Pergunta ${i + 1}</p>
                    <span class="material-symbols-outlined" id="pergunta${i}Button">
                        edit_square
                    </span>
                </div>
            </div>
        </li>`;
        document.querySelector(".createQuestions ul").innerHTML =
            document.querySelector(".createQuestions ul").innerHTML + template;
    }
}
// changes question innerHTML to inputs
function editPergunta(pergunta) {
    pergunta.removeAttribute('onclick');
    let perguntaNum = pergunta.getAttribute('id');
    perguntaNum = Number(perguntaNum.replace('pergunta',''))
        pergunta.innerHTML = pergunta.innerHTML + `
   <div class="answerCreationSupport">
        <div class="answerMain">
            <input id="questionText${perguntaNum}" type="text" placeholder="Texto da pergunta" />
            <input id="questionBackground${perguntaNum}" type="text" placeholder="Cor de fundo da pergunta" />
        </div>
    <p>Resposta correta</p>
        <div class="correctAnswer">
            <input id="answerQuestionCorret${perguntaNum}" type="text" placeholder="Resposta correta" />
            <input id="answerCorrectBackground${perguntaNum}" type="url" placeholder="URL da imagem" /> 
        </div>
    <p>Respostas incorretas</p>
        <div class="incorrectAnswer">
            <input class="answerIncorret" id="incorrectAns1${perguntaNum}" type="text" placeholder="Resposta incorreta 1" />
            <input class="answerIncorretBackground" id="incorrectAnsBg1${perguntaNum}" type="url" placeholder="URL da imagem" /> 
        </div>
        <div class="incorrectAnswer">
            <input class="answerIncorret" id="incorrectAns2${perguntaNum}" type="text" placeholder="Resposta incorreta 2" />
            <input class="answerIncorretBackground" id="incorrectAnsBg2${perguntaNum}" type="url" placeholder="URL da imagem" /> 
        </div>
        <div class="incorrectAnswer">
            <input class="answerIncorret" id="incorrectAns3${perguntaNum}" type="text" placeholder="Resposta incorreta 3" />
            <input class="answerIncorretBackground" id="incorrectAnsBg3${perguntaNum}" type="url" placeholder="URL da imagem" /> 
        </div>
    </div>
    `   
}
// validate inputs and creates questions object
function validateAnswerInputs() {
    for (let i = 0; i < quizzQuestionNum; i++) {
        let answerText = document.querySelector(`#questionText${i+1}`).value;
        let answerBackground = document.querySelector(`#questionBackground${i+1}`).value;
        let answerCorrect = document.querySelector(`#answerQuestionCorret${i+1}`).value;
        let answerCorrectBackgroud = document.querySelector(`#answerCorrectBackground${i+1}`).value;
        let answerIncorrect1 = document.querySelector(`#incorrectAns1${i+1}`).value; 
        let answerIncorrect2 = document.querySelector(`#incorrectAns2${i+1}`).value; 
        let answerIncorrect3 = document.querySelector(`#incorrectAns3${i+1}`).value; 
        let answerIncorrect1Background = document.querySelector(`#incorrectAnsBg1${i+1}`).value;
        let answerIncorrect2Background = document.querySelector(`#incorrectAnsBg2${i+1}`).value;
        let answerIncorrect3Background = document.querySelector(`#incorrectAnsBg3${i+1}`).value;
        if (isValidUrl(answerCorrectBackgroud) === false || isValidUrl(answerIncorrect1Background) === false  || isValidUrl(answerIncorrect2Background) === false  
        || isValidUrl(answerIncorrect3Background) === false){
        alert('alguma de suas URLs estao com problema!');
        return
        } 
        if (answerText == "" || answerCorrect == "" || answerIncorrect1 == "" || answerIncorrect2 == "" || answerIncorrect3 == "") {
        alert('favor preencher corretamente')
        return
        }
        const perguntaObj = {
            title: answerText,
            color: answerBackground,
            answers: [
                {
                    text: answerCorrect,
                    image: answerCorrectBackgroud,
                    isCorrectAnswer: true,
                },
                {
                    text: answerIncorrect1,
                    image: answerIncorrect1Background,
                    isCorrectAnswer: false,
                },
                {
                    text: answerIncorrect2,
                    image: answerIncorrect2Background,
                    isCorrectAnswer: false,
                },
                {
                    text: answerIncorrect3,
                    image: answerIncorrect3Background,
                    isCorrectAnswer: false,
                },
            ]
        }
        questionsArray.push(perguntaObj);
    }
    document.querySelector(".createQuestions").classList.add('hidden');
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
    let thisIsALocalQuizz = false;
    localUserQuizzIds.some((localUserQuizzId) => {
        if (localUserQuizzId === quizz.id) {
            renderQuizz(userQuizzContainer, quizz);
            thisIsALocalQuizz = true;
            return true;
        }
        return false;
    });
    if (!thisIsALocalQuizz) renderQuizz(serverQuizzContainer, quizz);
}
function quizListLoad(promise) {
    toggleVisibility([cssLoader], [quizzListSection]);
    const quizzes = promise.data;
    quizzes.forEach((quizz) => {
        handleQuizz(quizz);
    });
    if (localUserQuizzIds.length !== 0) {
        toggleVisibility([emptyUserQuizzContainer], [userQuizzTitle, userQuizzContainer]);
    }
}
function createQuizzButtonListenersSetup() {
    document.querySelectorAll(".create_quizz").forEach((button) => {
        button.addEventListener("click", () => {
            toggleVisibility([quizzListSection], [createQuizSection]);
        });
    });
}
function startWebsite() {
    createQuizzButtonListenersSetup();
    const getQuizzes = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");
    getQuizzes.then(quizListLoad);
}
startWebsite();
