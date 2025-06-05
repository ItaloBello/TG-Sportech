// Conecta no Banco
const Sequelize = require('sequelize')
const sequelize = require('../database')
const DonoQuadra = require('./DonoQuadra');
const Quadra = require('./Quadra');

//Model(tabela sem comando sql) - Usuarios
const Campeonato = sequelize.define('campeonato',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nome: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
    },
    registro: {
        type: Sequelize.DECIMAL,
        allowNull: false,
    },
    data_inicio: {
        type: Sequelize.DATE,
        allowNull: false
    },
    num_times: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    descricao: {
        type: Sequelize.STRING,
        allowNull: false
    },
    premiacao: {
        type: Sequelize.DECIMAL,
        allowNull: false
    },
    status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "não iniciado"
    }
}, {
    timestamps: false 
})

Campeonato.belongsTo(DonoQuadra);
DonoQuadra.hasMany(Campeonato);

module.exports = Campeonato;