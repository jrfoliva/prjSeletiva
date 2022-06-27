const Sequelize = require('sequelize');

//config do banco de dados
const bd = "teste";
const user = "root";
const pass = "123456";


const sequelize = new Sequelize(bd, user, pass, {
    host: "localhost",
    dialect: "mysql",
    dialectOptions: {
        useUtc: false
    },
    timezone: "-03:00",

});

sequelize.authenticate()
.then(function (){
    console.log("Banco de dados conectado com sucesso!");
}).catch(function(){
    console.log("Falha na conexão com o banco de dados!");
});

module.exports = sequelize;