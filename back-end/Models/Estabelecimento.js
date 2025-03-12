// Conecta no Banco
const Sequelize = require('sequelize')
const sequelize = require('../database')
const Usuario = require('../Models/Usuario');
const DonoQuadra = require('./DonoQuadra');

//Model(tabela sem comando sql) - Usuarios
const Estabelecimento = sequelize.define('estabelecimento',{
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
    cep: {
        type: Sequelize.STRING(14),
        allowNull: false
        
    },
    rua: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    bairro: {
        type: Sequelize.STRING(100),
        allowNull: false,
    },
    numero: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    cidade_estado: {
        type: Sequelize.STRING(100),
        allowNull: false,
    },
    hora_inicio: {
        type: Sequelize.TIME,
        allowNull: false
    },
    hora_fim: {
        type: Sequelize.TIME,
        allowNull: false
    }
}, {
    timestamps: true 
})

Estabelecimento.belongsTo(DonoQuadra);
DonoQuadra.hasMany(Estabelecimento);

module.exports = Estabelecimento;