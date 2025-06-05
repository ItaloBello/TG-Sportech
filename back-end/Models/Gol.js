// Conecta no Banco
const Sequelize = require('sequelize');
const sequelize = require('../database');
const Partida = require('./Partida');
const Usuario = require('./Usuario');
const Time = require('./Time');

// Model para gols marcados nas partidas (para artilharia)
const Gol = sequelize.define('gol', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    partidaId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'partidas',
            key: 'id'
        }
    },
    jogadorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'usuarios',
            key: 'id'
        }
    },
    timeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'times',
            key: 'id'
        }
    },
    quantidade: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
    }
}, {
    timestamps: true
});

// Definindo associações
Gol.belongsTo(Partida);
Partida.hasMany(Gol);

Gol.belongsTo(Usuario, { as: 'jogador', foreignKey: 'jogadorId' });
Gol.belongsTo(Time);

module.exports = Gol;
