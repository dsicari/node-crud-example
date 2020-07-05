// importar express com require. express esta exportando uma funcao, que guardaremos em express
const express = require('express');

// chamando a funcao exportada do express
const server = express();

// express deve ler json do corpo da requisicao
server.use(express.json());

// MIDDLEWARE global, sempre sera executado antes de qq requisao
server.use((req, res, next) => {
  // Inicia cronometro, label=Request
  console.time('Request');
  console.log(`Metodo: ${req.method}, URL: ${req.url}`);

  // Em next() temos o verbo que a requisição ia seguir antes de entrar no middleware
  // portanto se fez um GET, entra no middleware, faz o que tem que ser feito
  // e chama next() que vai para o GET
  next();

  // Encerra cronometro, label=Request e exibe no console
  console.timeEnd('Request');
});

// MIDDLEWARE local
function checkUserInArray(req, res, next) {
  if(!users[req.params.id]){
    return res.status(400).json({error: 'User does not exists'});
  }
  return next();
}

function checkUserExists(req, res, next) {
  if(!req.body.name){
    return res.status(400).json({error: 'User name is required'});
  }
  return next();
}

/*
  QUERY PARAMS => ?param=1
  ROUTE PARAMS => /route/1
  REQUEST BODY => {"objeto": {...}}
*/

const users = ['Danilo', 'Francisca', 'Fabio'];

server.get('/users', (req, res) => {
  console.log('GET users');
  return res.json(users);
});

server.get('/users/:id', checkUserInArray, (req, res) => {
  console.log('GET users by index');
  return res.json(users[req.params.id]);
});

// checkUserExists é um MIDDLEWARE local, podemos adicionar quantos quisermos
// logo, antes de executar o verbo POST, irá executar o middleware para 
// verificar se o campo 'name' existe no body da requsicao
server.post('/users', checkUserExists, (req, res) => {
  // desestrutura name do objeto contido no body
  const { name } = req.body;
  // insere user no array
  users.push(name);
  // retorna users
  return res.json(users);
});

// Aqui o MIDDLEWARE vai funcionar como no post, antes de executar o verbo PUT
// iremos validar se o usuario existe no index do array e se o campo name
// veio no body da requsicao
server.put('/users/:id', checkUserInArray, checkUserExists, (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  users[id] = name;
  return res.json(users);
});

server.delete('/users/:id', checkUserInArray, (req, res) => {
  const { id } = req.params;
  // percorre o array e deleta 1 posicao
  users.splice(id, 1);
  return res.json(users);
});

// quando user fizer GET em /teste
// req representa todos os dados da requsicao
// res representa todos os dados do response
server.get('/teste/:id', (req, res) => {
  console.log('acessado /teste');

  // pega o route param: http://localhost:3000/teste/1?nome=Danilo
  // const userId = req.params.id;
  // podemos desestruturar tambem o req
  const { id } = req.params;

  // pega o query param nome passado: localhost:3000/teste?nome=XYZ
  const nome = req.query.nome;

  //return res.send('<h1>tete</h1>'); // retorna html
  return res.json({message: ['hello world', `Hello ${id} ${nome}`]}); // retorna json
});

// servidor escuta porta 3000
server.listen(3000);