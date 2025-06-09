// Conecta no Banco
const Sequelize = require('sequelize');
const sequelize = require('../database');
const Time = require('./Time');
const Campeonato = require('./Campeonato');
const Quadra = require('./Quadra');

// Model para partidas de campeonatos
const Partida = sequelize.define('partida', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    campeonatoId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'campeonatos',
            key: 'id'
        }
    },
    timeAId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'times',
            key: 'id'
        }
    },
    timeBId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'times',
            key: 'id'
        }
    },
    quadraId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: 'quadras',
            key: 'id'
        }
    },
    data: {
        type: Sequelize.DATEONLY,
        allowNull: true
    },
    hora: {
        type: Sequelize.TIME,
        allowNull: true
    },
    golsTimeA: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    golsTimeB: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    fase: {
        type: Sequelize.STRING,
        allowNull: false,
        // grupo, oitavas, quartas, semi, final
    },
    status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'agendado' // agendado, finalizado
    }
}, {
    timestamps: true
});

// Definindo associações
Partida.belongsTo(Campeonato);
Campeonato.hasMany(Partida);

Partida.belongsTo(Time, { as: 'timeA', foreignKey: 'timeAId' });
Partida.belongsTo(Time, { as: 'timeB', foreignKey: 'timeBId' });

Partida.belongsTo(Quadra);
Quadra.hasMany(Partida);

module.exports = Partida;
