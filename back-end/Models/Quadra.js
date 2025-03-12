// Conecta no Banco
const Sequelize = require('sequelize')
const sequelize = require('../database')
const Usuario = require('../Models/Usuario');
const DonoQuadra = require('./DonoQuadra');

//Model(tabela sem comando sql) - Usuarios
const Quadra = sequelize.define('quadra',{
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
    tipo: {
        type: Sequelize.STRING(100),
        allowNull: false
        
    },
    meioSlot: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    porcSinal: {
        type: Sequelize.DECIMAL,
        allowNull: false,
    },
    data_criacao: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false
    }
}, {
    timestamps: false 
})

Quadra.belongsTo(DonoQuadra);
DonoQuadra.hasMany(Quadra);

module.exports = Quadra;