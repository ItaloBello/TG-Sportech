// Conecta no Banco
const Sequelize = require('sequelize')
const sequelize = require('../database')

//Model(tabela sem comando sql) - Usuarios
const Time = sequelize.define('times',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nome: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    img: {
        type: Sequelize.STRING,
        required: false
    },
    userId: {
        type: Sequelize.INTEGER,
        required: true
    },
    cor_primaria: {
        type: Sequelize.STRING,
        required: true
    },
    cor_secundaria: {
        type: Sequelize.STRING,
        required: true
    },
    invite_code: {
        type: Sequelize.STRING,
        required: true
    },
    data_criacao: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false
    }
}, {
    timestamps: false 
})

module.exports = Time;
