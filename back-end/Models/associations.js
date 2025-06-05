const Usuario = require('./Usuario');
const Time = require('./Time');
const JogadorTime = require('./JogadorTime');

// Associação entre Usuario e Time (um usuário pode criar vários times)
Usuario.hasMany(Time, { foreignKey: 'userId' });
Time.belongsTo(Usuario, { foreignKey: 'userId' });

// Associação entre Usuario e JogadorTime
Usuario.hasMany(JogadorTime, { foreignKey: 'jogadorId', as: 'jogadorTimes' });
JogadorTime.belongsTo(Usuario, { foreignKey: 'jogadorId', as: 'jogador' });

// Associação entre Time e JogadorTime
Time.hasMany(JogadorTime, { foreignKey: 'timeId', as: 'timeJogadores' });
JogadorTime.belongsTo(Time, { foreignKey: 'timeId', as: 'time' });

module.exports = {
  Usuario,
  Time,
  JogadorTime
};
