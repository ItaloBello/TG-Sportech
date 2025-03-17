require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const sequelize = require('./database');
const adminRoute = require('./Routes/admin');
const userRoute = require('./Routes/usuario');
const cors = require('cors'); // Novo módulo para CORS
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
require('./Config/auth')(passport);

// Iniciar o servidor
const PORT = 8081;

// Configuração do CORS
app.use(cors());

// Configuração da sessão
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Middleware para mensagens de flash
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error')[0]; 
    res.locals.user = req.user || null;
    next();
});

// Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Conexão com o banco de dados e sincronização de tabelas
sequelize.authenticate()
    .then(() => {
        console.log(`Conexão com o MySQL estabelecida com sucesso na porta ${PORT}.`);
        return sequelize.sync(); // Sincroniza as tabelas automaticamente
    })
    .then(() => {
        console.log("Tabelas sincronizadas com sucesso.");
    })
    .catch(error => {
        console.error("Erro ao conectar ou sincronizar tabelas:", error);
    });

// Rotas da API
app.use('/api/admin', adminRoute);
app.use('/api/jogador', userRoute);

// Rota inicial
app.get('/', (req, res) => {
    res.json({ message: "Bem-vindo ao backend da sportech" });
});

// Logout
app.get("/logout", (req, res) => {
    req.session.destroy();
});

app.listen(PORT, () => {
    console.log("Servidor rodando na porta " + PORT);
});
