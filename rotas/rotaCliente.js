const express = require("express");
const dbCliente = require('../Modelos/ClienteDB');

//utilizar rotas
const rotaCliente = express.Router();
//utilizar formato de dados json
rotaCliente.use(express.json());

rotaCliente.route('/:id?')
.get(async (req, res) => {
    const resultado = await dbCliente.findAll()
    .then((resultado) =>{
        res.statusCode=200;
        res.json(resultado.map((cliente) =>{
            return cliente;
        }));
    });
}).post(async (req, res) => {
    console.log(req.body);
    const novoCliente = await dbCliente.create(req.body)
    .then((novoCliente) =>{
        res.statusCode=200;
        res.json({
            status: "200 - Sucesso!",
            mensagem: "Id: "+novoCliente.id+" - cadastrado com sucesso!"
        });
    }).catch((erro) => {
        res.statusCode=400;
        res.json({
            status: "400 - Falha",
            mensagem: "Não foi possível incluir o registro no banco de dados! ("+erro+")"
        });
    });
}).put(async (req, res) => {
    if(req.params.id){
        const alterado = await dbCliente.update(req.body, {
            where: {
                id: req.params.id
            }
        }).then((alterado) => {
            res.statusCode=200;
            res.json({
                status: "200 - Sucesso!",
                mensagem: "Id: "+req.params.id+" - Alterado com sucesso!"
            });
        }).catch((erro) => {
            res.statusCode=400;
            res.json({
                status: "400 - Falha!",
                mensagem: "Não foi possível realizar a alteração. ("+erro+")"
            })
        });
    }
    else{
        res.statusCode=405;
        res.json({
            status: "405 - Proibido!",
            mensagem: "Id não informado!"
        });
    }
}).delete(async (req, res) => {
    if (req.params.id){
        await dbCliente.destroy({
            where: {
                id: req.params.id
            }
        }).then(() =>{
            res.statusCode=200;
            res.json({
                status: "200 - Sucesso!",
                mensagem: "Registro excluído com sucesso!"
            });
        }).catch((erro) => {
            res.statusCode=400;
            res.json({
                status: "400 - Falha!",
                mensagem: "Ocorreu um erro na tentativa de exclusão do registro! ("+erro+")"
            });
        });
    }
    else{
        res.statusCode=405;
        res.json({
            status: "405 - Proibido!",
            mensagem: "Informe o id do registro para a exclusão!"
        });
    }
});

module.exports = rotaCliente;