const express = require('express'); // Importa o Express
const app = express(); // Cria uma instância do aplicativo Express
const pool = require('./db')
const authRoutes = require('./src/routes/authRoutes')
const postRoutes = require('./src/routes/postRoutes')
const commentRoutes = require('./src/routes/commentRoutes')
const userRoutes = require('./src/routes/userRoutes')
const uploadRoutes = require('./src/routes/uploadRoutes')
const path = require('path')
const cors = require('cors')
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.use('/upload', express.static(path.join(__dirname, 'upload')))
app.use('/api/auth', authRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/comments', commentRoutes)
app.use('/api/users', userRoutes)
app.use('/api/upload', uploadRoutes)

app.get('/', (req, res) => {
    res.send('Bem vindo à API')
})

app.listen(PORT, () => {
    console.log(`Servidor rodando OK`)
    console.log(`Servidor rodando na porta ${PORT}`)
})