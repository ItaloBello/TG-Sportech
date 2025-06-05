// Conecta no Banco
const Sequelize = require('sequelize');
const sequelize = require('../database');
const Time = require('./Time');
const Campeonato = require('./Campeonato');

// Model para inscrição de times em campeonatos
const TimeCampeonato = sequelize.define('time_campeonato', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    timeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'times',
            key: 'id'
        }
    },
    campeonatoId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'campeonatos',
            key: 'id'
        }
    },
    dataPagamento: {
        type: Sequelize.DATE,
        allowNull: true
    },
    statusPagamento: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'pendente' // pendente, confirmado, rejeitado
    }
}, {
    timestamps: true
});

// Definindo associações
Time.belongsToMany(Campeonato, { through: TimeCampeonato });
Campeonato.belongsToMany(Time, { through: TimeCampeonato });

module.exports = TimeCampeonato;
