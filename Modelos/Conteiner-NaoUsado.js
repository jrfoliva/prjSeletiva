class Conteiner {
    //Atributos
    #id;
    #clienteId;
    #numConteiner;
    #tipo;
    #status;
    #categoria;

    constructor(id, clienteId, numConteiner, tipo, status, categoria){
        this.#id = id;
        this.#clienteId = clienteId;
        this.#numConteiner = numConteiner;
        this.#tipo = tipo;
        this.#status = status;
        this.categoria = categoria;
    }

    //métoddos
    get id() {return this.#id;}
    set id(novoId) {this.#id = novoId;}

    get clienteId() {return this.#clienteId;}
    set clienteId(novoClienteId) {this.#clienteId = novoClienteId;}

    get numConteiner() {return this.#numConteiner;}
    set numConteiner(novoNumCont) {this.#numConteiner = novoNumCont;}

    get tipo () {return this.#tipo;}
    set tipo (novoTipo) { this.#tipo = novoTipo;}

    get status() {return this.#status;}
    set status(novoStatus) {this.#status = novoStatus;}

    get categoria() {return this.#categoria;}
    set categoria(novaCateg) {this.#categoria = novaCateg;}

    //to json
    toJSON() {
        return {
            "id": this.#id,
            "clienteId": this.#clienteId,
            "numConteiner": this.#numConteiner,
            "tipo": this.#status,
            "status": this.#status,
            "categoria": this.#categoria
        }
    }
}