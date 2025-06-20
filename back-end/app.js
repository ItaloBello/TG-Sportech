require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const sequelize = require('./database');
const adminRoute = require('./Routes/admin');
const userRoute = require('./Routes/usuario');
const campeonatoRoute = require('./Routes/campeonato');
const amistosoRoute = require('./Routes/amistoso');
const cors = require('cors'); // Novo módulo para CORS
// Importar associações entre modelos
const associations = require('./Models/associations');
const campeonatoAssociations = require('./Models/campeonatoAssociations');
const session = require('express-session');
const flash = require('connect-flash');
const upload = require('./Helpers/upload'); //Rota para o Cloudnary
const passport = require('passport');
const path = require('path');
require('./Config/auth')(passport);

// Iniciar o servidor
const PORT = 8081;

// Configuração do CORS
app.use(cors());

// Configuração da sessão
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

// Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
// Servir arquivos estáticos da pasta uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware para mensagens de flash
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error')[0]; 
    res.locals.user = req.user || null;
    next();
});


// Conexão com o banco de dados e sincronização de tabelas
sequelize.authenticate()
    .then(() => {
        console.log(`Conexão com o MySQL estabelecida com sucesso na porta ${PORT}.`);
        return sequelize.sync({ alter: true }); // Sincroniza as tabelas, aplicando alterações como novas colunas
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
app.use('/api/campeonato', campeonatoRoute);
app.use('/api/amistoso', amistosoRoute);

// Rota inicial

app.get('/', (req, res) => {
    res.json({ message: "Bem-vindo ao backend da sportech" });
});

// Logout
app.get("/logout", (req, res) => {
    req.session.destroy();
});

// TODO criar um botão para testar o cloudnary no registro de time
// Cloudnary para salvar as imagens do jogador
app.post('/upload', upload.single('image'), (req, res) => {
  try {
    return res.json({ imageUrl: req.file.path }); // URL da imagem
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao enviar imagem' });
  }
});



app.listen(PORT, () => {
    console.log("Servidor rodando na porta " + PORT);
});

const listEndpoints = require('express-list-endpoints');

console.log("ROTAS DISPONÍVEIS:");
console.table(listEndpoints(app));

