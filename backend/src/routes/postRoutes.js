const pool = require('../../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const jwtScret = process.env.JWT_SECRET || 'senhajwt'

exports.getME = async (req, res) => {
    const userId = req.user.id;
    try {
        const [rows] = await pool.query
            ('SELECT id, username, email, profile_picture_url, created_at FROM users WHERE id = ?', [userId]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}