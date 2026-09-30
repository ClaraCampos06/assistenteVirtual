let etapa = "inicio"

let tatuadorEscolhido = ""
let diaEscolhido = ""
let horarioEscolhido = ""

let disponibilidade = {
Maria: {
quinta: ["10h", "14h", "16h"]
},

Paulo: {
segunda: ["09h", "13h", "18h"]
},

Andre: {
sexta: ["11h", "15h"]
}
}


let tatuadores = [
{
nome: "Maria",
estilo: "Realismo"
},
{
nome: "Paulo",
estilo: "Blackwork"
},
{
nome: "Andre",
estilo: "Oriental"
}
]


let chat = document.querySelector("#chat")

chat.innerHTML = `
    <div class="inicioText">
        <h1>CC</h1> <br>
        <p>assistenteVirtual()</p> <br>
        <p id="paragrafo">Conheça nossos tatuadores e agende um horário digitando o que deseja saber</p>
    </div>
`

function identificarOpcao(mensagem){
   
    let opcao

    if (mensagem.includes("dia") ||
        mensagem.includes("dias")
    ){
        opcao = "dia"
    }
    else if (mensagem.includes("horario") ||
    mensagem.includes("horas")
    ) 
    {
    opcao = "horario"
    }
    else if (
    mensagem.includes("tatuador") ||
    mensagem.includes("tatuadores")
    ) {
    opcao = "tatuadores"
}
    else if (mensagem.includes("orcamento") ||
        mensagem.includes("preco") ||
        mensagem.includes("valor") ||
        mensagem.includes("valores")
    ) {
    opcao = "valor"
    } 
    else if (mensagem.includes("agendar")||
        mensagem.includes("agendamento")||
        mensagem.includes("marcar")
    ) {
    opcao = "agendamento"
    }

    return opcao
}

function gerarResposta(opcao){
    let resposta

    switch (opcao){
    case "horario":
    resposta = "Horário de funcionamento: 07h - 22h"
    break

    case "dia":
    resposta = "Dia de funcionamento: Segunda à Sexta"
    break

    case "tatuadores":
    resposta = "Nossos tatuadores:<br>"

    for (let tatuador of tatuadores){
        resposta += `${tatuador.nome} >>  ${tatuador.estilo} <br>`
    }
    break

    case "valor":
    resposta = "Orçamento direto com seu tatuador"
    break

    case "agendamento":
        resposta = "Vamos agendar o melhor horário! Qual tatuador você se identifica mais?"
        etapa = "tatuador"
        break

    default:
    resposta = "Tente novamente"
    }

    return resposta
}

function enviarMensagem() {

    let input = document.querySelector("#mensagem")

    if (input.value.trim() === "") {
        return
    }

    let chat = document.querySelector("#chat")

    let mensagem = input.value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")

    let resposta


  if (etapa === "tatuador") {

    let nome = input.value.trim()

    let tatuador = tatuadores.find(function(t) {
        return t.nome.toLowerCase() === nome.toLowerCase()
    })

    if (tatuador) {

        tatuadorEscolhido = tatuador.nome

        resposta = `Perfeito! Você escolheu ${tatuador.nome}. Qual dia você gostaria?`

        etapa = "dia"

    } else {

        resposta = "Não encontrei esse tatuador. Escolha um dos nossos tatuadores."

    }
}

  else if (etapa === "dia") {

    let dia = input.value.trim().toLowerCase()

    if (
        disponibilidade[tatuadorEscolhido] &&
        disponibilidade[tatuadorEscolhido][dia]
    ) {

        diaEscolhido = dia

        let horarios = disponibilidade[tatuadorEscolhido][diaEscolhido]

        resposta = `Perfeito! ${tatuadorEscolhido} tem estes horários disponíveis na ${diaEscolhido}: ${horarios.join(", ")}. Qual você prefere?`

        etapa = "horario"

    } else {

        resposta = `${tatuadorEscolhido} não possui disponibilidade nesse dia. Escolha outro dia.`

    }
}
    else if (etapa === "horario") {

        horarioEscolhido = input.value.toLowerCase()

        if (
            disponibilidade[tatuadorEscolhido] &&
            disponibilidade[tatuadorEscolhido][diaEscolhido] &&
            disponibilidade[tatuadorEscolhido][diaEscolhido].includes(horarioEscolhido)
        ) {

            resposta = `Ótimo! ${tatuadorEscolhido} está disponível às ${horarioEscolhido} no/a ${diaEscolhido}.`

        } else {

            resposta = `Infelizmente ${tatuadorEscolhido} não está disponível nesse horário. Escolha outro horário.`

        }

    }

    else {

        let opcao = identificarOpcao(mensagem)

        resposta = gerarResposta(opcao)

    }


    chat.innerHTML += `
        <div class="usuario">
            <strong>Você:</strong>  ${input.value}
        </div>

        <div class="assistente">
            <strong>CC:</strong>  ${resposta}
        </div>
    `

    chat.scrollTop = chat.scrollHeight

    input.value = ""
}

let input = document.querySelector("#mensagem")

input.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        enviarMensagem()
    }

})