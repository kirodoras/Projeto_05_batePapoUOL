let user = {
    name: "",
};

let msg = {
	from: "nome do usuário",
	to: "nome do destinatário (Todos se não for um específico)",
	text: "mensagem digitada",
	type: "message" // ou "private_message" para o bônus
}

function entrarNaSala (){
    user.name = prompt("Digite seu nome:");  

    let promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants ', user);

    promise.then(tratarSucesso);
    promise.catch(tratarError);
}

function tratarSucesso(resposta){
    console.log("Resposta recebida com sucesso! Status code: " + resposta.status);

    if(resposta.status === 200){
        buscarMensagens();
        setInterval(function(){
            let promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', user);
            promise.then(iAmOnline);
            buscarMensagens();
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
    console.log("User Online");
}

function buscarMensagens(){
    let promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');

    promise.then(tratarMensagens);
}

let arrayMsg = [];
let spaceMsg = document.querySelector('ul');

function tratarMensagens(mensagem){
    for(i = 0; i < mensagem.data.length; i++){
        if(mensagem.data[i].type ===  'status'){
            arrayMsg.push(`
            <li class="msg-status">
                <span class="time">
                    ${mensagem.data[i].time}
                </span>
                <pre> </pre>
                <span class="name-from">
                    ${mensagem.data[i].from}
                </span>
                <pre> </pre>
                <span class="msg-text">
                    ${mensagem.data[i].text}
                </span>     
            </li>`);
        }
        if(mensagem.data[i].type ===  'message'){
            arrayMsg.push(`
            <li class="msg">
                <span class="time">
                    ${mensagem.data[i].time}
                </span>
                <pre> </pre>
                <span class="name-from">
                    ${mensagem.data[i].from}
                </span>
                <pre> para </pre>
                <span class="name-to">
                        ${mensagem.data[i].to}
                    </span>
                <pre>: </pre>
                <span class="msg-text">
                    ${mensagem.data[i].text}
                </span>     
            </li>`);
        }
        /*mensagem.data[i].type ===  'private_message' & user.name === mensagem.data[i].to*/ 
        if(mensagem.data[i].type ===  'private_message'){
            arrayMsg.push(`
            <li class="msg-priv">
                <span class="time">
                    ${mensagem.data[i].time}
                </span>
                <pre> </pre>
                <span class="name-from">
                    ${mensagem.data[i].from}
                </span>
                <pre> reservadamente para </pre>
                <span class="name-to">
                        ${mensagem.data[i].to}
                    </span>
                <pre>: </pre>
                <span class="msg-text">
                    ${mensagem.data[i].text}
                </span>     
            </li>`);
        }
    }
    clearMsg();
    showMsg(arrayMsg);
    arrayMsg = [];
}

function showMsg(array){
    for(i = 0; i < array.length; i++){
        spaceMsg.innerHTML += array[i];
    }
    document.querySelector('li:last-child').scrollIntoView();
}

function clearMsg (){
    spaceMsg.innerHTML = "";
}
entrarNaSala();

let localMsg = '';
function sendMsg(elemento){
    localMsg = document.querySelector('input')
    if(localMsg.value !== ''){
        msg.from = user.name;
        msg.to = 'Todos';
        msg.text = localMsg.value;
        msg.type = 'message';
        let promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', msg);

        promise.then(function (){
            buscarMensagens();
            localMsg.value = '';
        });
        promise.catch(function(){
            window.location.reload();
        });
        console.log(localMsg.value);
    }
}

document.addEventListener("keypress", function(e){
    if(e.key === "Enter"){
        sendMsg();
    }
})