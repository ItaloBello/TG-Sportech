// Conecta no Banco
const Sequelize = require('sequelize');
const sequelize = require('../database');

//Model(tabela sem comando sql) - Usuarios
const Agendamento = sequelize.define('agendamentos',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    idJogador: {
        type: Sequelize.BIGINT,
        allowNull: false
    },
    idQuadra: {
        type: Sequelize.BIGINT,
        allowNull: false,
    },
    horaInicio: {
        type: Sequelize.TIME,
        allowNull: false
    },
    horaFim: {
        type: Sequelize.TIME,
        allowNull: false
    },
    data: {
        type: Sequelize.DATE
    },
    pago: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    tipo: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    timestamps: true 
})

module.exports = Agendamento;
