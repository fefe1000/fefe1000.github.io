'use strict'

const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}


const getLocalStorage = () => JSON.parse(localStorage.getItem('db_viagem')) ?? []
const setLocalStorage = (dbviagem) => localStorage.setItem("db_viagem", JSON.stringify(dbviagem))

// CRUD - create read update delete
const deleteviagem = (index) => {
    const dbviagem = readviagem()
    dbviagem.splice(index, 1)
    setLocalStorage(dbviagem)
}

const updateviagem = (index, viagem) => {
    const dbviagem = readviagem()
    dbviagem[index] = viagem
    setLocalStorage(dbviagem)
}

const readviagem = () => getLocalStorage()

const createviagem = (viagem) => {
    const dbviagem = getLocalStorage()
    dbviagem.push (viagem)
    setLocalStorage(dbviagem)
}

const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}

//Interação com o layout

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
    document.getElementById('id_embar').dataset.index = 'new'
    document.querySelector(".modal-header>h2").textContent  = 'Nova Viagem'
}

const saveviagem = () => {
    if (isValidFields()) {
        const viagem = {
            id_embar: document.getElementById('id_embar').value,
            tamanho: document.getElementById('tamanho').value,
            destino: document.getElementById('destino').value,
            duracao: document.getElementById('duracao').value
        }
        const index = document.getElementById('id_embar').dataset.index
        if (index == 'new') {
            createviagem(viagem)
            updateTable()
            closeModal()
        } else {
            updateviagem(index, viagem)
            updateTable()
            closeModal()
        }
    }
}

const createRow = (viagem, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${viagem.id_embar}</td>
        <td>${viagem.tamanho}</td>
        <td>${viagem.destino}</td>
        <td>${viagem.duracao}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}" >Excluir</button>
        </td>
    `
    document.querySelector('#tableviagem>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tableviagem>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
    const dbviagem = readviagem()
    clearTable()
    dbviagem.forEach(createRow)
}

const fillFields = (viagem) => {
    document.getElementById('id_embar').value = viagem.id_embar
    document.getElementById('tamanho').value = viagem.tamanho
    document.getElementById('destino').value = viagem.destino
    document.getElementById('duracao').value = viagem.duracao
    document.getElementById('id_embar').dataset.index = viagem.index
}

const editviagem = (index) => {
    const viagem = readviagem()[index]
    viagem.index = index
    fillFields(viagem)
    document.querySelector(".modal-header>h2").textContent  = `Editando ${viagem.id_embar}`
    openModal()
}

const editDelete = (event) => {
    if (event.target.type == 'button') {

        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            editviagem(index)
        } else {
            const viagem = readviagem()[index]
            const response = confirm(`Deseja realmente excluir o registro de viagem ${viagem.id_embar}`)
            if (response) {
                deleteviagem(index)
                updateTable()
            }
        }
    }
}

updateTable()

// Eventos
document.getElementById('cadastrarviagem')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('salvar')
    .addEventListener('click', saveviagem)

document.querySelector('#tableviagem>tbody')
    .addEventListener('click', editDelete)

document.getElementById('cancelar')
    .addEventListener('click', closeModal)