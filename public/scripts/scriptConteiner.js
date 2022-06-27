var elementoMensagem = document.querySelector('[data-mensagem]');
var botaoGravar = document.getElementById('botaoGravar');
var botaoAtualizar = document.getElementById('botaoAtualizar');
var botaoCancelar = document.getElementById('botaoCancelar');

const objRefConteiner = {"clienteId":"", "numConteiner":"", "tipo":"", "status":"", "categoria":""};
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
    document.getElementById('clienteId').value="";
    document.getElementById('numConteiner').value="";
    document.getElementById('tipo').value="";
    let radio = document.getElementsByName('status');
    radio[0].checked=false;
    radio[1].checked=false;
    document.getElementById('categoria').value="";
}


//Controle de botões.
botaoCancelar.addEventListener('click', ()=>{
    botaoAtualizar.disabled = true;
    botaoGravar.disabled = false;
});


//carregando o select de cliente cadastrados
function carregarSelectClientes () {
    fetch("http://localhost:3330/cliente", {
        method: "GET"
    }).then((resposta) => {
        if(resposta.ok){
            return resposta.json();
        }
    }).then((clientes) => {
        let selectCliente = document.getElementById('clienteId');
        
        if(clientes.length > 0){
            listaClientes = []
            for (const cli of clientes){
                selectCliente.appendChild(new Option(cli.nome, cli.id));
                //preencho a variável global
                listaClientes.push(cli);
            }
            selectCliente.children[0].selected=false;
        }
        else {
            selectCliente.appendChild(new Option("Não há clientes cadastrados!", "000000"));
        }
    }).catch((erro) => {
        limparMsg();
        let classe="m-3 alert alert-warning alert-dismissible";
        let msg='<button type="button" class="btn-close" data-bs-dismiss="alert"></button>\
             <strong>Atenção!</strong> Não foi possível processar uma resposta do servidor! ('+erro.message+')';
        mostrarElemMensagem(classe, msg);
    });
}


function exibirTabelaConteineres(){
    //Carregando elemento select com registros de clientes inclusive variável global listClientes
    carregarSelectClientes();

    fetch('http://localhost:3330/conteiner', {
        method:"GET"
    }).then((resposta) => {
        if (resposta.ok){
            return resposta.json();
        }
    }).then((conteineres) => {
        let elementoVisualizacaoTabela = document.querySelector('[data-Tabela]');
        elementoVisualizacaoTabela.innerHTML = "";
        if (conteineres.length == 0){
            elementoVisualizacaoTabela.innerHTML="<p>Não há Contêineres cadastrados!</p>";
        }
        else {
            for(let cont of conteineres){
                let indice = 0
                while (indice < listaClientes.length){
                    if (cont['clienteId'] != listaClientes[indice]['id']){
                        indice ++;
                    }
                    else{
                        cont['nome'] = listaClientes[indice]['nome'];
                        break;
                    }
                }
            }

            let tabela = document.createElement('table');
            tabela.className="table table-striped table-hover";
            let cabecalho = document.createElement('thead');
            cabecalho.innerHTML="<tr>\
                                    <th>Id</th>\
                                    <th>Cliente</th>\
                                    <th>ident. Contêiner</th>\
                                    <th>Tipo</th>\
                                    <th>Status</th>\
                                    <th>Categoria</th>\
                                    <th>Ações</th>\
                                </tr>";
            tabela.appendChild(cabecalho);
            let corpo = document.createElement('tbody');
            for (const conteiner of conteineres){
                const linha = document.createElement('tr');
                linha.innerHTML="<td>" + conteiner.id + "</td>\
                                 <td>" + conteiner.nome + "</td>\
                                 <td>" + conteiner.numConteiner + "</td>\
                                 <td>" + conteiner.tipo + "</td>\
                                 <td>" + conteiner.status + "</td>\
                                 <td>" + conteiner.categoria + "</td>\
                                 <td>\
                                    <button type='button' class='btn btn-danger' onclick='excluirConteiner(\""+ conteiner.id +"\")'>\
                                        <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-trash' viewBox='0 0 16 16'>\
                                            <path d='M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z'/>\
                                            <path fill-rule='evenodd' d='M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z'/>\
                                        </svg>\
                                    </button>\
                                    <button type='button' class='btn btn-warning' id='editar' onclick='alterarTelaPut(\"" + conteiner.id + "\")'>\
                                        <svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='currentColor' class='bi bi-pencil' viewBox='0 0 16 16'>\
                                            <path d='M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z'/>\
                                        </svg>\
                                    </button>\
                                 </td>";
                corpo.appendChild(linha);                        
            }
            let rodape = document.createElement('tfoot');
            rodape.innerHTML="<tr>\
                                <td colspan='3'>Quantidade de Contêineres :</td>\
                                <td colspan='3'>"+ conteineres.length + "</td>\
                              </tr>";
            tabela.appendChild(corpo);
            tabela.appendChild(rodape);
            elementoVisualizacaoTabela.appendChild(tabela);
        }
    });
}

//Exibindo os registros de contêineres
exibirTabelaConteineres();

//Captura os dados dos elementos e verifica campos vazios
function dadosValidos(){
    let status = true; //checagem
    let objConteiner = objRefConteiner;  
    objConteiner['clienteId'] = parseInt(document.getElementById("clienteId").value);
    
    idConteiner = document.getElementById("numConteiner").value;
    const regex = new RegExp(/[A-Z]{4}\d{7}/);
    if (regex.test(idConteiner)){
        objConteiner['numConteiner'] = idConteiner;
    }
    else{
        status = false;
    } 
    objConteiner['tipo'] = document.getElementById("tipo").value;

    let radio = document.getElementsByName('status');
    if ( !radio[0].checked && !radio[1].checked){
        status = false;
    }else {
        (document.getElementsByName('status')[0].checked == true) ? objConteiner['status'] = "CHEIO" 
        :objConteiner['status'] = "VAZIO"; 
    }
    objConteiner['categoria'] = document.getElementById('categoria').value;

    return [objConteiner, status];
}


//Atribuindo a função ao elemento
botaoGravar.onclick = gravarConteiner;


function gravarConteiner(){
    //dados recebe um array de duas posições
    //indice 0 = obj conteiner com os dados
    //indice 1 = true/false (verificação de campos vazios)
    const dados = dadosValidos();
    if(dados[1]){
        //realizando a chamada assíncrona
        fetch('http://localhost:3330/conteiner', {
            method:"POST",
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify(dados[0])
        }).then((resposta) => {
            if (resposta.ok){
                return resposta.json();
            }
            else {
                let classe="m-3 alert alert-warning alert-dismissible";
                let msg='<button type="button" class="btn-close" data-bs-dismiss="alert"></button>\
                     <strong>Atenção!</strong> Não foi possível processar uma resposta do servidor!';
                mostrarElemMensagem(classe, msg);
            }
        }).then(() => {
            limparCamposForm();
            limparMsg()
            let classe="m-3 alert alert-success alert-dismissible";
            let msg='<button type="button" class="btn-close" data-bs-dismiss="alert"></button>\
                 <strong>Atenção!</strong> Registro incluído com sucesso!';
            mostrarElemMensagem(classe, msg);
            exibirTabelaConteineres();
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
    fetch('http://localhost:3330/conteiner/' + id, {
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
    }).then((conteiner) => {
        document.getElementById('id').value=conteiner.id;
        document.getElementById('clienteId').value=conteiner.clienteId;
        document.getElementById('numConteiner').value=conteiner.numConteiner;
        document.getElementById('tipo').value=conteiner.tipo;
        //operador ternário
        conteiner.status == "CHEIO" ? document.getElementsByName('status')[0].checked=true 
                                    : document.getElementsByName('status')[1].checked=true;

        document.getElementById('categoria').value=conteiner.categoria;
        botaoGravar.disabled=true;
        botaoAtualizar.disabled=false;
        botaoAtualizar.addEventListener("click", ()=> {
            atualizarConteiner(conteiner);
        });
        document.getElementById('clienteId').focus();
    }).catch((erro) =>{
        limparMsg();
        let classe="m-3 alert alert-warning alert-dismissible";
        let msg='<button type="button" class="btn-close" data-bs-dismiss="alert"></button>\
             <strong>Atenção!</strong> Falha ao processar a get por id no banco! ('+erro.message+')';
        mostrarElemMensagem(classe, msg);
    });
}


function atualizarConteiner(conteiner){
    conteiner['clienteId'] = document.getElementById('clienteId').value;
    conteiner['numConteiner'] = document.getElementById('numConteiner').value;
    conteiner['tipo'] = document.getElementById('tipo').value;
    conteiner['categoria'] = document.getElementById('categoria').value;
    //operador ternário
    document.getElementsByName('status')[0].checked == true ? conteiner['status']="CHEIO"
        : conteiner['status']="VAZIO";
    const resp = confirm('Deseja realizar a alteração deste registro?');
    if (resp){
        fetch('http://localhost:3330/conteiner/' + conteiner.id, {
            method:"PUT",
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify(conteiner)
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
            limparCamposForm();
            botaoAtualizar.disabled=true;
            botaoGravar.disabled=false;
            exibirTabelaConteineres();
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


function excluirConteiner(id){
    const resp = confirm('Deseja realmente excluir o registro de Id: '+id+'?');
    if (resp){
        fetch('http://localhost:3330/conteiner/' + id,  {
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
            exibirTabelaConteineres();
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