Iniciando o projeto, cria-se a uma pasta qualquer para o projeto.
Considerando que o nodesjs já esteja instalado no sistema.
Abrir a pasta do projeto com o visual code e abrir um terminal:

Executar no terminal:
>npm init

Instalar o express para gerenciar as rotas
>npm install express

Adicionado Type e script start no package.json para utilizar sintaxe ecmascript6

Instalar o módulo para reiniciar o servidor sempre que houver alteração no código fonte, g significa globalmente.
>npm install -g nodemon //reiniciar para evitar problemas
>npm install --save-dev nodemon 
>nodemon index.js //index.js no meu caso é o index.js

Banco de Dados: usuário: root, senha: Jfo192400

Sequelize é uma biblioteca Javascript que facilita o gerenciamento de um banco de dados SQL
>npm install --save sequelize
>npm install --save mysql2 //instalação do driver

