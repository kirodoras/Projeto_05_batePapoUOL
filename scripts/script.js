let user = {
    name: "",
};

let msg = {
	from: "nome do usuário",
	to: 'Todos',
	text: "mensagem digitada",
	type: 'message' // ou "private_message" para o bônus
}

let listaParticipantes = document.querySelector('.lista-participantes');
function entrarNaSala (){
    /*user.name = prompt("Digite seu nome:");*/
    /*user.name = getUserName();*/
    let promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants ', user);

    promise.then(tratarSucesso);
    promise.catch(tratarError);
}

function tratarSucesso(resposta){
    msg.from = user.name;
    console.log("Resposta recebida com sucesso! Status code: " + resposta.status);

    if(resposta.status === 200){
        buscarMensagens();
        setInterval(function(){
            let promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', user);
            promise.then(iAmOnline);
        },4900);
        setInterval(function(){
            buscarMensagens();
        },3000);
    }
}

function tratarError(resposta){
    console.log("Status code: " + resposta.response.status);
    console.log("Mensagem de erro: " + resposta.response.data);

    if(resposta.response.status === 400){
        alert("Já exite um usuário com esse nome, por favor escolha outro");
        window.location.reload();
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
        if(mensagem.data[i].type ===  'private_message' & (user.name === mensagem.data[i].to | user.name === mensagem.data[i].from)){
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
    document.querySelector('ul li:last-child').scrollIntoView();
}

function clearMsg (){
    spaceMsg.innerHTML = "";
}
/*entrarNaSala();*/

let localMsg = '';
function sendMsg(elemento){
    localMsg = document.querySelector('.digite input');
    if(localMsg.value !== ''){
        msg.text = localMsg.value;
        let promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', msg);

        promise.then(function (){
            localMsg.value = '';
            buscarMensagens();
        });
        promise.catch(function(){
            alert("Usuário desconectado");
            window.location.reload();
        });
        console.log(localMsg.value);
    }
}

document.addEventListener("keydown", function(e){
    if(e.key === "Enter"){
        sendMsg();
    }
})

function buscarParticipantes(){
    let promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants');
    listaParticipantes.innerHTML = "";
    promise.then(function (resposta){
        listaParticipantes.innerHTML += `
            <li onclick="selectTo(this)">
                <div>
                    <ion-icon name="people"></ion-icon>
                    <pre>  </pre>
                    <span>Todos</span>
                </div>
                <ion-icon name="checkmark-outline" class="hidden check-to"></ion-icon>
            </li>`;
        for(let i = 0; i < resposta.data.length; i++){
            listaParticipantes.innerHTML += `
            <li onclick="selectTo(this)">
                <div>
                    <ion-icon name="person-circle"></ion-icon>
                    <pre>  </pre>
                    <span>${resposta.data[i].name}</span>
                </div>
            <ion-icon name="checkmark-outline" class="hidden"></ion-icon>
             </li>`;
        }
    });
    promise.catch(function(){
        alert("Erro em buscar participantes");
    });
}

setInterval(buscarParticipantes, 10000);

function openMenu(){
    const menu = document.querySelector('.menu-lateral');
    menu.classList.remove('hidden');
    buscarParticipantes()
}

function closeMenu(){
    const menu = document.querySelector('.menu-lateral');
    menu.classList.add('hidden');
    listaParticipantes.innerHTML = "";
}

let inputStatus = document.querySelector('.digite-status');
function selectVisibilidade(which) {
    const select = document.querySelector('.check-visibilidade');
    if(select !== null){
        select.classList.toggle('check-visibilidade');
    }
    which.querySelector('ion-icon:last-child').classList.toggle('check-visibilidade');

    if(which.querySelector('span').innerHTML === "Público"){
        msg.type = 'message';
        inputStatus.classList.add('hidden');
    }

    if(which.querySelector('span').innerHTML === "Reservadamente"){
        msg.type = 'private_message';
        inputStatus.classList.remove('hidden');
        inputStatus.innerHTML = `Enviando para ${msg.to} (reservadamente)`;
    }
}

function selectTo(which) {
    const select = document.querySelector('.check-to');
    if(select !== null){
        select.classList.toggle('check-to');
    }
    which.querySelector('ion-icon:last-child').classList.toggle('check-to');
    msg.to = which.querySelector('span').innerHTML;
    inputStatus.innerHTML = `Enviando para ${msg.to} (reservadamente)`;
}

function getUserName(elemento){
    localName = document.querySelector('.entrada-nome input');
    if(localName.value !== ''){
        elemento.parentNode.classList.add('hidden');
        user.name = localName.value;
        entrarNaSala();
    }
}
