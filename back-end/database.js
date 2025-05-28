const Sequelize = require("sequelize");
const sequelize = new Sequelize('SPORTECH', 'postgres', 'Admin', {
    host: "localhost",
    port: 5433,
    dialect: 'postgres',
    logging: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
}); 

//Testa sucesso ou falha de conectar
sequelize.authenticate().then(function(){
    console.log("Conectado com sucesso!")
}).catch(function(erro){
    console.log("Falha ao se conectar!" + erro)
})

module.exports = sequelize;