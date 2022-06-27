const express = require("express");
const dbConteiner = require('../Modelos/ConteinerDB');

//utilizar rotas
const rotaConteiner = express.Router();
//utilizar formato de dados json
rotaConteiner.use(express.json());

rotaConteiner.route('/:id?')
.get(async (req, res) => {
    if(req.params.id){
        const conteiner = await dbConteiner.findByPk(req.params.id)
        .then((conteiner) => {
            if (conteiner){
                res.json(conteiner);
            }
            else{
                res.statusCode=404;
                res.json({
                    status: "404 - Not Found!",
                    mensagem: "Registro não encontrado!"
                });
            }
        }).catch(() => {
            res.statusCode=404;
            res.json({
                falha: true,
                mensagem: "Registro não encontrado!" 
            });
        })

    }
    else{
        const resultado = await dbConteiner.findAll()
        .then((resultado) =>{
            res.statusCode=200;
            res.json(resultado.map((conteiner) =>{
                return conteiner;
            }));
        });
    }
}).post(async (req, res) => {
    if(req.params.id){
        res.statusCode=405;
        res.json({
            status: "405 - Proibido!",
            mensagem: "Não especifique um id para um novo registro"
        });
    }
    else {
        const dados = req.body;
        console.table(dados);
        await dbConteiner.create(dados).then(() =>{
            res.statusCode=200;
            res.json({
                status: "200 - Sucesso!",
                mensagem: "Registro incluído com sucesso!"
            });
            
        }).catch((erro) => {
            res.statusCode=400;
            res.json({
                status: "400 - Falha",
                mensagem: "Não foi possível incluir o registro no banco de dados! ("+erro+")"
            });
        });
    }
}).put(async (req, res) => {
    if(req.params.id){
        const dados = req.body;
        delete dados.id;
        delete dados.createdAt;
        delete dados.updatedAt;
        console.table(dados);
        await dbConteiner.update(dados, {
            where: {
                id: req.params.id 
            }
        })    
        .then((resultado) => {
            res.statusCode=200;
            res.json({
                "status": "200 - Sucesso!",
                "mensagem": "Alteração realizada com sucesso!"
            });
        }).catch((erro) => {
            res.statusCode=400;
            res.json({
                status: "400 - Falha!",
                mensagem: "Não foi possível realizar a alteração. ("+erro+")"
            });
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
        await dbConteiner.destroy({
            where: {
                id: req.params.id
            }
        }).then((resultado) =>{
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

module.exports = rotaConteiner;