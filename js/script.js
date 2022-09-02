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
const finishQuizzPage = document.querySelector("div.finishQuiz");

let localUserQuizzIdsAndKeys = [[], []];
let quizzTitle;
let quizzImgURL;
let quizzQuestionNum;
let quizzLevelNum;
let questionsArray = [];
let levelsArray = [];
let newQuizzID;
let indexToDelete;
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
  return /#[0-9A-F]{6}/i.test(color);
}

//funcao que testa os valores inseridos e atribui os valores as variaveis globais que vao ser usadas para criar o objeto para enviar
// para a API e criar o Quizz
function prosseguirParaPerguntas() {
  quizzTitle = document.querySelector("#quizzNameInput").value;
  quizzImgURL = document.querySelector("#quizzImgURLInput").value;
  quizzQuestionNum = document.querySelector("#quizzQuestionNumInput").value;
  quizzLevelNum = document.querySelector("#quizzLevelNumInput").value;

  const isValidTittle = verifyTittle(quizzTitle);
  const isValidURL = verifyURL(quizzImgURL);
  const isValidQuestionNum = verifyQuestionsNumber(quizzQuestionNum);
  const isValidLevelNum = verifyLevelsNumber(quizzLevelNum);

  if (isValidTittle && isValidURL && isValidQuestionNum && isValidLevelNum) {
    questionCreationDisplay();
    document.querySelector(".createQuizBasic").classList.add("hidden");
    document.querySelector(".createQuestions").classList.remove("hidden");

    document.querySelector("#quizzNameInput").value = "";
    document.querySelector("#quizzImgURLInput").value = "";
    document.querySelector("#quizzQuestionNumInput").value = "";
    document.querySelector("#quizzLevelNumInput").value = "";
  }
}

// function check tittle
function verifyTittle(tittle) {
  const inputTittle = document.querySelector("#quizzNameInput");
  const tittleLabel = document.querySelector("#quizzNameLabel");

  if (tittle.length > 65 || tittle.length < 20) {
    tittleLabel.classList.remove("hidden");
    inputTittle.classList.add("validationInput");
    return false;
  } else {
    tittleLabel.classList.add("hidden");
    inputTittle.classList.remove("validationInput");
  }

  return true;
}

// function check url
function verifyURL(URL) {
  const inputURL = document.querySelector("#quizzImgURLInput");
  const urlLabel = document.querySelector("#quizzURLLabel");

  if (isValidUrl(URL) === false) {
    urlLabel.classList.remove("hidden");
    inputURL.classList.add("validationInput");
    return false;
  } else {
    urlLabel.classList.add("hidden");
    inputURL.classList.remove("validationInput");
  }
  return true;
}

// function check number of questions
function verifyQuestionsNumber(number) {
  const inputQuestionNum = document.querySelector("#quizzQuestionNumInput");
  const questionNumLabel = document.querySelector("#quizzQuestionNumLabel");

  if (number < 3) {
    questionNumLabel.classList.remove("hidden");
    inputQuestionNum.classList.add("validationInput");
    return false;
  } else {
    questionNumLabel.classList.add("hidden");
    inputQuestionNum.classList.remove("validationInput");
  }
  return true;
}

// function check number of levels
function verifyLevelsNumber(number) {
  const inputLevelNum = document.querySelector("#quizzLevelNumInput");
  const levelNumLabel = document.querySelector("#quizzLevelNumLabel");

  if (number < 2) {
    levelNumLabel.classList.remove("hidden");
    inputLevelNum.classList.add("validationInput");
    return false;
  } else {
    levelNumLabel.classList.add("hidden");
    inputLevelNum.classList.remove("validationInput");
  }

  return true;
}

// creates a display with the number of questions selected to edit
function questionCreationDisplay() {
  for (let i = 1; i <= quizzQuestionNum; i++) {
    const template = `<li>
            <div class="perguntaContainer" onclick="editPergunta(this)" id="pergunta${i}">
                <div class="perguntaHeader">
                    <p>Pergunta ${i}</p>
                    <span class="material-symbols-outlined" id="pergunta${i}Button">
                        edit_square
                    </span>
                </div>
            </div>
        </li>`;
    document.querySelector(".createQuestions ul").innerHTML += template;
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
            <p class="validationLabel hidden" id="questionTextLabel${perguntaNum}">O texto da pergunta deve ter no mínimo 20 caracteres</p>
            <input id="questionBackground${perguntaNum}" type="text" placeholder="Cor de fundo da pergunta" />
            <p class="validationLabel hidden" id="questionBackgroundLabel${perguntaNum}">A cor da pergunta deve ser uma cor em hexadecimal</p>
        </div>
    <p>Resposta correta</p>
        <div class="correctAnswer">
            <input id="answerQuestionCorrect${perguntaNum}" type="text" placeholder="Resposta correta" />
            <p class="validationLabel hidden" id="answerQuestionCorrectLabel${perguntaNum}">O texto da resposta não pode ser vazio</p>
            <input id="answerCorrectBackground${perguntaNum}" type="url" placeholder="URL da imagem" /> 
            <p class="validationLabel hidden" id="answerCorrectBackgroundLabel${perguntaNum}">Formato da URL inválido</p>
        </div>
    <p>Respostas incorretas</p>
        <div class="incorrectAnswer">
            <input class="answerIncorrect" id="incorrectAns1${perguntaNum}" type="text" placeholder="Resposta incorreta 1" />
            <p class="validationLabel hidden" id="answerIncorrectLabel1${perguntaNum}">O texto da resposta não pode ser vazio</p>
            <input class="answerIncorrectBackground" id="incorrectAnsBg1${perguntaNum}" type="url" placeholder="URL da imagem" /> 
            <p class="validationLabel hidden" id="incorrectAnsBgLabel1${perguntaNum}">Formato da URL inválido</p>
        </div>
        <div class="incorrectAnswer">
            <input class="answerIncorrect" id="incorrectAns2${perguntaNum}" type="text" placeholder="Resposta incorreta 2" />
            <p class="validationLabel hidden" id="answerIncorrectLabel2${perguntaNum}">O texto da resposta não pode ser vazio</p>
            <input class="answerIncorrectBackground" id="incorrectAnsBg2${perguntaNum}" type="url" placeholder="URL da imagem" /> 
            <p class="validationLabel hidden" id="incorrectAnsBgLabel2${perguntaNum}">Formato da URL inválido</p>
        </div>
        <div class="incorrectAnswer">
            <input class="answerIncorrect" id="incorrectAns3${perguntaNum}" type="text" placeholder="Resposta incorreta 3" />
            <p class="validationLabel hidden" id="answerIncorrectLabel3${perguntaNum}">O texto da resposta não pode ser vazio</p>
            <input class="answerIncorrectBackground" id="incorrectAnsBg3${perguntaNum}" type="url" placeholder="URL da imagem" /> 
            <p class="validationLabel hidden" id="incorrectAnsBgLabel3${perguntaNum}">Formato da URL inválido</p>
        </div>
   </div>
    `;
}
// validate inputs and creates questions object
function validateAnswerInputs() {
  let isAllValid;

  for (let i = 1; i <= quizzQuestionNum; i++) {
    let answerText = document.querySelector(`#questionText${i}`).value;
    let answerBackground = document.querySelector(
      `#questionBackground${i}`
    ).value;
    let answerCorrect = document.querySelector(
      `#answerQuestionCorrect${i}`
    ).value;
    let answerCorrectBackground = document.querySelector(
      `#answerCorrectBackground${i}`
    ).value;
    let answerIncorrect1 = document.querySelector(`#incorrectAns1${i}`).value;
    let answerIncorrect2 = document.querySelector(`#incorrectAns2${i}`).value;
    let answerIncorrect3 = document.querySelector(`#incorrectAns3${i}`).value;

    let answerIncorrect1Background = document.querySelector(
      `#incorrectAnsBg1${i}`
    ).value;
    let answerIncorrect2Background = document.querySelector(
      `#incorrectAnsBg2${i}`
    ).value;
    let answerIncorrect3Background = document.querySelector(
      `#incorrectAnsBg3${i}`
    ).value;

    // verify
    const isValidAnswerCorrectBackground = verifyAnswerCorrectBackground(
      answerCorrectBackground,
      i
    );
    const isValidAnswerIncorrectBackground1 = verifyAnswerIncorrectBackground(
      answerIncorrect1Background,
      i,
      1
    );
    const isValidAnswerIncorrectBackground2 = verifyAnswerIncorrectBackground(
      answerIncorrect2Background,
      i,
      2
    );
    const isValidAnswerIncorrectBackground3 = verifyAnswerIncorrectBackground(
      answerIncorrect3Background,
      i,
      3
    );

    const isValidTittleAnswer = verifyTittleAnswer(answerText, i);
    const isValidBackgroundAnswer = verifyBackgroundAnswer(answerBackground, i);

    const isValidTextCorrectAnswer = verifyTextCorrectAnswer(answerCorrect, i);

    const isValidAnswerIncorrectText1 = verifyAnswerIncorrectText(
      answerIncorrect1,
      i,
      1
    );
    const isValidAnswerIncorrectText2 = verifyAnswerIncorrectText(
      answerIncorrect2,
      i,
      2
    );
    const isValidAnswerIncorrectText3 = verifyAnswerIncorrectText(
      answerIncorrect3,
      i,
      3
    );

    if (isAllValid !== false) {
      isAllValid = verifyAll(
        isValidAnswerCorrectBackground,
        isValidAnswerIncorrectBackground1,
        isValidAnswerIncorrectBackground2,
        isValidAnswerIncorrectBackground3,
        isValidTittleAnswer,
        isValidBackgroundAnswer,
        isValidTextCorrectAnswer,
        isValidAnswerIncorrectText1,
        isValidAnswerIncorrectText2,
        isValidAnswerIncorrectText3
      );
    }
    if (isAllValid) {
      const perguntaObj = {
        title: answerText,
        color: answerBackground,
        answers: [
          {
            text: answerCorrect,
            image: answerCorrectBackground,
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
  }
  if (isAllValid) {
    levelCreationDisplay();
    document.querySelector(".createQuestions").classList.add("hidden");
    document.querySelector(".createLevels").classList.remove("hidden");
  }
}

function verifyAll(
  isValidAnswerCorrectBackground,
  isValidAnswerIncorrectBackground1,
  isValidAnswerIncorrectBackground2,
  isValidAnswerIncorrectBackground3,
  isValidTittleAnswer,
  isValidBackgroundAnswer,
  isValidTextCorrectAnswer,
  isValidAnswerIncorrectText1,
  isValidAnswerIncorrectText2,
  isValidAnswerIncorrectText3
) {
  if (
    isValidAnswerCorrectBackground &&
    isValidAnswerIncorrectBackground1 &&
    isValidAnswerIncorrectBackground2 &&
    isValidAnswerIncorrectBackground3 &&
    isValidTittleAnswer &&
    isValidBackgroundAnswer &&
    isValidTextCorrectAnswer &&
    isValidAnswerIncorrectText1 &&
    isValidAnswerIncorrectText2 &&
    isValidAnswerIncorrectText3
  ) {
    return true;
  }

  return false;
}

//verify answer text
function verifyTextCorrectAnswer(answerText, i) {
  const answerQuestionCorrectLabel = document.querySelector(
    `#answerQuestionCorrectLabel${i}`
  );
  const answerQuestionCorrectInput = document.querySelector(
    `#answerQuestionCorrect${i}`
  );
  if (answerText === "") {
    answerQuestionCorrectLabel.classList.remove("hidden");
    answerQuestionCorrectInput.classList.add("validationInput");
    return false;
  } else {
    answerQuestionCorrectLabel.classList.add("hidden");
    answerQuestionCorrectInput.classList.remove("validationInput");
  }
  return true;
}

// verify answer background
function verifyAnswerCorrectBackground(answerCorrectBackground, i) {
  const answerQuestionCorrectLabel = document.querySelector(
    `#answerCorrectBackgroundLabel${i}`
  );
  const answerQuestionCorrectInput = document.querySelector(
    `#answerCorrectBackground${i}`
  );
  if (isValidUrl(answerCorrectBackground) === false) {
    answerQuestionCorrectLabel.classList.remove("hidden");
    answerQuestionCorrectInput.classList.add("validationInput");
    return false;
  } else {
    answerQuestionCorrectLabel.classList.add("hidden");
    answerQuestionCorrectInput.classList.remove("validationInput");
  }
  return true;
}

// verify incorrect answer text
function verifyAnswerIncorrectText(answerIncorrectText, i, numQuestion) {
  const answerQuestionIncorrectTextLabel = document.querySelector(
    `#answerIncorrectLabel${numQuestion}${i}`
  );
  const answerQuestionIncorrectTextInput = document.querySelector(
    `#incorrectAns${numQuestion}${i}`
  );
  if (answerIncorrectText === "") {
    answerQuestionIncorrectTextLabel.classList.remove("hidden");
    answerQuestionIncorrectTextInput.classList.add("validationInput");
    return false;
  } else {
    answerQuestionIncorrectTextLabel.classList.add("hidden");
    answerQuestionIncorrectTextInput.classList.remove("validationInput");
  }
  return true;
}

// verify incorrect answer background
function verifyAnswerIncorrectBackground(
  answerIncorrectBackground,
  i,
  numQuestion
) {
  const answerQuestionIncorrectLabel = document.querySelector(
    `#incorrectAnsBgLabel${numQuestion}${i}`
  );
  const answerQuestionIncorrectInput = document.querySelector(
    `#incorrectAnsBg${numQuestion}${i}`
  );
  if (isValidUrl(answerIncorrectBackground) === false) {
    answerQuestionIncorrectLabel.classList.remove("hidden");
    answerQuestionIncorrectInput.classList.add("validationInput");
    return false;
  } else {
    answerQuestionIncorrectLabel.classList.add("hidden");
    answerQuestionIncorrectInput.classList.remove("validationInput");
  }
  return true;
}

// verify tittle question
function verifyTittleAnswer(answerText, i) {
  const questionTextLabel = document.querySelector(`#questionTextLabel${i}`);
  const questionTextInput = document.querySelector(`#questionText${i}`);

  if (answerText.length < 20) {
    questionTextLabel.classList.remove("hidden");
    questionTextInput.classList.add("validationInput");
    return false;
  } else {
    questionTextLabel.classList.add("hidden");
    questionTextInput.classList.remove("validationInput");
  }
  return true;
}

// verify color question
function verifyBackgroundAnswer(answerBackground, i) {
  const questionBackgroundLabel = document.querySelector(
    `#questionBackgroundLabel${i}`
  );
  const questionBackgroundtInput = document.querySelector(
    `#questionBackground${i}`
  );

  if (isHex(answerBackground) === false) {
    questionBackgroundLabel.classList.remove("hidden");
    questionBackgroundtInput.classList.add("validationInput");
    return false;
  } else {
    questionBackgroundLabel.classList.add("hidden");
    questionBackgroundtInput.classList.remove("validationInput");
  }
  return true;
}

// creates a display with the number of levels selected to edit
function levelCreationDisplay() {
  for (let i = 1; i <= quizzLevelNum; i++) {
    const template = `<li>
            <div class="levelContainer" onclick="editLevel(this)" id="level${i}">
                <div class="levelHeader">
                    <p>Nivel ${i}</p>
                    <span class="material-symbols-outlined">
                        edit_square
                    </span>
                </div>
            </div>
        </li>`;
    document.querySelector(".createLevels ul").innerHTML += template;
  }
}
function editLevel(level) {
  level.removeAttribute("onclick");
  let levelNum = level.getAttribute("id");
  levelNum = Number(levelNum.replace("level", ""));
  level.innerHTML =
    level.innerHTML +
    `
    <div class="levelCreationSupport">
        <input id="input1Level${levelNum}" type="text" placeholder="Titulo do nivel" />
        <p class="validationLabel hidden" id="input1LevelLabel${levelNum}">O título do nível deve ter no mínimo 10 caracteres</p>
        <input id="input2Level${levelNum}" type="number" placeholder="% de acerto minima" />
        <p class="validationLabel hidden" id="input2LevelLabel${levelNum}">A porcentagem de acerto deve ser um número entre 0 e 100</p>
        <input id="input3Level${levelNum}" type="url" placeholder="URL da imagem do nivel" />
        <p class="validationLabel hidden" id="input3LevelLabel${levelNum}">URL da imagem deve ter formato de URL</p>
        <input id="input4Level${levelNum}" type="text" placeholder="Descricao do nivel" />
        <p class="validationLabel hidden" id="input4LevelLabel${levelNum}">A descrição do nível deve ter no mínimo 30 caracteres</p>
    </div>
    `;
}

function validateLevelInputs() {
  levelsArray.length = 0;
  const zeroCount = [];
  for (let i = 1; i <= quizzLevelNum; i++) {
    let levelTitle = document.querySelector(`#input1Level${i}`).value;
    let levelPercentage = document.querySelector(`#input2Level${i}`).value;
    let levelURL = document.querySelector(`#input3Level${i}`).value;
    let levelDescription = document.querySelector(`#input4Level${i}`).value;
    // if (isValidUrl(levelURL) === false) {
    //   alert(`Tem algo errado com sua URL!`);
    //   return;
    // }
    // if (levelTitle.length < 11) {
    //   alert("O titulo do nivel precisa ter pelo menos 10 caracteres");
    //   return;
    // }
    // if (levelDescription.length < 31) {
    //   alert("a descricao do nivel precisa ter pelo menos 30 caracteres");
    // }

    const isValidLevelTittle = verifyLevelTittle(levelTitle, i);
    const isValidLevelPercentage = verifyLevelPercentage(levelPercentage, i);
    const isValidLevelURL = verifyLevelURL(levelURL, i);
    const isValidLevelDescription = verifyLevelDescription(levelDescription, i);

    if (
      isValidLevelTittle &&
      isValidLevelURL &&
      isValidLevelDescription &&
      isValidLevelPercentage
    ) {
      const levelObj = {
        title: levelTitle,
        image: levelURL,
        text: levelDescription,
        minValue: levelPercentage,
      };
      levelsArray.push(levelObj);
      zeroCount.push(levelPercentage);
    }
  }
  if (zeroCount.includes("0") === false) {
    alert(
      "Ao menos um level deve ter 0% como minimo! Preencha e envie novamente"
    );
    return;
  }
  const quizz = {
    title: quizzTitle,
    image: quizzImgURL,
    questions: questionsArray,
    levels: levelsArray,
  };
  document.querySelector("div.createLevels").classList.add("hidden");
  toggleVisibility([createQuizSection], [cssLoader]);
  const newQuizzCreation = axios.post(
    "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes",
    quizz
  );
  newQuizzCreation.then(newQuizzCreationSuccessful);
  newQuizzCreation.catch(newQuizzCreationFailed);
}

function verifyLevelTittle(levelTittle, i) {
  const levelTittleLabel = document.querySelector(`#input1LevelLabel${i}`);
  const levelTittleInput = document.querySelector(`#input1Level${i}`);
  if (levelTittle.length < 10) {
    levelTittleLabel.classList.remove("hidden");
    levelTittleInput.classList.add("validationInput");
    return false;
  } else {
    levelTittleLabel.classList.add("hidden");
    levelTittleInput.classList.remove("validationInput");
  }
  return true;
}

function verifyLevelPercentage(levelPercentage, i) {
  console.log(levelPercentage);

  const levelPercentageLabel = document.querySelector(`#input2LevelLabel${i}`);
  const levelPercentageInput = document.querySelector(`#input2Level${i}`);
  if (levelPercentage < 0 || levelPercentage > 100 || levelPercentage === "") {
    levelPercentageLabel.classList.remove("hidden");
    levelPercentageInput.classList.add("validationInput");
    return false;
  } else {
    levelPercentageLabel.classList.add("hidden");
    levelPercentageInput.classList.remove("validationInput");
  }
  return true;
}

function verifyLevelDescription(levelDescription, i) {
  const levelDescriptionLabel = document.querySelector(`#input4LevelLabel${i}`);
  const levelDescriptionInput = document.querySelector(`#input4Level${i}`);
  if (levelDescription.length < 30) {
    levelDescriptionLabel.classList.remove("hidden");
    levelDescriptionInput.classList.add("validationInput");
    return false;
  } else {
    levelDescriptionLabel.classList.add("hidden");
    levelDescriptionInput.classList.remove("validationInput");
  }
  return true;
}

function verifyLevelURL(levelURL, i) {
  const levelURLabel = document.querySelector(`#input3LevelLabel${i}`);
  const levelURLInput = document.querySelector(`#input3Level${i}`);
  if (isValidUrl(levelURL) === false) {
    levelURLabel.classList.remove("hidden");
    levelURLInput.classList.add("validationInput");
    return false;
  } else {
    levelURLabel.classList.add("hidden");
    levelURLInput.classList.remove("validationInput");
  }
  return true;
}

function newQuizzCreationSuccessful(promise) {
  const newQuizz = promise.data;
  newQuizzID = newQuizz.id;
  localUserQuizzIdsAndKeys[0].push(newQuizz.id);
  localUserQuizzIdsAndKeys[1].push(newQuizz.key);
  saveUserQuizListLocally();
  finishQuizzPage.querySelector("div img").src = quizzImgURL;
  finishQuizzPage.querySelector("div p").innerHTML = quizzTitle;

  //reset question and lvl page
  document.querySelector(".createQuestions ul").innerHTML = "";
  document.querySelector(".createLevels ul").innerHTML = "";
  toggleVisibility([cssLoader], [createQuizSection, finishQuizzPage]);
}
function newQuizzCreationFailed() {
  alert("Falha na criação do novo Quizz");
  loadHome();
}
function saveUserQuizListLocally() {
  idsAndKeysToSave = JSON.stringify(localUserQuizzIdsAndKeys);
  localStorage.setItem("savedIdsAndKeys", idsAndKeysToSave);
}
function editQuizz(id) {
  console.log(`editou ${id}`);
}
function deleteQuizz(id) {
  const answer = confirm(`Deseja realmente apagar este Quizz?`);
  if (answer === true) {
    toggleVisibility([quizzListSection], [cssLoader]);
    indexToDelete = localUserQuizzIdsAndKeys[0].indexOf(id);
    const deleteRequest = axios.delete(
      `https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${id}`,
      { headers: { "Secret-Key": localUserQuizzIdsAndKeys[1][indexToDelete] } }
    );
    deleteRequest.then(successfullyDeleted);
    deleteRequest.catch(failedToDelete);
  }
}
function successfullyDeleted() {
  alert("Deletado com sucesso!");
  localUserQuizzIdsAndKeys[0].splice(indexToDelete, 1);
  localUserQuizzIdsAndKeys[1].splice(indexToDelete, 1);
  saveUserQuizListLocally();
  loadHome();
}
function failedToDelete() {
  alert("Falha ao deletar!");
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
                    <span class="material-symbols-outlined" onclick="editQuizz(${id});event.stopPropagation()"> edit_square </span>
                    <span class="material-symbols-outlined" onclick="deleteQuizz(${id});event.stopPropagation()"> delete </span>
                </div>
            </div>`;
}
function renderQuizz(templateFunction, quizzContainer, quizz) {
  quizzContainer.innerHTML += templateFunction(
    quizz.title,
    quizz.image,
    quizz.id
  );
}
function handleQuizz(quizz) {
  let thisIsALocalQuizz = false;
  localUserQuizzIdsAndKeys[0].some((localUserQuizzId) => {
    if (localUserQuizzId === quizz.id) {
      renderQuizz(userQuizzTemplate, userQuizzContainer, quizz);
      thisIsALocalQuizz = true;
      return true;
    }
    return false;
  });
  if (!thisIsALocalQuizz)
    renderQuizz(serverQuizzTemplate, serverQuizzContainer, quizz);
}
function quizListLoad(promise) {
  console.log(promise.data);
  userQuizzContainer.innerHTML = "";
  toggleVisibility([cssLoader], [quizzListSection]);
  const quizzes = promise.data;
  quizzes.forEach((quizz) => {
    handleQuizz(quizz);
  });
  if (localUserQuizzIdsAndKeys[0].length > 0) {
    toggleVisibility(
      [emptyUserQuizzContainer],
      [userQuizzTitle, userQuizzContainer]
    );
  } else {
    toggleVisibility(
      [userQuizzTitle, userQuizzContainer],
      [emptyUserQuizzContainer]
    );
  }
}
function createQuizzButtonListenersSetup() {
  document.querySelectorAll(".create_quizz").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelector(".createQuizBasic").classList.remove("hidden");
      toggleVisibility([quizzListSection], [createQuizSection]);
    });
  });
}
function loadLocallySavedQuizzes() {
  const thereAreLocallySavedQuizzes = localStorage.getItem("savedIdsAndKeys");
  if (typeof thereAreLocallySavedQuizzes === "string") {
    localUserQuizzIdsAndKeys = JSON.parse(thereAreLocallySavedQuizzes);
  }
}
function startWebsite() {
  loadLocallySavedQuizzes();
  createQuizzButtonListenersSetup();
  const getQuizzes = axios.get(
    "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes"
  );
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
  if (id === "newQuizz") {
    idQuizz = newQuizzID;
  } else if (id !== null) {
    idQuizz = id;
  }
  toggleVisibility(
    [quizzListSection, createQuizSection, finishQuizzPage],
    [cssLoader]
  );

  const getSelectedQuizz = axios.get(
    `https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/${idQuizz}`
  );
  getSelectedQuizz.then(selectedQuizzLoad);
  getSelectedQuizz.catch(loadHome);
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
  let allAnswers = [];
  question.answers.forEach((answer) => {
    allAnswers.push(`
        <div class="answer ${answer.isCorrectAnswer}" onClick="verifyAnswer(this)">
            <img
                src="${answer.image}"
            />
            <p>${answer.text}</p>
        </div>
    `);
  });

  // random order answers
  allAnswers = randomAnswers(allAnswers);
  allAnswers = allAnswers.join("");

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

// random order answers
function randomAnswers(answers) {
  return answers.sort(() => Math.random() - 0.5);
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
  console.log(level);
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
    if (percentageLevel >= lvl.minValue) {
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
  toggleVisibility(
    [divQuestions, createQuizSection, finishQuizzPage],
    [cssLoader]
  );
  startWebsite();
}
