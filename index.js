//importações
const express = require('express');
const http = require('http');
const rotaConteiner = require('./rotas/rotaConteiner');
const rotaCliente = require('./rotas/rotaCliente');
const rotaMovimento = require('./rotas/rotaMovimento');


const hostname = "0.0.0.0";
const port = 3330;

const app = express();

//rotas publicas
app.use(express.static('./public'));

//rota conteiner
app.use('/conteiner', rotaConteiner);

//rota cliente
app.use('/cliente', rotaCliente);

//rota Movimentacao
app.use('/movimento', rotaMovimento);


const server = http.createServer(app);
server.listen(port, hostname, () =>{
    console.log("Servidor disponível em http://%s:%d", hostname, port);
});