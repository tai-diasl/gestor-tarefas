const lista = document.querySelector("#lista") as HTMLOListElement;

const input = document.querySelector("#newTask") as HTMLInputElement;
const inputPesquisa = document.querySelector("#pesquisa") as HTMLInputElement;

const btnAdicionar = document.querySelector("#btnAdicionar") as HTMLButtonElement;
const btnOrdenar = document.querySelector("#btnOrdenar") as HTMLButtonElement;
const btnLimpar = document.querySelector("#btnLimpar") as HTMLButtonElement;

const selectCategoria = document.querySelector("#categoria") as HTMLSelectElement;

const contador = document.querySelector("#contador") as HTMLParagraphElement;
const alertaPendentes = document.querySelector("#alertaPendentes") as HTMLParagraphElement;
const msgAlerta = document.querySelector("#msgAlerta") as HTMLParagraphElement;


type Categoria = 'Trabalho' | 'Pessoal' | 'Estudo';


interface Tarefa {
  id: number;
  titulo: string;
  concluida: boolean;
  dataConclusao?: Date;
  categoria: Categoria;
  marcarConcluida(): void;
}


class TarefaClass implements Tarefa {
  id: number;
  titulo: string;
  concluida: boolean;
  dataConclusao?: Date;
  categoria: Categoria;

  constructor(id: number, titulo: string, categoria: Categoria) {
    this.id = id;
    this.titulo = titulo;
    this.concluida = false;
    this.categoria = categoria;
  }

  marcarConcluida() {
    this.concluida = !this.concluida;
    this.dataConclusao = this.concluida ? new Date() : undefined;
  }
}


let listaTarefas: Tarefa[] = [];

listaTarefas = [
  new TarefaClass(1, "Estudar TypeScript", "Estudo"),
  new TarefaClass(3, "Compras da semana", "Pessoal")
];



function adicionarTarefa() {
  const inputValue = input.value.trim();
  const categoriaSelecionada = selectCategoria.value as Categoria;
  if (inputValue === "") {
    msgAlerta.textContent = "[ATENÇÃO] Preencha a tarefa";
    return;
  }

  if (inputValue.length < 3) {
    msgAlerta.textContent = "[ATENÇÃO] Mínimo de 3 caracteres";
    return;
  }

  const novaTarefa = new TarefaClass(Date.now(), inputValue, categoriaSelecionada);
  listaTarefas.push(novaTarefa);

  input.value = "";
  inputPesquisa.value = "";
  msgAlerta.textContent = "";
  renderizarListaFiltrada(inputPesquisa.value);
}


function remover(id: number) {
  listaTarefas = listaTarefas.filter(tarefa => tarefa.id !== id);
  renderizarListaFiltrada(inputPesquisa.value);
}


function editar(id: number) {
  const tarefa = listaTarefas.find(t => t.id === id);
  if (!tarefa) {
    return
  };

  const novoTitulo = prompt("Editar tarefa:", tarefa.titulo);
  if (!novoTitulo || novoTitulo.trim() === "") {
    return
  };

  tarefa.titulo = novoTitulo;
  renderizarListaFiltrada(inputPesquisa.value);
}


function atualizarContador(tarefas: Tarefa[]) {
  const pendentes = tarefas.filter(tarefa => !tarefa.concluida);
  contador.textContent = `Pendentes: ${pendentes.length}`;

  if (pendentes.length >= 5) {
    alertaPendentes.textContent = "Isto já virou uma bola de neve 😧";
  } else if (pendentes.length >= 3) {
    alertaPendentes.textContent = "ATENÇÃO: Está começando a descontrolar...";
  } else if (pendentes.length >= 1) {
    alertaPendentes.textContent = "Tudo está sob controle!";
  } else {
    alertaPendentes.textContent = "";
  }
}


function renderizarListaFiltrada(filtro: string) {
  lista.innerHTML = "";

  const tarefasFiltradas = listaTarefas.filter(tarefa =>
    tarefa.titulo.toLowerCase().includes(filtro.toLowerCase())
  );

  tarefasFiltradas.forEach(tarefa => {
    const li = document.createElement("li");
    
    const categoriaSpan = document.createElement("span");
    categoriaSpan.textContent = tarefa.categoria;
    categoriaSpan.style.fontWeight = "bold";

    switch(tarefa.categoria) {
      case 'Trabalho':
        categoriaSpan.style.color = "green";
        break;
      case 'Pessoal':
        categoriaSpan.style.color = "blueviolet";
        break;
      case 'Estudo':
        categoriaSpan.style.color = "orange";
        break;
    }
    li.appendChild(categoriaSpan);

    const tituloSpan = document.createElement("span");
    tituloSpan.textContent = tarefa.titulo;

    if (tarefa.concluida) {
      tituloSpan.classList.add("concluida");
    }
    li.appendChild(tituloSpan);

    if (tarefa.concluida && tarefa.dataConclusao) {
      const dataSpan = document.createElement("small");
      const data = tarefa.dataConclusao;
      const dia = String(data.getDate()).padStart(2, "0");
      const mes = String(data.getMonth() + 1).padStart(2, "0");
      const hora = String(data.getHours()).padStart(2, "0");
      const minuto = String(data.getMinutes()).padStart(2, "0");

      dataSpan.textContent = ` (Concluída em: ${dia}/${mes} ${hora}:${minuto})`;
      dataSpan.style.marginLeft = "8px";
      dataSpan.style.color = "#666";

      li.appendChild(dataSpan);
    }


    const divBotoes = document.createElement("div");

    const btnConcluir = document.createElement("button");
    btnConcluir.textContent = tarefa.concluida ? "Desmarcar" : "Concluir";
    btnConcluir.classList.add("btnEditar");
    btnConcluir.addEventListener('click', () => {
      tarefa.marcarConcluida();
      renderizarListaFiltrada(inputPesquisa.value);
    });

    const btnEditar = document.createElement("button");
    btnEditar.textContent = "Editar";
    btnEditar.classList.add("btnEditar");
    btnEditar.addEventListener('click', () => {
      editar(tarefa.id);
      renderizarListaFiltrada(inputPesquisa.value);
    });

    const btnRemover = document.createElement("button");
    btnRemover.textContent = "Remover";
    btnRemover.classList.add("btnRemover");
    btnRemover.addEventListener('click', () => {
      const resposta = confirm(`Tens a certeza de que desejas remover a tarefa '${tarefa.titulo}'?`);

      if (resposta) {
        remover(tarefa.id);
        renderizarListaFiltrada(inputPesquisa.value);
      } else {
        return;
      }
    });


    divBotoes.appendChild(btnConcluir);
    divBotoes.appendChild(btnEditar);
    divBotoes.appendChild(btnRemover);

    li.appendChild(document.createElement("br"));
    li.appendChild(divBotoes);

    lista.appendChild(li);
  });
  atualizarContador(tarefasFiltradas);
}


btnAdicionar.addEventListener('click', adicionarTarefa);
btnOrdenar.addEventListener('click', () => {
  listaTarefas.sort((a, b) => a.titulo.localeCompare(b.titulo));
  inputPesquisa.value = ""
  renderizarListaFiltrada("");
});

btnLimpar.addEventListener('click', () => {
  listaTarefas = listaTarefas.filter(tarefa => !tarefa.concluida);
  inputPesquisa.value = ""
  renderizarListaFiltrada("");
});

inputPesquisa.addEventListener('input', () => {
  renderizarListaFiltrada(inputPesquisa.value);
});


renderizarListaFiltrada("");