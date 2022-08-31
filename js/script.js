let quizzTitle;
let quizzImgURL;
let quizzQuestionNum;
let quizzLevelNum;
// funcao para teste de URL (cria uma promessa que testa a URL e caso de erro retorna false, se der sucesso retorna true)
const isValidUrl = urlInput=> {
    try {
        return Boolean(new URL(urlInput))
    }
    catch(e) {
        return false
    }
}

//funcao que testa os valores inseridos e atribui os valores as variaveis globais que vao ser usadas para criar o objeto para enviar
// para a API e criar o Quizz
function prosseguirParaPerguntas() {
    quizzTitle = document.querySelector('#quizzNameInput').value;
    quizzImgURL = document.querySelector('#quizzImgURLInput').value;
    quizzQuestionNum = document.querySelector('#quizzQuestionNumInput').value;
    quizzLevelNum = document.querySelector('#quizzLevelNumInput').value;
    

    if(quizzTitle.length > 65 || quizzTitle.length < 20) {
        alert('insira um titulo entre 25 e 60 caracteres e clique novamente!')
    } 
    else if (quizzImgURL == '' || quizzQuestionNum == '' || quizzLevelNum == '' || isValidUrl(quizzImgURL) === false) {
        alert('voce nao preencheu corretamente, preencha e clique novamente!')
    }
    else {
        document.querySelector('.createQuizBasic').classList.add('hidden');
        // qualquer acao que interfira no codigo inteiro deve ser feita aqui
    }    
}
