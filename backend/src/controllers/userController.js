const pool = require('../../db')
const bcrypt = require('bcryptjs')
//npm i bcrypt
//para comparar senhas na edição
const jwt = require('jsonwebtoken')
//se for preciso atualizar o token após a mudança de dados

const jwtSecret = process.env.JWT_SECRET || 'senhajwt'

//obter as infos do usuário logado (usado no perfil)
exports.getMe = async (req, res) => {
    const userId = req.user.id //id vem do middleware

    try {
        const [rows] = await pool.query(
            'SELECT id, username, email, profile_picture_url, created_at FROM users WHERE id = ?', [userId]
        )
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado' })
        }
        //caso encontrado buscamos o primeiro índice do SELECT
        res.status(200).json(rows[0])
    } catch (error) {
        console.error('Erro ao buscar infos do usuário', error)
        res.status(500).json({ message: 'Erro interno do server' })
    }
}

exports.getMyPosts = async (req, res) => {
    const userId = req.user.id //id vem do middleware

    try {
        const [rows] = await pool.query(`
        SELECT 
            p.id, p.title, p.content, p.image_url, p.created_at, p.updated_at,
            u.id AS user_id, u.username, u.profile_picture_url,
            (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.id) AS likes_count,
            (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) AS comments_count,

        FROM posts p
        JOIN users u ON p.user_id = u.id
        WHERE p.user_id = ?
        ORDER BY p.created_at DESC
        `[userId])
        res.status(200).json(rows)
    } catch (error) {
        console.error('ocorreu um erro ao buscar posts', error)
        res.status(500).json({ message: 'Erro interno do servidor' })
    }
}

exports.getMyFavoritePosts = async (req, res) => {
    const userId = req.user.id //id vem do middleware

    try {
        const [rows] = await pool.query(`
        SELECT 
            p.id, p.title, p.content, p.image_url, p.created_at, p.updated_at,
            u.id AS user_id, u.username, u.profile_picture_url,
            (SELECT COUNT(*) FROM likes l WHERE l.post_id = p.id) AS likes_count,
            (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) AS comments_count,

        FROM posts p
        JOIN favorites f ON p.id = f.post_id
        JOIN users u ON p.user_id = u.id
        WHERE f.user_id = ?
        ORDER BY f.created_at DESC
        `[userId])
        res.status(200).json(rows)
    } catch (error) {
        console.error('ocorreu um erro ao buscar posts', error)
        res.status(500).json({ message: 'Erro interno do servidor' })
    }
}

exports.updateProfile = async (req, res) => {
    const userId = req.user.id //id vem do middleware
    const { username, email, old_password, new_password, profile_picture_url } = req.body //dados do body

    try {
        let updateQuery = 'UPDATE users SET '
        const updateValues = []
        const fieldsToUpdate = []

        //busca o isiario para verificar a senha antiga(se fornecida)

        const [users] = await pool.query('SELECT password FROM users WHERE id = ?', [userId])
        if (users.length === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado' })
        }
        const user = users[0]

        //verifica e atualiza o nome de isuario
        if (username && username.trim() !== '') {
            //verifica se o user ja existe
            const [exisistingUsername] = await pool.query('SELECT id FROM users WHERE username = ? AND id != ?', [username, userId])
            if (exisistingUsername.length > 0) {
                return res.status(409).json({ message: 'Nome de usuário já está em uso' })

            }
            fieldsToUpdate.push('username = ?')
            updateValues.push(username)
        }
        if (email && email.trim() !== '') {
            //verifica se o user ja existe
            const [exisistingEmail] = await pool.query('SELECT id FROM users WHERE email = ? AND id != ?', [email, userId])
            if (exisistingEmail.length > 0) {
                return res.status(409).json({ message: 'email já está em uso' })
    
            }
            fieldsToUpdate.push('email = ?')
            updateValues.push(email)
        }
    
    } catch (error) {
        console.error('Erro ao atualizar perfil:', error)
        res.status(500).json({ message: 'Erro interno do servidor' })
    }

}