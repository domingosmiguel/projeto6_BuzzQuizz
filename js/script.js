const cssLoader = document.querySelector("div.loader");
const quizzListSection = document.querySelector("section.quizzList");
const createQuizSection = document.querySelector("section.createQuiz");
const emptyUserQuizzContainer = document.querySelector(
  "section.quizzList div.own_quizz_empty"
);
const userQuizzTitle = document.querySelector(
  "section.quizzList div.quizz_title:first-of-type"
);
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

function questionCreationDisplay() {
  for (let i = 0; i < quizzQuestionNum; i++) {
    const template = `<li>
            <div class="perguntaContainer">
                <p>Pergunta ${i + 1}</p>
                <span class="material-symbols-outlined" id="pergunta${i}Button" onclick="editPergunta()">
                    edit_square
                </span>
            </div>
        </li>`;
    document.querySelector(".createQuestions ul").innerHTML =
      document.querySelector(".createQuestions ul").innerHTML + template;
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
    toggleVisibility(
      [emptyUserQuizzContainer],
      [userQuizzTitle, userQuizzContainer]
    );
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
  const getQuizzes = axios.get(
    "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes"
  );
  getQuizzes.then(quizListLoad);
}
startWebsite();

// Question Page

let divQuestions = document.querySelector(".answerQuizz");
let numberQuestions = 0;
let verifiedQuestions = 0;
let correctAnswers = 0;
let quizz;

// load selected quizz by ID.
function loadSelectedQuizz() {
  const getSelectedQuizz = axios.get(
    "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/1"
  );
  getSelectedQuizz.then(selectedQuizzLoad);
}

// adding on HTML quizz selected by ID.
function selectedQuizzLoad(promise) {
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
        <button class="home">Voltar pra home</button>
    </div>
    `;

  // scroll to result
  divQuestions.querySelector(".card_result").scrollIntoView();
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

function reloadQuizz() {
  divQuestions.innerHTML = `
  <div class="tittle">
    <div class="opacity dsp_flex">
        <p></p>
    </div>
  </div>
 `;
  loadSelectedQuizz();
}

function loadHome() {}

loadSelectedQuizz();
