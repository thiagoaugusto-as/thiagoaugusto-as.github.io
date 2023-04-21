class MalhaRodoviaria {
  constructor() {
    this.cidades = new Map(); // Mapa de cidades (vértices) (nomeCidade -> objeto)
  }

  registrarNovaCidade(nome, distancia) {
    this.cidades.set(nome, {
      nomeCidade: nome,
      distanciaParaBucarest: distancia,
      distancias: new Set(),
    });
  }

  registrarDistancia(valores) {
    const origem = this.cidades.get(valores.nomeCidadeOrigem);
    const destino = this.cidades.get(valores.nomeCidadeDestino);
    origem.distancias.add({
      origem: origem,
      destino: destino,
      distanciaEntreCidades: valores.distanciaEntreCidades,
    });
    destino.distancias.add({ // Adicionando aresta reversa (Pois o mapa é um grafo não direcionado)
      origem: destino,
      destino: origem,
      distanciaEntreCidades: valores.distanciaEntreCidades,
    }); 
  }

  getCidade(nome) {
    return this.cidades.get(nome);
  }

  getMalhaRodoviaria() {
    return Array.from(this.cidades.values());
  }
}

const citiesAndDistances = [
  {
    cidadeOrigem: "Oradea",
    conexoes: [
      { cidadeDestino: "Zerind", distancia: 71 },
      { cidadeDestino: "Sibiu", distancia: 151 },
    ],
  },
  {
    cidadeOrigem: "Arad",
    conexoes: [
      { cidadeDestino: "Zerind", distancia: 75 },
      { cidadeDestino: "Timisoara", distancia: 118 },
      { cidadeDestino: "Sibiu", distancia: 140 },
    ],
  },
  {
    cidadeOrigem: "Lugoj",
    conexoes: [
      { cidadeDestino: "Timisoara", distancia: 111 },
      { cidadeDestino: "Mehadia", distancia: 70 },
    ],
  },
  {
    cidadeOrigem: "Drobeta",
    conexoes: [
      { cidadeDestino: "Mehadia", distancia: 75 },
      { cidadeDestino: "Craiova", distancia: 120 },
    ],
  },
  {
    cidadeOrigem: "Rumnicu Vilcea",
    conexoes: [
      { cidadeDestino: "Sibiu", distancia: 80 },
      { cidadeDestino: "Craiova", distancia: 146 },
      { cidadeDestino: "Pitesti", distancia: 97 },
    ],
  },
  {
    cidadeOrigem: "Pitesti",
    conexoes: [
      { cidadeDestino: "Craiova", distancia: 138 },
      { cidadeDestino: "Bucharest", distancia: 101 },
    ],
  },
  {
    cidadeOrigem: "Fagaras",
    conexoes: [
      { cidadeDestino: "Sibiu", distancia: 99 },
      { cidadeDestino: "Bucharest", distancia: 211 },
    ],
  },
  {
    cidadeOrigem: "Giurgiu",
    conexoes: [{ cidadeDestino: "Bucharest", distancia: 90 }],
  },
  {
    cidadeOrigem: "Urziceni",
    conexoes: [
      { cidadeDestino: "Bucharest", distancia: 85 },
      { cidadeDestino: "Vaslui", distancia: 142 },
      { cidadeDestino: "Hirsova", distancia: 98 },
    ],
  },
  {
    cidadeOrigem: "Eforie",
    conexoes: [{ cidadeDestino: "Hirsova", distancia: 86 }],
  },
  {
    cidadeOrigem: "Iasi",
    conexoes: [
      { cidadeDestino: "Neamt", distancia: 87 },
      { cidadeDestino: "Vaslui", distancia: 92 },
    ],
  },
];

const cidades = [
  { cidade: "Arad", distancia: 366 },
  { cidade: "Bucharest", distancia: 0 },
  { cidade: "Craiova", distancia: 160 },
  { cidade: "Drobeta", distancia: 242 },
  { cidade: "Eforie", distancia: 161 },
  { cidade: "Fagaras", distancia: 176 },
  { cidade: "Giurgiu", distancia: 77 },
  { cidade: "Hirsova", distancia: 151 },
  { cidade: "Iasi", distancia: 226 },
  { cidade: "Lugoj", distancia: 244 },
  { cidade: "Mehadia", distancia: 241 },
  { cidade: "Neamt", distancia: 234 },
  { cidade: "Oradea", distancia: 380 },
  { cidade: "Pitesti", distancia: 100 },
  { cidade: "Rumnicu Vilcea", distancia: 193 },
  { cidade: "Sibiu", distancia: 253 },
  { cidade: "Timisoara", distancia: 329 },
  { cidade: "Urziceni", distancia: 80 },
  { cidade: "Vaslui", distancia: 199 },
  { cidade: "Zerind", distancia: 374 },
];

const malhaRodoviaria = new MalhaRodoviaria();

// Cadastra as cidades (vértices)
for (const cidade of cidades) {
  const name = cidade.cidade;
  const distanciaParaBucarest = cidade.distancia;
  malhaRodoviaria.registrarNovaCidade(name, distanciaParaBucarest);
}

// Caddastra as distancias (arestas)
for (const sourceCity of citiesAndDistances) {
  const sourceName = sourceCity.cidadeOrigem;
  for (const connection of sourceCity.conexoes) {
    const destName = connection.cidadeDestino;
    const distance = connection.distancia;
    malhaRodoviaria.registrarDistancia({
      nomeCidadeOrigem: sourceName,
      nomeCidadeDestino: destName,
      distanciaEntreCidades: distance,
    });
  }
}

// Implementa a busca gulosa
function buscaGulosa(inicio) {
  const objetivo = "Bucharest";
  const fila = [inicio];

  // Inicializa o objeto de visitados
  const visitados = {};
  visitados[inicio] = true;

  while (fila.length > 0) {
    // Remove o primeiro nó da fila e o armazena em atual
    const atual = fila.shift();

    // Se o nó atual for o objetivo, retorna verdadeiro
    if (atual === objetivo) {
      return visitados;
    }

    // Recupera vizinhos da cidade atual
    const vizinhos = buscarCidadesVizinhas(atual);

    const vizinhosOrdenados = vizinhos.sort(
      (vizinho1, vizinho2) =>
        vizinho1.distanciaParaBucarest - vizinho2.distanciaParaBucarest
    );

    fila.push(vizinhosOrdenados[0].cidade);
    visitados[vizinhosOrdenados[0].cidade] = true;
  }

  return false;
}

function buscarCidadesVizinhas(nome) {
  const cidade = malhaRodoviaria.getCidade(nome);
  const vizinhos = Array.from(cidade.distancias);
  return vizinhos.map((vizinho) => {
    return {
      cidade: vizinho.destino.nomeCidade,
      distanciaParaBucarest: vizinho.destino.distanciaParaBucarest,
    };
  });
}

function executarBusca() {
  const texto = document.getElementById("texto").value;
  const lista = document.getElementById("valores");

  lista.innerHTML = "";

  const result = buscaGulosa(texto);

  for (city in result) {
    const item = document.createElement("li");
    item.innerText = city;
    lista.appendChild(item);
  }
}

document
  .getElementById("botao-submeter")
  .addEventListener("click", executarBusca);
