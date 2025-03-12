// Conecta no Banco
const Sequelize = require('sequelize')
const sequelize = require('../database')
const Quadra = require('../Models/Quadra');

//Model(tabela sem comando sql) - Usuarios
const Horario = sequelize.define('horarioQuadra',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    diaSemana: {
        type: Sequelize.STRING(100),
        allowNull: false
    },
    valorHora: {
        type: Sequelize.DECIMAL,
        allowNull: false,
    },
    horaInicio: {
        type: Sequelize.TIME,
        allowNull: false
    },
    horaFim: {
        type: Sequelize.TIME,
        allowNull: false
    }
}, {
    timestamps: false 
})

Horario.belongsTo(Quadra);
Quadra.hasMany(Horario);

module.exports = Horario;