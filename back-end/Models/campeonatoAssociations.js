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

// Associações diretas com TimeCampeonato
Campeonato.hasMany(TimeCampeonato);
TimeCampeonato.belongsTo(Campeonato);
Time.hasMany(TimeCampeonato);
TimeCampeonato.belongsTo(Time);


module.exports = {
  Campeonato,
  Time,
  TimeCampeonato,
  Partida,
  Gol,
  Amistoso
};
