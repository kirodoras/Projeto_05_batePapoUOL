let user = {
    name: "",
};

function entrarNaSala (){
    user.name = prompt("Digite seu nome:");  

    let promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants ', user);

    promise.then(tratarSucesso);
    promise.catch(tratarError);
}

function tratarSucesso(resposta){
    console.log("Resposta recebida com sucesso! Status code: " + resposta.status);

    if(resposta.status === 200){
        setInterval(function(){
            let promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', user);
            promise.then(iAmOnline);
        },3000);
    }
}

function tratarError(resposta){
    console.log("Status code: " + resposta.response.status);
    console.log("Mensagem de erro: " + resposta.response.data);

    if(resposta.response.status === 400){
        alert("Já exite um usuário com esse nome, por favor escolha outro");
        entrarNaSala();
    }
}

function iAmOnline (){
    console.log("Estou online parça");
}



entrarNaSala();