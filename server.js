const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
app.use(express.json());

const SECRET_KEY = 'minecraft_secret';

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'steve' && password === 'creeper') {
        const token = jwt.sign({ username, role: 'user' }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).json({ error: 'Неверные данные' });
    }
});

app.get('/api/protected', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Нет токена' });
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        res.json({ message: 'Это секретные данные', user: decoded });
    } catch {
        res.status(401).json({ error: 'Недействительный токен' });
    }
});

app.listen(3000, () => console.log('Сервер запущен на порту 3000'));