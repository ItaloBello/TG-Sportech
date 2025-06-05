// Importando os modelos
const Campeonato = require('./Campeonato');
const Time = require('./Time');
const TimeCampeonato = require('./TimeCampeonato');
const Partida = require('./Partida');
const Gol = require('./Gol');
const Usuario = require('./Usuario');
const Quadra = require('./Quadra');
const DonoQuadra = require('./DonoQuadra');
const Amistoso = require('./Amistoso');

// Associações que não estão definidas nos modelos individuais
// Campeonato e Times (muitos para muitos)
Time.belongsToMany(Campeonato, { through: TimeCampeonato });
Campeonato.belongsToMany(Time, { through: TimeCampeonato });

// Associação entre Campeonato e Quadra
Campeonato.belongsTo(Quadra, { foreignKey: 'donoQuadraId', as: 'quadra' });
Quadra.hasMany(Campeonato, { foreignKey: 'donoQuadraId', as: 'campeonatos' });

module.exports = {
  Campeonato,
  Time,
  TimeCampeonato,
  Partida,
  Gol,
  Amistoso
};
