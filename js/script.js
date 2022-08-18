const base_url = 'https://viacep.com.br/ws';

const table = document.getElementById('enderecos-tbody');
const form_cep = document.getElementById('form-cep');
const cep = document.getElementById('cep');
const table_body = document.getElementById('enderecos-tbody');
const clear_btn = document.getElementById('btn-clean');

let address_list = JSON.parse(localStorage.getItem('address_list'));

function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return JSON.parse(xmlHttp.responseText);
}

function build_table(address) {
    let row = table_body.insertRow();

    let cep_cell = row.insertCell();
    let address_cell = row.insertCell();
    let neighborhood_cell = row.insertCell();
    let city_cell = row.insertCell();

    cep_cell.appendChild(document.createTextNode(address['cep']));
    address_cell.appendChild(document.createTextNode(address['logradouro']));
    neighborhood_cell.appendChild(document.createTextNode(address['bairro']));
    city_cell.appendChild(document.createTextNode(address['cidade']));
}

clear_btn.onclick = function () {
    while(address_list.length > 0) {
        address_list.pop();
    }
    localStorage.removeItem('address_list');
    while (table_body.children.length > 0) {
        table_body.children[0].remove();
    }
}

form_cep.onsubmit = function (event) {
    event.preventDefault();

    let request_url = `${base_url}/${cep.value}/json`;
    let address = httpGet(request_url);
    if (address['error'] !== undefined) {
        alert('Invalid cep');
        return;
    }
    cleaned_address = {
        cep: address['cep'],
        logradouro: address['logradouro'],
        bairro: address['bairro'],
        cidade: `${address['localidade']}/${address['uf']}`
    }
    if (check_if_cep_exists(address['cep'])) {
        return;
    }
    address_list.push(cleaned_address);
    localStorage.setItem('address_list', JSON.stringify(address_list));
    build_table(cleaned_address);
}

function check_if_cep_exists(cep) {
    const found = address_list.some(el => el.cep === cep);
    return found;
}

if (address_list == null) {
    address_list = []
} else {
    address_list.forEach(item => build_table(item));
}
