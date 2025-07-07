import axios from 'axios'
//npm i axios

const API_BASE_URL = 'http://localhost:3001/api'
//se estiver rodando em um celular ou emulador terá que modificar
//localhost não funcionará, precisará do IP da máquina
//EX.: http://192.168.1.XX:3001

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

export default api