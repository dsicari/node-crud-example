// importar express com require. express esta exportando uma funcao, que guardaremos em express
const express = require('express');

// chamando a funcao exportada do express
const server = express();

// expresse deve ler json do corpo da requisicao
server.use(express.json());

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

server.get('/users/:id', (req, res) => {
  console.log('GET users by index');
  return res.json(users[req.params.id]);
});

server.post('/users', (req, res) => {
  // desestrutura name do objeto contido no body
  const { name } = req.body;
  // insere user no array
  users.push(name);
  // retorna users
  return res.json(users);
});

server.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  users[id] = name;
  return res.json(users);
});

server.delete('/users/:id', (req, res) => {
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