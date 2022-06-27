const { Sequelize, DataTypes }  = require("sequelize");
const dbConection = require('./db');

const Movimentacao = dbConection.define("Movimento", {
    id: { 
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,

    },
    conteinerId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    clienteId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tipo: {
        type: DataTypes.STRING(25),
        allowNull: false
    },
    dtHrInicio: {
        type: DataTypes.DATE(6),
        allowNull: false
    },
    dtHrFim: {
        type: DataTypes.DATE(6),
        allowNull: false
    }
});
//Cria a tabela se não existir
Movimentacao.sync({alter: true});

//Verifica se há alteração na estrutura da tabela e altera.
//Movimentacao.sync();
module.exports = Movimentacao;