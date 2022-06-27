const { Sequelize, DataTypes, QueryTypes }  = require("sequelize");
const dbConection = require('./db');

const Conteiner = dbConection.define("Conteiner", {
    id: { 
    type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,

    },
    clienteId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    numConteiner: {
        type: DataTypes.STRING(11),
        allowNull: false
    },
    tipo: {
        type: DataTypes.STRING(2),
        allowNull: false
    },
    status: {
        type: DataTypes.STRING(5),
        allowNull: false
    },
    categoria: {
        type: DataTypes.STRING(10),
        allowNull: false
    }
});
//Cria a tabela se não existir
Conteiner.sync();
//Conteiner.sync({alter:true})
//Verifica se há alteração na estrutura da tabela e altera.
//Conteiner.sync({force: true});
module.exports = Conteiner;