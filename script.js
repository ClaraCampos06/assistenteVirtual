let etapa = "inicio"



let tatuadorEscolhido = ""
let diaEscolhido = ""
let horarioEscolhido = ""
let nomeCliente = ""

function linkWhatsApp() {
    let texto = `Olá! Sou ${nomeCliente} e agendei com ${tatuadorEscolhido} na ${diaEscolhido} às ${horarioEscolhido}.`
    return "https://wa.me/5528999999999?text=" + encodeURIComponent(texto)
}

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

function mostrarInicio() {
    chat.innerHTML = `
        <div class="inicioText">
            <h1>CC</h1>
            <p id="paragrafo">assistenteVirtual()</p> <br>
            <p id="paragrafo">Conheça nossos tatuadores e agende um horário digitando:</p>
            <ul id="listaPrincipal">
                <li>Agendar</li>
                <li>Horários</li>
                <li>Tatuadores</li>
                <li>Orçamento</li>
            </ul>
        </div>
    `
}

mostrarInicio()
let house = document.querySelector("#house")

house.addEventListener("click", function () {
    mostrarInicio()
    etapa = "inicio"
})

function identificarOpcao(mensagem){
   
    let opcao

    if (mensagem.includes("funcionamento") ||
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
    resposta = "◦Horário de funcionamento: <br><br> <strong>07h às 22h</strong>"
    break

    case "dia":
    resposta = "◦Dia de funcionamento: <br><br> <strong>Segunda à Sexta</strong>"
    break

    case "tatuadores":
    resposta = "Nossos tatuadores:<br><br>"

    for (let tatuador of tatuadores){
        resposta += `<strong>◦${tatuador.nome}</strong> <br> ${tatuador.estilo}<br>`
    }
    break

    case "valor":
    resposta = "Orçamento direto com seu tatuador"
    break

    case "agendamento":
        resposta = "Para agendar, conheça nossos tatuadores e escolha quem deseja:<br> <br>"
          for (let tatuador of tatuadores){
        resposta += `<strong>◦${tatuador.nome}</strong>${tatuador.estilo} <br><br>`
    }
        etapa = "tatuador"
        break

    default:
      resposta = "Para uma melhor experiência, digite algo como: <br><br> ◦AGENDAR <br> ◦HORÀRIOS <br> ◦TATUADORES <br> ◦ORÇAMENTOS <br> "
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
        Qual dia você prefere?<br><br>
            <strong>◦Seu tatuador</strong> ${tatuador.nome}
            <br><br>

            <strong>◦Dias disponíveis</strong>
            ${dias.join("<br> ")}
            <br><br>    
            
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
        Qual horário você prefere?<br><br>
            <strong>${tatuadorEscolhido}<br> ◦Horários disponíveis
            na ${diaEscolhido}</strong>

           ${horarios.join("<br> ")}

            <br>

            
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
            Informe seu nome para concluir o agendamento:

            <br><br>

            <strong>◦Tatuador</strong> ${tatuadorEscolhido}<br>
             <strong>◦Dia </strong> ${diaEscolhido}<br>
             <strong>◦Horário </strong> ${horarioEscolhido}<br>
             
            
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
        <strong>Confira seu agendamento, ${nomeCliente}</strong>

        <br><br>

        <strong>◦Cliente</strong>
         ${nomeCliente}<br>
        <strong>◦Tatuador</strong> ${tatuadorEscolhido}<br>
        <strong>◦Dia</strong> ${diaEscolhido}<br>
        <strong>◦Horário</strong> ${horarioEscolhido}

        <br><br>

        <strong>Deseja confirmar o agendamento?</strong>

        <br>

        Digite <strong>SIM</strong> para confirmar.
    `

    etapa = "confirmacao"

}

else if (etapa === "confirmacao") {

    if (mensagem === "sim") {
        

        resposta = `
            <strong>Agendamento confirmado!</strong>

            <br>

            <strong>◦Nome</strong> ${nomeCliente}<br><br>
            <strong>◦Tatuador</strong> ${tatuadorEscolhido}<br><br>
            <strong>◦Dia</strong> ${diaEscolhido}<br><br>
            <strong>◦Horário</strong> ${horarioEscolhido}

            <br>

            <br>
            <a href="${linkWhatsApp()}" target="_blank">Confirmar no WhatsApp</a>
            <br><br>
            <strong>Obrigado pela confiança!</strong>
        `

        etapa = "inicio"

    } else {

        resposta = `
            Agendamento não confirmado.

            <br><br>

            Se quiser tentar novamente,
            digite <strong>
            <br>
            AGENDAR</strong>
        `

        etapa = "inicio"
    }

}

else {

    resposta = gerarResposta(opcao)

}
    



       // 1) a bolha do usuário aparece na hora
    chat.innerHTML += `
        <div class="usuario">
            <strong>Você:</strong>  ${input.value}
        </div>
    `

    input.value = ""

    // 2) aparece o "digitando..."
    let bolha = document.createElement("div")
    bolha.className = "assistente digitando"
    bolha.innerHTML = "<span></span><span></span><span></span>"
    chat.appendChild(bolha)
    chat.scrollTop = chat.scrollHeight

    // 3) depois de 0,7s, troca os pontinhos pela resposta
    setTimeout(function () {
        bolha.classList.remove("digitando")
        bolha.innerHTML = `<strong>CC:</strong> ${resposta}`
        chat.scrollTop = chat.scrollHeight

        // os chips entram aqui dentro, depois da resposta
        if (etapa === "tatuador") mostrarChips(tatuadores.map(t => t.nome))
        else if (etapa === "dia") mostrarChips(Object.keys(disponibilidade[tatuadorEscolhido]))
        else if (etapa === "horario") mostrarChips(disponibilidade[tatuadorEscolhido][diaEscolhido])
        else if (etapa === "confirmacao") mostrarChips(["sim", "não"])
    }, 700)
  if (input.value.trim() === "") {
      return
  }

  document.querySelector(".chips")?.remove()
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



calendario.addEventListener("click", function() {

    mensagemDoIcone("quais são os dias de funcionamento?")

})


tatuadoresIcone.addEventListener("click", function() {

    mensagemDoIcone("quais são os tatuadores?")

})


agendamento.addEventListener("click", function() {

    mensagemDoIcone("quero agendar")

})


