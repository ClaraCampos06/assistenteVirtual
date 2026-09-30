let etapa = "inicio"



let tatuadorEscolhido = ""
let diaEscolhido = ""
let horarioEscolhido = ""
let nomeCliente = ""

let disponibilidade = {

    Maria: {
        segunda: ["7h", "9h", "11h"],
        quarta: ["9h", "11h", "14h"],
        sexta: ["7h", "16h"]
    },

    Paulo: {
        segunda: ["11h", "13h", "18h"],
        terça: ["9h", "16h"],
        quinta: ["13h", "18h"]
    },

    Andre: {
        terça: ["18h", "21h"],
        quarta: ["11h", "15h"],
        sexta: ["18h", "23h"]
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
        <h1>CC</h1>
        <p>assistenteVirtual()</p> <br>
        <p id="paragrafo">Conheça nossos tatuadores e agende um horário digitando:</p>
        <ul id="listaPrincipal">
        <li>Agendar
        <li>Horários
        <li>Tatuadores
        <li>Orçamento
        </ul>
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
    } else if (mensagem.includes("local")||
               mensagem.includes("estudio") ||
               mensagem.includes("endereco")     
            ) {
                opcao = "localizacao"
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
        resposta = "Para agendar, conheça nossos tatuadores: <br>Qual tatuador você se identifica mais? <br>"
          for (let tatuador of tatuadores){
        resposta += `${tatuador.nome} >>  ${tatuador.estilo} <br>`
    }
        etapa = "tatuador"
        break

 
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
    let opcao = identificarOpcao(mensagem)


    if (
    opcao === "dia" ||
    opcao === "horario" ||
    opcao === "tatuadores" ||
    opcao === "valor" ||
    opcao === "localizacao"
) {

    resposta = gerarResposta(opcao)

}

else if (etapa === "tatuador") {

    let nome = input.value.trim().toLowerCase()

    let tatuador = tatuadores.find(function(t) {
        return t.nome.toLowerCase() === nome
    })

    if (tatuador) {

        tatuadorEscolhido = tatuador.nome

        let dias = Object.keys(
            disponibilidade[tatuadorEscolhido]
        )

        resposta = `
            Você escolheu ${tatuador.nome}.
            <br><br>

            Dias disponíveis:<br>
            ${dias.join(", ")}
            <br><br>

            Qual dia você prefere?
        `

        etapa = "dia"

    } else {

        resposta = `
            Não encontrei esse tatuador.
            <br><br>
            Escolha um dos nossos tatuadores.
        `
    }

}

else if (etapa === "dia") {

    let dia = input.value.trim().toLowerCase()

    let diasDisponiveis = Object.keys(
        disponibilidade[tatuadorEscolhido]
    )

    if (diasDisponiveis.includes(dia)) {

        diaEscolhido = dia

        let horarios =
            disponibilidade[tatuadorEscolhido][diaEscolhido]

        resposta = `
            Perfeito!
            <br><br>

            ${tatuadorEscolhido} tem estes horários disponíveis
            na ${diaEscolhido}:

            <br><br>

            ${horarios.join(", ")}

            <br><br>

            Qual horário você prefere?
        `

        etapa = "horario"

    } else {

        resposta = `
            Não encontrei disponibilidade de
            ${tatuadorEscolhido} na ${dia}.

            <br><br>

            Dias disponíveis:
            ${diasDisponiveis.join(", ")}
        `
    }

}

else if (etapa === "horario") {

    horarioEscolhido = input.value.trim().toLowerCase()

    let horarios =
        disponibilidade[tatuadorEscolhido][diaEscolhido]

    if (horarios.includes(horarioEscolhido)) {

        resposta = `
            Horário selecionado com sucesso!

            <br><br>

            Tatuador: ${tatuadorEscolhido}<br>
            Dia: ${diaEscolhido}<br>
            Horário: ${horarioEscolhido}

            <br><br>

            Digite aqui o seu nome:
        `

        etapa = "nome"

    } else {

        resposta = `
            Esse horário não está disponível.

            <br><br>

            Horários disponíveis:
            ${horarios.join(", ")}
        `
    }

}

else if (etapa === "nome") {

    nomeCliente = input.value.trim()

    resposta = `
        Prazer, ${nomeCliente}! 😊

        <br><br>

        Confira seu agendamento:

        <br><br>

        Nome: ${nomeCliente}<br>
        Tatuador: ${tatuadorEscolhido}<br>
        Dia: ${diaEscolhido}<br>
        Horário: ${horarioEscolhido}

        <br><br>

        Deseja confirmar o agendamento?

        <br>

        Digite <strong>SIM</strong> para confirmar.
    `

    etapa = "confirmacao"

}

else if (etapa === "confirmacao") {

    if (mensagem === "sim") {

        resposta = `
            <strong>Agendamento confirmado!</strong>

            <br><br>

            Nome: ${nomeCliente}<br>
            Tatuador: ${tatuadorEscolhido}<br>
            Dia: ${diaEscolhido}<br>
            Horário: ${horarioEscolhido}

            <br><br>

            Estamos esperando por você no CC Studio Tattoo.
        `

        etapa = "inicio"

    } else {

        resposta = `
            Agendamento não confirmado.

            <br><br>

            Se quiser tentar novamente,
            digite <strong>agendar</strong>.
        `

        etapa = "inicio"
    }

}

else {

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

}




)

function mensagemDoIcone(texto) {

    let input = document.querySelector("#mensagem")

    etapa = "inicio"

    input.value = texto

    enviarMensagem()

}
let calendario = document.querySelector("#calendario")
let tatuadoresIcone = document.querySelector("#tatuadores")
let agendamento = document.querySelector("#agendamento")
let informacao = document.querySelector("#informacao")
let house = document.querySelector("#house")


calendario.addEventListener("click", function() {

    mensagemDoIcone("quais são os dias de funcionamento?")

})


tatuadoresIcone.addEventListener("click", function() {

    mensagemDoIcone("quais são os tatuadores?")

})


agendamento.addEventListener("click", function() {

    mensagemDoIcone("quero agendar")

})


informacao.addEventListener("click", function() {

    mensagemDoIcone("qual é a localização do estúdio?")

})