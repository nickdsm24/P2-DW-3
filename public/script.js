const API_URL = "";

const formMesa = document.getElementById("form-mesa");
const formReserva = document.getElementById("form-reserva");

const selectMesa = document.getElementById("mesa");
const filtroMesa = document.getElementById("filtroMesa");

const listaReservas = document.getElementById("lista-reservas");
const mapaMesas = document.getElementById("mapa-mesas");

const mensagem = document.getElementById("mensagem");

let mesas = [];
let reservas = [];

function mostrarMensagem(texto, tipo = "sucesso") {
  mensagem.textContent = texto;
  mensagem.className = `mensagem ${tipo}`;
  mensagem.style.display = "block";

  setTimeout(() => {
    mensagem.style.display = "none";
  }, 3000);
}

function formatarData(data) {
  return new Date(data).toLocaleString("pt-BR");
}

async function carregarMesas() {
  try {
    const resposta = await fetch(`${API_URL}/mesas`);
    const dados = await resposta.json();

    mesas = dados.mesas || [];

    preencherSelectMesas();
    renderizarMapaMesas();
  } catch (error) {
    mostrarMensagem("Erro ao carregar mesas.", "erro");
  }
}

async function carregarReservas() {
  try {
    const cliente = document.getElementById("filtroCliente").value;
    const mesa = document.getElementById("filtroMesa").value;
    const data = document.getElementById("filtroData").value;
    const status = document.getElementById("filtroStatus").value;

    const params = new URLSearchParams();

    if (cliente) params.append("cliente", cliente);
    if (mesa) params.append("mesa", mesa);
    if (data) params.append("data", data);
    if (status) params.append("status", status);

    const url = `${API_URL}/reservas?${params.toString()}`;

    const resposta = await fetch(url);
    const dados = await resposta.json();

    reservas = dados.reservas || [];

    renderizarReservas();
    renderizarMapaMesas();
  } catch (error) {
    mostrarMensagem("Erro ao carregar reservas.", "erro");
  }
}

function preencherSelectMesas() {
  selectMesa.innerHTML = `<option value="">Selecione uma mesa</option>`;
  filtroMesa.innerHTML = `<option value="">Todas as mesas</option>`;

  mesas.forEach((mesa) => {
    const optionReserva = document.createElement("option");
    optionReserva.value = mesa._id;
    optionReserva.textContent = `Mesa ${mesa.numMesa} - ${mesa.capacidade} pessoas - ${mesa.loc}`;
    selectMesa.appendChild(optionReserva);

    const optionFiltro = document.createElement("option");
    optionFiltro.value = mesa._id;
    optionFiltro.textContent = `Mesa ${mesa.numMesa}`;
    filtroMesa.appendChild(optionFiltro);
  });
}

function buscarStatusMesa(mesaId) {
  const reservaMesa = reservas.find((reserva) => {
    const idMesaReserva = reserva.mesa?._id || reserva.mesa;

    return (
      idMesaReserva === mesaId &&
      reserva.status !== "Cancelado" &&
      reserva.status !== "Finalizado"
    );
  });

  if (!reservaMesa) {
    return "Disponível";
  }

  return reservaMesa.status;
}

function classeStatusMesa(status) {
  if (status === "Ocupado") {
    return "vermelho";
  }

  if (status === "Reservado") {
    return "amarelo";
  }

  return "verde";
}

function renderizarMapaMesas() {
  mapaMesas.innerHTML = "";

  if (mesas.length === 0) {
    mapaMesas.innerHTML = "<p>Nenhuma mesa cadastrada.</p>";
    return;
  }

  mesas.forEach((mesa) => {
    const status = buscarStatusMesa(mesa._id);
    const classe = classeStatusMesa(status);

    const div = document.createElement("div");
    div.className = `mesa-card ${classe}`;

    div.innerHTML = `
      <h3>Mesa ${mesa.numMesa}</h3>
      <p>Capacidade: ${mesa.capacidade}</p>
      <p>Local: ${mesa.loc}</p>
      <p>Status: ${status}</p>
    `;

    div.addEventListener("click", () => {
      selectMesa.value = mesa._id;
      mostrarMensagem(`Mesa ${mesa.numMesa} selecionada para reserva.`);
      window.scrollTo({
        top: formReserva.offsetTop - 30,
        behavior: "smooth",
      });
    });

    mapaMesas.appendChild(div);
  });
}

function renderizarReservas() {
  listaReservas.innerHTML = "";

  if (reservas.length === 0) {
    listaReservas.innerHTML = "<p>Nenhuma reserva encontrada.</p>";
    return;
  }

  reservas.forEach((reserva) => {
    const mesaTexto = reserva.mesa
      ? `Mesa ${reserva.mesa.numMesa}`
      : "Mesa não encontrada";

    const div = document.createElement("div");
    div.className = "reserva-item";

    div.innerHTML = `
      <h3>${reserva.nomeCliente}</h3>
      <p><strong>Telefone:</strong> ${reserva.telCliente}</p>
      <p><strong>Mesa:</strong> ${mesaTexto}</p>
      <p><strong>Pessoas:</strong> ${reserva.quantPessoa}</p>
      <p><strong>Início:</strong> ${formatarData(reserva.horaInicio)}</p>
      <p><strong>Fim:</strong> ${formatarData(reserva.horaFim)}</p>
      <p><strong>Status:</strong> ${reserva.status}</p>
      <p><strong>Observações:</strong> ${reserva.obs || "Nenhuma"}</p>

      <div class="acoes">
        ${
          reserva.status !== "Cancelado" && reserva.status !== "Finalizado"
            ? `<button class="btn-cancelar" onclick="cancelarReserva('${reserva._id}')">Cancelar</button>`
            : ""
        }
      </div>
    `;

    listaReservas.appendChild(div);
  });
}

formMesa.addEventListener("submit", async (event) => {
  event.preventDefault();

  const mesa = {
    numMesa: Number(document.getElementById("numMesa").value),
    capacidade: Number(document.getElementById("capacidade").value),
    loc: document.getElementById("loc").value,
  };

  try {
    const resposta = await fetch(`${API_URL}/mesas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mesa),
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      throw new Error(dados.message);
    }

    mostrarMensagem(dados.message || "Mesa cadastrada com sucesso.");
    formMesa.reset();

    await carregarMesas();
    await carregarReservas();
  } catch (error) {
    mostrarMensagem(error.message, "erro");
  }
});

formReserva.addEventListener("submit", async (event) => {
  event.preventDefault();

  const reserva = {
  nomeCliente: document.getElementById("nomeCliente").value,
  telCliente: document.getElementById("telCliente").value,
  mesa: document.getElementById("mesa").value,
  quantPessoa: Number(document.getElementById("quantPessoa").value),
  horaInicio: document.getElementById("horaInicio").value,
  obs: document.getElementById("obs").value,
};

  try {
    const resposta = await fetch(`${API_URL}/reservas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reserva),
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      throw new Error(dados.message);
    }

    mostrarMensagem(dados.message || "Reserva criada com sucesso.");
    formReserva.reset();

    await carregarReservas();
  } catch (error) {
    mostrarMensagem(error.message, "erro");
  }
});

async function cancelarReserva(id) {
  try {
    const resposta = await fetch(`${API_URL}/reservas/${id}/cancelar`, {
      method: "PATCH",
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      throw new Error(dados.message);
    }

    mostrarMensagem(dados.message || "Reserva cancelada com sucesso.");

    await carregarReservas();
  } catch (error) {
    mostrarMensagem(error.message, "erro");
  }
}

document.getElementById("btn-filtrar").addEventListener("click", carregarReservas);

document.getElementById("btn-limpar").addEventListener("click", async () => {
  document.getElementById("filtroCliente").value = "";
  document.getElementById("filtroMesa").value = "";
  document.getElementById("filtroData").value = "";
  document.getElementById("filtroStatus").value = "";

  await carregarReservas();
});

async function iniciar() {
  await carregarMesas();
  await carregarReservas();
}

iniciar();