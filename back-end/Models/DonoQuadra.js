// Conecta no Banco
const Sequelize = require('sequelize')
const sequelize = require('../database')

//Model(tabela sem comando sql) - Usuarios
const DonoQuadra = sequelize.define('donoQuadra',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
        
    },
    cpf: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: Sequelize.CHAR(60),
        allowNull: false
    },
}, {
    timestamps: true 
})

module.exports = DonoQuadra;