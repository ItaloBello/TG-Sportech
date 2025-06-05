// Conecta no Banco
const Sequelize = require('sequelize');
const sequelize = require('../database');
const Time = require('./Time');
const Quadra = require('./Quadra');

// Model para amistosos entre times
const Amistoso = sequelize.define('amistoso', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    timeDesafianteId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'times',
            key: 'id'
        }
    },
    timeDesafiadoId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'times',
            key: 'id'
        }
    },
    quadraId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'quadras',
            key: 'id'
        }
    },
    data: {
        type: Sequelize.DATEONLY,
        allowNull: false
    },
    hora: {
        type: Sequelize.TIME,
        allowNull: false
    },
    valor: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
    },
    status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'pendente' // pendente, aceito, rejeitado, pago, finalizado
    },
    golsTimeDesafiante: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    golsTimeDesafiado: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    dataPagamento: {
        type: Sequelize.DATE,
        allowNull: true
    }
}, {
    timestamps: true
});

// Definindo associações
Amistoso.belongsTo(Time, { as: 'timeDesafiante', foreignKey: 'timeDesafianteId' });
Amistoso.belongsTo(Time, { as: 'timeDesafiado', foreignKey: 'timeDesafiadoId' });
Amistoso.belongsTo(Quadra);

module.exports = Amistoso;
