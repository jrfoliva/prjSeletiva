const { Sequelize, DataTypes}  = require("sequelize");
const dbConection = require('./db');

const Cliente = dbConection.define("Cliente", {
    id: { 
    type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,

    },
    nome: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
});

//Cria a tabela se não existir
Cliente.sync();
//Verifica se há alteração na estrutura da tabela e altera.
//Conteiner.sync({force: true});
module.exports = Cliente;