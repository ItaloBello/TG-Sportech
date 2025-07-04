// Conecta no Banco
const Sequelize = require('sequelize')
const sequelize = require('../database')

//Model(tabela sem comando sql) - Usuarios
const JogadorTime = sequelize.define('jogador_time',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    jogadorId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    timeId: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
}, {
    timestamps: true 
})

module.exports = JogadorTime;