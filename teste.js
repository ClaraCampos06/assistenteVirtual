/* =========================================================
   CC studio tattoo - Assistente Virtual
   ========================================================= */


/* ---------- 1) VARIÁVEIS DO AGENDAMENTO ---------- */

let etapa = "inicio"

let tatuadorEscolhido = ""
let diaEscolhido = ""
let horarioEscolhido = ""
let nomeCliente = ""

// TROQUE pelo número do estúdio: 55 + DDD + número, só dígitos
const NUMERO_WHATSAPP = "5528999999999"


/* ---------- 2) DADOS ---------- */

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


/* ---------- 3) ELEMENTO DO CHAT ---------- */

let chat = document.querySelector("#chat")


/* ---------- 4) FUNÇÕES AUXILIARES ---------- */

// Impede que texto digitado vire HTML (segurança)
function escapar(texto) {
    let div = document.createElement("div")
    div.textContent = texto
    return div.innerHTML
}

// minúsculas, sem acento e sem espaços nas pontas
function normalizar(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
}

// Link que abre o WhatsApp do estúdio com a mensagem pronta
function linkWhatsApp() {
    let texto = `Olá! Sou ${nomeCliente} e agendei com ${tatuadorEscolhido} na ${diaEscolhido} às ${horarioEscolhido}.`
    return "https://wa.me/" + NUMERO_WHATSAPP + "?text=" + encodeURIComponent(texto)
}

// Agendamentos salvos no navegador
function lerAgendamentos() {
    try {
        return JSON.parse(localStorage.getItem("agendamentos")) || []
    } catch (erro) {
        return []
    }
}

function salvarAgendamento() {
    let lista = lerAgendamentos()
    lista.push({
        cliente: nomeCliente,
        tatuador: tatuadorEscolhido,
        dia: diaEscolhido,
        horario: horarioEscolhido
    })
    localStorage.setItem("agendamentos", JSON.stringify(lista))
}

// Horários do tatuador naquele dia que ainda não foram agendados
function horariosLivres(tatuador, dia) {
    let ocupados = lerAgendamentos()
        .filter(function (a) {
            return a.tatuador === tatuador && a.dia === dia
        })
        .map(function (a) {
            return a.horario
        })

    return disponibilidade[tatuador][dia].filter(function (h) {
        return !ocupados.includes(h)
    })
}


/* ---------- 5) BOTÕES DE RESPOSTA RÁPIDA (chips) ---------- */

function mostrarChips(opcoes) {
    let div = document.createElement("div")
    div.className = "chips"

    opcoes.forEach(function (texto) {
        let b = document.createElement("button")
        b.textContent = texto

        b.addEventListener("click", function () {
            document.querySelector("#mensagem").value = texto
            enviarMensagem()
        })

        div.appendChild(b)
    })

    chat.appendChild(div)
    chat.scrollTop = chat.scrollHeight
}

function mostrarMenuPrincipal() {
    mostrarChips(["Agendar", "Horários", "Tatuadores", "Orçamento"])
}


/* ---------- 6) TELA INICIAL ---------- */

function mostrarInicio() {
    chat.innerHTML = `
        <div class="inicioText">
            <h1>CC</h1>
            <p class="paragrafo">assistenteVirtual()</p> <br>
            <p class="paragrafo">Conheça nossos tatuadores e agende um horário digitando:</p>
            <ul id="listaPrincipal">
                <li>Agendar</li>
                <li>Horários</li>
                <li>Tatuadores</li>
                <li>Orçamento</li>
            </ul>
            <p class="paragrafo">Ou selecione o ícone correspondente</p>
        </div>
    `
}

mostrarInicio()

let house = document.querySelector("#house")

house.addEventListener("click", function () {
    mostrarInicio()
    etapa = "inicio"
})


/* ---------- 7) ENTENDER O QUE O USUÁRIO QUER ---------- */

function identificarOpcao(mensagem) {

    let opcao

    if (mensagem.includes("funcionamento") ||
        mensagem.includes("dias")
    ) {
        opcao = "dia"
    }
    else if (mensagem.includes("horario") ||
        mensagem.includes("horas")
    ) {
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
    else if (mensagem.includes("agendar") ||
        mensagem.includes("agendamento") ||
        mensagem.includes("marcar")
    ) {
        opcao = "agendamento"
    }

    return opcao
}


/* ---------- 8) RESPOSTAS FIXAS ---------- */

function gerarResposta(opcao) {
    let resposta

    switch (opcao) {

        case "horario":
            resposta = "◦Horário de funcionamento: <br><br> <strong>07h às 22h</strong>"
            break

        case "dia":
            resposta = "◦Dia de funcionamento: <br><br> <strong>Segunda à Sexta</strong>"
            break

        case "tatuadores":
            resposta = "Nossos tatuadores:<br><br>"

            for (let tatuador of tatuadores) {
                resposta += `<strong>◦${tatuador.nome}</strong> <br> ${tatuador.estilo}<br>`
            }
            break

        case "valor":
            resposta = "Orçamento direto com seu tatuador"
            break

        case "agendamento":
            resposta = "Para agendar, conheça nossos tatuadores e escolha quem deseja:<br> <br>"

            for (let tatuador of tatuadores) {
                resposta += `<strong>◦${tatuador.nome}</strong> ${tatuador.estilo} <br><br>`
            }

            etapa = "tatuador"
            break

        default:
            resposta = "Para uma melhor experiência, digite algo como: <br><br> ◦AGENDAR <br> ◦HORÁRIOS <br> ◦TATUADORES <br> ◦ORÇAMENTOS <br> "
    }

    return resposta
}


/* ---------- 9) FUNÇÃO PRINCIPAL ---------- */

function enviarMensagem() {

    let input = document.querySelector("#mensagem")

    if (input.value.trim() === "") {
        return
    }

    // apaga os botões da pergunta anterior
    document.querySelector(".chips")?.remove()

    let textoDigitado = input.value.trim()
    let mensagem = normalizar(input.value)

    let resposta
    let opcao = identificarOpcao(mensagem)


    // Perguntas gerais (horários, dias, tatuadores, valores).
    // Quando está pedindo o nome do cliente, não interpreta como pergunta.
    if (
        etapa !== "nome" &&
        (opcao === "dia" ||
            opcao === "horario" ||
            opcao === "tatuadores" ||
            opcao === "valor")
    ) {

        resposta = gerarResposta(opcao)

    }

    // ETAPA: escolher o tatuador
    else if (etapa === "tatuador") {

        let tatuador = tatuadores.find(function (t) {
            return normalizar(t.nome) === mensagem
        })

        if (tatuador) {

            tatuadorEscolhido = tatuador.nome

            let dias = Object.keys(disponibilidade[tatuadorEscolhido])

            resposta = `
                Qual dia você prefere?<br><br>
                <strong>◦Seu tatuador</strong> ${tatuador.nome}
                <br><br>

                <strong>◦Dias disponíveis</strong><br>
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

    // ETAPA: escolher o dia
    else if (etapa === "dia") {

        let diasDisponiveis = Object.keys(disponibilidade[tatuadorEscolhido])

        // aceita "terca", "terça" ou só o começo ("ter", "seg")
        let dia = diasDisponiveis.find(function (d) {
            let nomeDia = normalizar(d)
            return nomeDia === mensagem ||
                (mensagem.length >= 3 && nomeDia.startsWith(mensagem))
        })

        if (dia) {

            let horarios = horariosLivres(tatuadorEscolhido, dia)

            if (horarios.length > 0) {

                diaEscolhido = dia

                resposta = `
                    Qual horário você prefere?<br><br>
                    <strong>${tatuadorEscolhido}<br> ◦Horários disponíveis
                    na ${diaEscolhido}</strong><br>

                    ${horarios.join("<br> ")}

                    <br>
                `

                etapa = "horario"

            } else {

                resposta = `
                    Todos os horários de ${tatuadorEscolhido} na ${dia}
                    já foram agendados.

                    <br><br>

                    Escolha outro dia:
                    ${diasDisponiveis.join(", ")}
                `
            }

        } else {

            resposta = `
                Não encontrei disponibilidade de
                ${tatuadorEscolhido} nesse dia.

                <br><br>

                Dias disponíveis:
                ${diasDisponiveis.join(", ")}
            `
        }

    }

    // ETAPA: escolher o horário
    else if (etapa === "horario") {

        let horarios = horariosLivres(tatuadorEscolhido, diaEscolhido)

        let horario = horarios.find(function (h) {
            return normalizar(h) === mensagem
        })

        if (horario) {

            horarioEscolhido = horario

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

    // ETAPA: nome do cliente
    else if (etapa === "nome") {

        nomeCliente = textoDigitado

        resposta = `
            <strong>Confira seu agendamento, ${escapar(nomeCliente)}</strong>

            <br><br>

            <strong>◦Cliente</strong>
            ${escapar(nomeCliente)}<br>
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

    // ETAPA: confirmação
    else if (etapa === "confirmacao") {

        if (mensagem === "sim") {

            salvarAgendamento()

            resposta = `
                <strong>Agendamento confirmado!</strong>

                <br><br>

                <strong>◦Nome</strong> ${escapar(nomeCliente)}<br><br>
                <strong>◦Tatuador</strong> ${tatuadorEscolhido}<br><br>
                <strong>◦Dia</strong> ${diaEscolhido}<br><br>
                <strong>◦Horário</strong> ${horarioEscolhido}

                <br><br>

                <a href="${linkWhatsApp()}" target="_blank" rel="noopener">Confirmar no WhatsApp</a>

                <br><br>

                <strong>Obrigado pela confiança!</strong>
            `

            etapa = "inicio"

        } else {

            resposta = `
                Agendamento não confirmado.

                <br><br>

                Se quiser tentar novamente,
                clique em <strong>AGENDAR</strong>.
            `

            etapa = "inicio"
        }

    }

    // Qualquer outro caso
    else {

        resposta = gerarResposta(opcao)

    }


    // 1) a bolha do usuário aparece na hora
    chat.innerHTML += `
        <div class="usuario">
            <strong>Você:</strong>  ${escapar(textoDigitado)}
        </div>
    `

    input.value = ""

    // 2) aparece o "digitando..."
    let bolha = document.createElement("div")
    bolha.className = "assistente digitando"
    bolha.innerHTML = "<span></span><span></span><span></span>"
    chat.appendChild(bolha)
    chat.scrollTop = chat.scrollHeight

    // 3) depois de 0,7s, troca os pontinhos pela resposta e mostra os botões
    setTimeout(function () {

        bolha.classList.remove("digitando")
        bolha.innerHTML = `<strong>CC:</strong> ${resposta}`
        chat.scrollTop = chat.scrollHeight

        if (etapa === "tatuador") {
            mostrarChips(tatuadores.map(function (t) { return t.nome }))
        }
        else if (etapa === "dia") {
            mostrarChips(Object.keys(disponibilidade[tatuadorEscolhido]))
        }
        else if (etapa === "horario") {
            mostrarChips(horariosLivres(tatuadorEscolhido, diaEscolhido))
        }
        else if (etapa === "confirmacao") {
            mostrarChips(["sim", "não"])
        }
        else {
            mostrarMenuPrincipal()
        }

    }, 700)
}


/* ---------- 10) TECLA ENTER ---------- */

let input = document.querySelector("#mensagem")

input.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        enviarMensagem()
    }

})


/* ---------- 11) ÍCONES DO MENU LATERAL ---------- */

function mensagemDoIcone(texto) {

    let input = document.querySelector("#mensagem")

    etapa = "inicio"

    input.value = texto

    enviarMensagem()

}

let calendario = document.querySelector("#calendario")
let tatuadoresIcone = document.querySelector("#tatuadores")
let agendamento = document.querySelector("#agendamento")

calendario.addEventListener("click", function () {
    mensagemDoIcone("quais são os dias de funcionamento?")
})

tatuadoresIcone.addEventListener("click", function () {
    mensagemDoIcone("quais são os tatuadores?")
})

agendamento.addEventListener("click", function () {
    mensagemDoIcone("quero agendar")
})