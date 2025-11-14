// Constantes da API
const API_URL = 'https://v6.exchangerate-api.com/v6/';
// Substitua "SUA_CHAVE_AQUI" pela sua chave de API.
// Você pode obter uma chave gratuita aqui: https://www.exchangerate-api.com/
// Nota: Se usar a chave "demo", ela só funciona para taxas baseadas em USD.
const API_KEY = 'SUA_CHAVE_AQUI'; 

// Elementos do DOM
const quantidadeInput = document.getElementById('quantidade');
const origemSelect = document.getElementById('origem');
const destinoSelect = document.getElementById('destino');
const converterBtn = document.getElementById('converterBtn');
const resultadoDiv = document.getElementById('resultado');
const iconeTroca = document.querySelector('.icone-troca');

// --- 1. Funções de Inicialização e População ---

async function fetchCurrencies() {
    // Busca códigos de moedas baseados em uma moeda padrão (ex: USD)
    const url = `${API_URL}${API_KEY}/latest/USD`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erro de rede: ${response.status}`);
        }
        const data = await response.json();
        
        // As chaves do objeto 'conversion_rates' são os códigos das moedas
        const currencies = Object.keys(data.conversion_rates); 
        populateSelects(currencies);
    } catch (error) {
        console.error("Erro ao buscar moedas:", error);
        resultadoDiv.innerHTML = 'Erro ao carregar moedas. Verifique sua chave API ou conexão.';
    }
}

function populateSelects(currencies) {
    currencies.forEach(currency => {
        // Cria uma tag <option> para cada moeda
        const optionOrigem = document.createElement('option');
        optionOrigem.value = currency;
        optionOrigem.textContent = currency;

        const optionDestino = optionOrigem.cloneNode(true);
        
        origemSelect.appendChild(optionOrigem);
        destinoSelect.appendChild(optionDestino);
    });

    // Define valores padrão (ex: BRL -> USD)
    origemSelect.value = 'USD';
    destinoSelect.value = 'BRL';
}


// --- 2. Função de Conversão Principal ---

async function converterMoeda() {
    const quantidade = parseFloat(quantidadeInput.value);
    const origem = origemSelect.value;
    const destino = destinoSelect.value;

    if (isNaN(quantidade) || quantidade <= 0) {
        resultadoDiv.innerHTML = 'Por favor, insira uma quantia válida.';
        return;
    }

    resultadoDiv.innerHTML = 'Carregando...';

    // URL para buscar a taxa específica da moeda de origem
    const url = `${API_URL}${API_KEY}/pair/${origem}/${destino}/${quantidade}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erro ao buscar taxa. Código: ${response.status}`);
        }
        const data = await response.json();
        
        // O resultado da conversão já vem calculado na propriedade 'conversion_result'
        const resultado = data.conversion_result; 

        if (resultado) {
            resultadoDiv.innerHTML = 
                `${quantidade.toFixed(2)} ${origem} = 
                **${resultado.toFixed(2)} ${destino}**`;
        } else {
            resultadoDiv.innerHTML = 'Não foi possível obter a taxa de conversão.';
        }
        
    } catch (error) {
        console.error("Erro na conversão:", error);
        resultadoDiv.innerHTML = 'Erro na conversão. Tente novamente mais tarde.';
    }
}

// --- 3. Event Listeners ---

function trocarMoedas() {
    const temp = origemSelect.value;
    origemSelect.value = destinoSelect.value;
    destinoSelect.value = temp;
    // Após a troca, converte automaticamente
    converterMoeda(); 
}

// Inicializa a busca das moedas quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    fetchCurrencies();
});

// Listener do botão de conversão
converterBtn.addEventListener('click', converterMoeda);

// Listener do ícone de troca
iconeTroca.addEventListener('click', trocarMoedas);