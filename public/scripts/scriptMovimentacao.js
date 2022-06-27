var elementoMensagem = document.querySelector('[data-mensagem]');
var botaoGravar = document.getElementById('botaoGravar');
var botaoAtualizar = document.getElementById('botaoAtualizar');
var botaoCancelar = document.getElementById('botaoCancelar');

const objRefMovimentacao = {"conteinerId":"", "clienteId":"", "tipo":"", "dtHrInicio":"", "dtHrFim":""};
var listaConteineres = [];
var listaClientes = [];

function limparMsg() {
    elementoMensagem.innerHTML = "";
    elementoMensagem.className = "";
}
  
function mostrarElemMensagem(classe, msg){
      elementoMensagem.className = classe;
      elementoMensagem.innerHTML = msg;
}

function limparCamposForm(){
    document.getElementById('id').value="";
    document.getElementById('conteinerId').value="";
    document.getElementById('clienteId').value="";
    document.getElementById('tipo').value="";
    document.getElementById('dtHrInicio').value="";
    document.getElementById('dtHrFim').value="";

}


//Controle de botões.
botaoCancelar.addEventListener('click', ()=>{
    botaoAtualizar.disabled = true;
    botaoGravar.disabled = false;
});


function carregarSelectClientes(){
    fetch('http://localhost:3330/cliente/', {
        method: "GET"
    }).then((resposta) => {
        if (resposta.ok){
            return resposta.json();
        }
    }).then((clientes) =>{
        let selectClientes = document.getElementById('clienteId');
        if(clientes.length > 0){
            listaClientes = [];
            selectClientes.innerHTML="";
            selectClientes.appendChild(new Option("", "0"));
            selectClientes.children[0].selected=true;
            for (let cliente of clientes){
                selectClientes.appendChild(new Option(cliente.nome, cliente.id));
                listaClientes.push(cliente);
            }            
        }
        else{
            selectClientes.appendChild(new Option("Não há clientes cadasttrados!", "000000"));
        }
    }).catch((e) =>{
        limparMsg();
        let classe="m-3 alert alert-warning alert-dismissible";
        let msg='<button type="button" class="btn-close" data-bs-dismiss="alert"></button>\
             <strong>Atenção!</strong> Falha ao recuperar um cliente no banco de dados! ('+e.message+')';
        mostrarElemMensagem(classe, msg);            
    })
}


//seleciona o cliente dono do contêiner
function apontarCliente(){
    const conteinerId = document.getElementById('conteinerId').value; 
    for(const cont of listaConteineres){
        if(cont.id == conteinerId){
            document.getElementById('clienteId').value = cont.clienteId;
            break;            
        }
    }
}


//carregando o select de conteineres cadastrados
function carregarSelectConteiner () {
    fetch("http://localhost:3330/conteiner", {
        method: "GET"
    }).then((resposta) => {
        if(resposta.ok){
            return resposta.json();
        }
    }).then((conteineres) => {
        let selectConteiner = document.getElementById('conteinerId');
        if(conteineres.length > 0){
            listaConteineres = [];
            selectConteiner.innerHTML="";
            selectConteiner.appendChild(new Option("", "0"));
            for (const cont of conteineres){
                //preenchendo select conteiner
                selectConteiner.appendChild(new Option(cont.numConteiner, cont.id));
                //preencher a variável global
                listaConteineres.push(cont);
           }
           selectConteiner.children[0].selected=true;
           carregarSelectClientes();
           selectConteiner.onblur=apontarCliente;
        }
        else {
            selectConteiner.appendChild(new Option("Não há contêinres cadastrados!", "000000"));
            selectConteiner.children[0].selected=true;
        }
    }).catch((erro) => {
        limparMsg();
        let classe="m-3 alert alert-warning alert-dismissible";
        let msg='<button type="button" class="btn-close" data-bs-dismiss="alert"></button>\
             <strong>Atenção!</strong> Não foi possível processar uma resposta do servidor! ('+erro.message+')';
        mostrarElemMensagem(classe, msg);
    });
}


function exibirTabelaMovimentacoes(){
    //Carregando elemento select com registros de clientes inclusive variável global listClientes
    carregarSelectConteiner();
    limparCamposForm();
    fetch('http://localhost:3330/movimento', {
        method:"GET"
    }).then((resposta) => {
        if (resposta.ok){
            return resposta.json();
        }
    }).then((movimentacoes) => {
        let elementoVisualizacaoTabela = document.querySelector('[data-Tabela]');
        elementoVisualizacaoTabela.innerHTML = "";
        if (movimentacoes.length == 0){
            elementoVisualizacaoTabela.innerHTML="<p>Não há Movimentações cadastradas!</p>";
        }
        else {
            let tabela = document.createElement('table');
            tabela.className="table table-striped table-hover";
            let cabecalho = document.createElement('thead');
            cabecalho.innerHTML="<tr>\
                                    <th>Id</th>\
                                    <th>Contêiner</th>\
                                    <th>Cliente</th>\
                                    <th>Tipo</th>\
                                    <th>Início</th>\
                                    <th>Fim</th>\
                                    <th>Ações</th>\
                                </tr>";
            tabela.appendChild(cabecalho);
            let corpo = document.createElement('tbody');
            for (const mov of movimentacoes){
                const linha = document.createElement('tr');
                linha.innerHTML="<td>" + mov.id + "</td>\
                                 <td>" + buscarConteiner(mov.conteinerId) + "</td>\
                                 <td>" + buscarCliente(mov.clienteId) + "</td>\
                                 <td>" + mov.tipo + "</td>\
                                 <td>" + formatarData(mov.dtHrInicio) + "</td>\
                                 <td>" + formatarData(mov.dtHrFim) + "</td>\
                                 <td>\
                                    <button type='button' class='btn btn-danger' onclick='excluirMovimentacao(\""+ mov.id +"\")'>\
                                        <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-trash' viewBox='0 0 16 16'>\
                                            <path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z'/>\
                                            <path fill-rule='evenodd' d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z'/>\
                                        </svg>\
                                    </button>\
                                    <button type='button' class='btn btn-warning' id='editar' onclick='alterarTelaPut(\"" + mov.id + "\")'>\
                                        <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-pencil' viewBox='0 0 16 16'>\
                                            <path d='M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z'/>\
                                        </svg>\
                                    </button>\
                                 </td>";
                corpo.appendChild(linha);                        
            }
            let rodape = document.createElement('tfoot');
            rodape.innerHTML="<tr>\
                                <td colspan='3'>Quantidade de movimentações :</td>\
                                <td colspan='3'>"+ movimentacoes.length + "</td>\
                              </tr>";
            tabela.appendChild(corpo);
            tabela.appendChild(rodape);
            elementoVisualizacaoTabela.appendChild(tabela);
        }
    });
}

function buscarConteiner(idConteiner){
    for(const conteiner of listaConteineres){
        if(conteiner.id == idConteiner){
            return conteiner.numConteiner;
        }
    }
}

function buscarCliente(idCliente){
    for (const cliente of listaClientes){
        if (cliente.id == idCliente){
            return cliente.nome;
        }
    }
}


//Exibindo os registros de contêineres
exibirTabelaMovimentacoes();

//Captura os dados dos elementos e verifica campos vazios
function dadosValidos(){
    let status = true; //checagem
    let objMov = objRefMovimentacao;  
    objMov['conteinerId'] = document.getElementById("conteinerId").value;
    objMov['clienteId'] = document.getElementById("clienteId").value;
    objMov['tipo'] = document.getElementById("tipo").value;
    objMov['dtHrInicio'] = document.getElementById("dtHrInicio").value;
    objMov['dtHrFim'] = document.getElementById("dtHrFim").value;
    
    for(const campo of Object.keys(objMov)){
        if (objMov[campo] == "" ){
            status = false;
        }
    }
    return [objMov, status];
}

//Atribuindo a função ao elemento
botaoGravar.onclick = gravarMovimentacao;

function gravarMovimentacao(){
    //dados recebe um array de duas posições
    //indice 0 = obj conteiner com os dados
    //indice 1 = true/false (verificação de campos vazios)
    const dados = dadosValidos();
    if(dados[1]){
        //realizando a chamada assíncrona
        fetch('http://localhost:3330/movimento', {
            method:"POST",
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify(dados[0])
        }).then((resposta) => {
            if (resposta.ok){
                return resposta.json();
            }
            else {
                limparMsg();
                let classe="m-3 alert alert-warning alert-dismissible";
                let msg='<button type="button" class="btn-close" data-bs-dismiss="alert"></button>\
                     <strong>Atenção!</strong> Não foi possível processar uma resposta do servidor!';
                mostrarElemMensagem(classe, msg);
            }
        }).then(() => {
            limparMsg();
            let classe="m-3 alert alert-success alert-dismissible";
            let msg='<button type="button" class="btn-close" data-bs-dismiss="alert"></button>\
                 <strong>Atenção!</strong> Registro incluído com sucesso!';
            mostrarElemMensagem(classe, msg);
            exibirTabelaMovimentacoes();
        }).catch((erro) => {
            limparMsg();
            let classe="m-3 alert alert-warning alert-dismissible";
            let msg='<button type="button" class="btn-close" data-bs-dismiss="alert"></button>\
                 <strong>Atenção!</strong> Falha ao processar a requisição! (' +erro.message+')';
            mostrarElemMensagem(classe, msg);
        });
    }
    else {
        let classe="m-3 alert alert-warning alert-dismissible";
        let msg='<button type="button" class="btn-close" data-bs-dismiss="alert"></button>\
             <strong>Atenção!</strong> Por favor, preencha todos os campos corretamente!';
        mostrarElemMensagem(classe, msg);
    }    
}


function alterarTelaPut(id){
    fetch('http://localhost:3330/movimento/' + id, {
        method:"GET"
    }).then((resposta) => {
        if (resposta.ok){
            return resposta.json();
        }
        else{
            limparMsg();
            let classe="m-3 alert alert-warning alert-dismissible";
            let msg='<button type="button" class="btn-close" data-bs-dismiss="alert"></button>\
                 <strong>Atenção!</strong> Registro não encontrado!';
            mostrarElemMensagem(classe, msg);
        }
    }).then((movimento) => {
        document.getElementById('id').value=movimento.id;
        document.getElementById('conteinerId').value=movimento.conteinerId;
        document.getElementById('clienteId').value=movimento.clienteId;
        document.getElementById('tipo').value=movimento.tipo;
        document.getElementById('dtHrInicio').value=movimento.dtHrInicial;
        document.getElementById('dtHrFim').value=movimento.dtHrFinal;
        botaoGravar.disabled=true;
        botaoAtualizar.disabled=false;
        botaoAtualizar.addEventListener("click", ()=> {
            atualizarMovimentacao(movimento);
        });
        document.getElementById('conteinerId').focus();
    }).catch((erro) =>{
        limparMsg();
        let classe="m-3 alert alert-warning alert-dismissible";
        let msg='<button type="button" class="btn-close" data-bs-dismiss="alert"></button>\
             <strong>Atenção!</strong> Falha ao processar a get por id no banco! ('+erro.message+')';
        mostrarElemMensagem(classe, msg);
    });
}


function atualizarMovimentacao(movimento){
    movimento['conteinerId'] = document.getElementById('conteinerId').value;
    movimento['clienteId'] = document.getElementById('clienteId').value;
    movimento['tipo'] = document.getElementById('tipo').value;
    movimento['dtHrInicio'] = document.getElementById('dtHrInicio').value;
    movimento['dtHrFim'] = document.getElementById('dtHrFim').value;

    const resp = confirm('Deseja realizar a alteração deste registro?');
    if (resp){
        fetch('http://localhost:3330/movimento/' + movimento.id, {
            method:"PUT",
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify(movimento)
        }).then((resposta) => {
            if (resposta.ok){
                return resposta.json();
            }
            else{
                limparMsg();
                let classe="m-3 alert alert-warning alert-dismissible";
                let msg='<button type="button" class="btn-close" data-bs-dismiss="alert"></button>\
                    <strong>Atenção!</strong> Desculpe, não foi possível atualizar este registro!';
                mostrarElemMensagem(classe, msg);
            }
        }).then(() => {
            botaoAtualizar.disabled=true;
            botaoGravar.disabled=false;
            exibirTabelaMovimentacoes();
            limparMsg();
            let classe="m-3 alert alert-succsess alert-dismissible";
            let msg='<button type="button" class="btn-close" data-bs-dismiss="alert"></button>\
                <strong>Atenção!</strong> Registro atualizado com sucesso!';
            mostrarElemMensagem(classe, msg);    
        }).catch((erro) =>{
            limparMsg();
            let classe="m-3 alert alert-warning alert-dismissible";
            let msg='<button type="button" class="btn-close" data-bs-dismiss="alert"></button>\
                <strong>Atenção!</strong> Não foi possivel processar esta alteração no servidor! ('+erro.message+')';
            mostrarElemMensagem(classe, msg);
        });
    }    
    else {
        limparMsg();
        let classe="m-3 alert alert-warning alert-dismissible";
        let msg='<button type="button" class="btn-close" data-bs-dismiss="alert"></button>\
            <strong>Atenção!</strong> Dados inválidos!';
        mostrarElemMensagem(classe, msg);
    }
}


function excluirMovimentacao(id){
    const resp = confirm('Deseja realmente excluir o registro de Id: '+id+'?');
    if (resp){
        fetch('http://localhost:3330/movimento/' + id,  {
            method:"DELETE"
        }).then((resposta) => {
            if (resposta.ok){
                return resposta.json();
            }
            else{
                limparMsg();
                let classe="m-3 alert alert-warning alert-dismissible";
                let msg='<button type="button" class="btn-close" data-bs-dismiss="alert"></button>\
                    <strong>Atenção!</strong> Não foi possivel processar esta requisição no servidor!';
                mostrarElemMensagem(classe, msg);
            }
        }).then(() => {
            exibirTabelaMovimentacoes();
            limparMsg();
            let classe="m-3 alert alert-success alert-dismissible";
            let msg='<button type="button" class="btn-close" data-bs-dismiss="alert"></button>\
                <strong>Atenção!</strong> Registro exluído com sucesso!';
            mostrarElemMensagem(classe, msg);
        }).catch((erro) => {
            limparMsg();
            let classe="m-3 alert alert-warning alert-dismissible";
            let msg='<button type="button" class="btn-close" data-bs-dismiss="alert"></button>\
                   <strong>Atenção!</strong> Erro ao processar a requisição de exclusão deste registro! ('+erro.message+')';
            mostrarElemMensagem(classe, msg);
        });
    }
}

function formatarData(strdata){
    if (strdata != ""){
        strdata = new Date(strdata);
        strdata = new Intl.DateTimeFormat('pt-BR', {
            timeZone: 'America/Sao_Paulo',
            dateStyle: 'short',
            timeStyle: 'short'
        }).format(strdata);
        let dta_hr = strdata.split(" ");
        let data = dta_hr[0];
        let hora = dta_hr[1];
        return (data+" "+hora);            
    }
    else {
        return "";
    }
}