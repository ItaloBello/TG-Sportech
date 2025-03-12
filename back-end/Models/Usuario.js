// Conecta no Banco
const Sequelize = require('sequelize')
const sequelize = require('../database')

//Model(tabela sem comando sql) - Usuarios
const Usuario = sequelize.define('usuarios',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nome: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
        
    },
    eAdmin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false 

    },
    endereco: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    documento: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    senha: {
        type: Sequelize.CHAR(60),
        allowNull: false
    },
    data_nascimento: {
        type: Sequelize.DATE,
        allowNull: false
    },
    data_criacao: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false
    }
}, {
    timestamps: false 
})

module.exports = Usuario;