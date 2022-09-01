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

let localUserQuizzIds = [10535];

let quizzTitle;
let quizzImgURL;
let quizzQuestionNum;
let quizzLevelNum;
let questionsArray = [];
let levelsArray = [];

// funcao para teste de URL (cria uma promessa que testa a URL e caso de erro retorna false, se der sucesso retorna true)
const isValidUrl = (urlInput) => {
    try {
        return Boolean(new URL(urlInput));
    } catch (e) {
        return false;
    }
};

// funcao para teste de #HEX (usa regex e test para retornar um boolean verdadeiro caso a string seja uma hex valida, e falso caso nao seja)
function isHex(color) {
    return (/#[0-9A-F]{6}/i.test(color));
}

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
            <div class="perguntaContainer" onclick="editPergunta(this)" id="pergunta${i + 1}">
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
    pergunta.removeAttribute("onclick");
    let perguntaNum = pergunta.getAttribute("id");
    perguntaNum = Number(perguntaNum.replace("pergunta", ""));
    pergunta.innerHTML =
        pergunta.innerHTML +
        `
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
        if (isHex(answerBackground) === false) {
            alert('voce nao inseriu uma cor HEX valida para o background (ex: #FFFFFF)')
            return
        }
        if (answerText.length < 21) {
            alert('sua pergunta deve ter pelo menos 20 caracteres!')
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
            ],
        };
        questionsArray.push(perguntaObj);
    }
    levelCreationDisplay();
    document.querySelector(".createQuestions").classList.add("hidden");
    document.querySelector(".createLevels").classList.remove("hidden");
}
// creates a display with the number of levels selected to edit
function levelCreationDisplay() {
    for (let i = 0; i < quizzLevelNum; i++) {
        const template = `<li>
            <div class="levelContainer" onclick="editLevel(this)" id="level${i + 1}">
                <div class="levelHeader">
                    <p>Nivel ${i + 1}</p>
                    <span class="material-symbols-outlined" id="pergunta${i}Button">
                        edit_square
                    </span>
                </div>
            </div>
        </li>`;
        document.querySelector(".createLevels ul").innerHTML =
            document.querySelector(".createLevels ul").innerHTML + template;
    }
}
function editLevel(level) {
    level.removeAttribute("onclick");
    let levelNum = level.getAttribute("id");
    levelNum = Number(levelNum.replace("pergunta", ""));
    level.innerHTML = level.innerHTML + `
    <div class="levelCreationSupport">
        <input id="input1Level${levelNum}" type="text" placeholder="Titulo do nivel" />
        <input id="input2Level${levelNum}" type="number" min="0" max="100" placeholder="% de acerto minima" />
        <input id="input3Level${levelNum}" type="url" placeholder="URL da imagem do nivel" />
        <input id="input4Level${levelNum}" type="text" placeholder="Descricao do nivel" />
    </div>
    `
}
/*
function validateLevelInputs() {
    for (let i = 0; i < quizzLevelNum; i++) {
        let levelTitle = document.querySelector(`#input1Level${i+1}`).value;
        let levelPercentage = document.querySelector(`#input2Level${i+1}`).value;
        let levelURL = document.querySelector(`#input3Level${i+1}`).value;
        let levelDescription = document.querySelector(`#input4Level${i+1}`).value;
        if (isValidUrl(levelURL) === false){
            alert(`Tem algo errado com sua URL!`);
            return
        }
        if (levelTitle.length < 11) {
            alert('O titulo do nivel precisa ter pelo menos 10 caracteres');
            return
        }
        if (levelDescription.length < 31) {
            alert('a descricao do nivel precisa ter pelo menos 30 caracteres');
        }
        const levelObj = {
            title: levelTitle,
            image: levelURL,
            text: levelDescription,
            minValue: levelPercentage
        }
        levelsArray.push(levelObj)
        console.log(levelsArray)
    }
    
}
*/
function editQuizz() {
    console.log("editou");
}
function deleteQuizz() {
    console.log("apagou");
}
function toggleVisibility(itemsToHide, itemsToShow) {
    itemsToHide.forEach((item) => {
        item.classList.add("hidden");
    });
    itemsToShow.forEach((item) => {
        item.classList.remove("hidden");
    });
}
function serverQuizzTemplate(title, image, id) {
    return `<div data-identifier="quizz-card" class="quizz" onclick="loadSelectedQuizz(${id})">
                <img src="${image}" alt="quizz_image">
                <p class="dsp_flex">${title}</p>
            </div>`;
}
function userQuizzTemplate(title, image, id) {
    return `<div data-identifier="quizz-card" class="quizz" onclick="loadSelectedQuizz(${id})">
                <img src="${image}" alt="quizz_image">
                <p class="dsp_flex">${title}</p> 
                <div class="editDelete_Card dsp_flex">
                    <span class="material-symbols-outlined"> edit_square </span>
                    <span class="material-symbols-outlined"> delete </span>
                </div>
            </div>`;
}
function renderQuizz(templateFunction, quizzContainer, quizz) {
    quizzContainer.innerHTML += templateFunction(quizz.title, quizz.image, quizz.id);
}
function handleQuizz(quizz) {
    let thisIsALocalQuizz = false;
    localUserQuizzIds.some((localUserQuizzId) => {
        if (localUserQuizzId === quizz.id) {
            renderQuizz(userQuizzTemplate, userQuizzContainer, quizz);
            thisIsALocalQuizz = true;
            return true;
        }
        return false;
    });
    if (!thisIsALocalQuizz) renderQuizz(serverQuizzTemplate, serverQuizzContainer, quizz);
}
function quizListLoad(promise) {
    console.log(promise.data);
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

// Question Page

const divQuestions = document.querySelector("section.answerQuizz");
let idQuizz;
let numberQuestions = 0;
let verifiedQuestions = 0;
let correctAnswers = 0;
let quizz;

// load selected quizz by ID.
function loadSelectedQuizz(id) {
    console.log(id);
    if (id !== null) {
        idQuizz = id;
    }
    toggleVisibility([quizzListSection], [cssLoader]);

    const getSelectedQuizz = axios.get(
        `https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${idQuizz}`
    );
    getSelectedQuizz.then(selectedQuizzLoad);
}

// adding on HTML quizz selected by ID.
function selectedQuizzLoad(promise) {
    console.log(promise.data);
    toggleVisibility([cssLoader], [divQuestions]);
    quizz = promise.data;
    numberQuestions = quizz.questions.length;

    // tittle
    const tittle = document.querySelector(".answerQuizz .tittle p");
    tittle.innerHTML = quizz.title;

    // img tittle
    const imgTittle = document.querySelector(".answerQuizz .tittle");
    imgTittle.style.background = `url('${quizz.image}')`;

    // questions
    const questions = quizz.questions;
    questions.forEach(templateQuestion);
}

// template question
function templateQuestion(question) {
    let allAnswers = "";
    question.answers.forEach((answer) => {
        allAnswers += `
        <div class="answer ${answer.isCorrectAnswer}" onClick="verifyAnswer(this)">
            <img
                src="${answer.image}"
            />
            <p>${answer.text}</p>
        </div>
    `;
    });

    const questionHTML = ` 
    <div class="card_quizz">
            <div style="background-color: ${question.color}" class="card_header dsp_flex">
                <p>${question.title}</p>
            </div>
            <div class="card_answers">
                ${allAnswers}
            </div>
    </div>
    `;

    divQuestions.innerHTML += questionHTML;
}

// verify answer

function verifyAnswer(answer) {
    answer.classList.add("clickChecked");

    // if answer is correct
    if (answer.classList.contains("true")) correctAnswers++;

    const card = answer.parentNode;
    const allAnswers = card.querySelectorAll(".answer");
    allAnswers.forEach((res) => {
        res.classList.add("checked");
        res.removeAttribute("onClick");
    });

    // scroll to next question
    const nextElement = card.parentNode.nextElementSibling;
    if (nextElement !== null) {
        setTimeout(() => {
            nextElement.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }, 2000);
    }

    verifiedQuestions++;
    if (verifiedQuestions === numberQuestions) {
        showResult();
    }
}

// show result
function showResult() {
    const level = verifyLevel();
    divQuestions.innerHTML += `
    <div class="card_result">
        <div class="card_header dsp_flex">
            <p>${level.title}</p>
        </div>
        <div class="card_content">
            <img
            src="${level.image}"
            />
            <p>
            ${level.text}
            </p>
        </div>
    </div>

    <div class="nav dsp_flex">
        <button onClick="reloadQuizz()" class="reset">Reniciar Quizz</button>
        <button onClick="loadHome()" class="home">Voltar pra home</button>
    </div>
    `;

    // scroll to result
    setTimeout(() => {
        divQuestions
            .querySelector(".card_result")
            .scrollIntoView({ behavior: "smooth", block: "center" });
    }, 2000);
}

function verifyLevel() {
    const percentageLevel = (correctAnswers / numberQuestions) * 100;
    let level;
    quizz.levels.forEach((lvl) => {
        if (percentageLevel > lvl.minValue) {
            level = lvl;
        }
    });

    return level;
}

function cleanQuizzPage() {
    verifiedQuestions = 0;
    correctAnswers = 0;
    divQuestions.innerHTML = `
  <div class="tittle">
    <div class="opacity dsp_flex">
        <p></p>
    </div>
  </div>
 `;
}

function reloadQuizz() {
    cleanQuizzPage();
    loadSelectedQuizz(null);
}

function loadHome() {
    cleanQuizzPage();
    toggleVisibility([divQuestions], [cssLoader]);
    startWebsite();
}
