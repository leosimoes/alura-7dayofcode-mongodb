# Alura - 7 Days Of Code - MongoDB

Projeto do 7 Days of Code de MongoDB da Alura: 
construir uma API de personagens da Marvel com um back-end REST standalone completo em Node.js em cima do MongoDB.


## Dia 1

1. Criar projeto com o WebStorm selecionado a opção "Node.js" (e não "Express"):

![Image-01-ProjectStater-WebStorm](/images/Image-01-ProjectStater-WebStorm.jpg)

2. Na aba "Run" do WebStorm, verificar se `npm init -y` foi executado:

![Image-02-Run-NpmInit](/images/Image-02-Run-NpmInit.jpg)

3. No terminal do WebStorm, instalar o express no projeto com `npm install express`:

![Image-03-NpmInstallExpress](/images/Image-03-NpmInstallExpres.jpg)

4. Criar o arquivo **index.js** com o conteúdo:

```javascript
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
```

5. Em **package.json**, adicionar a chave-valor `"start": "node index.js"` em "scripts";

6. Testar a execução da aplicação com `npm start`;

![Image-04-NpmStart](/images/Image-04-NpmStart.jpg)

7. Baixar o [MongoDB Community Server](https://www.mongodb.com/try/download/community) e instalá-lo com o MongoDB Compass.

8. Executar o MongoDB Compass e conectar:

![Image-05-MongoDbCompass](/images/Image-05-MongoDbCompass.jpg)


## Dia 2

9. Criar a base de dados `my_marvel_database` no MongoDB Compass:

![Image-06-MongoDbCompass-CreateDatabse](/images/Image-06-MongoDbCompass-CreateDatabse.jpg)

10. Adicionar os dados manualmente no banco:
- Gerar dados com campos "real_name", "nickname", "description" e salvá-los em **data/avengers.json**;
- Importar dados do arquivo para a base de dados no MongoDB Compass:

![Image-07-MongoDbCompass-ImportJson](/images/Image-07-MongoDbCompass-ImportJson.jpg)

11. Instalar o mongoose no projeto:
- No terminal, digite `npm install mongoose`;
- Adicione o código em **index.js**:
```javascript
const connection_url = 'mongodb://localhost:27017/my_marvel_database';

mongoose.connect(connection_url);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error connecting to MongoDB:'));
db.once('open', () => {
    console.log('Successful connection to MongoDB!');
});

const Character = mongoose.model('characters', {
    real_name: String,
    nickname: String,
    description: String
});

app.get('/avengers/', async (req, res) => {
    try {
        const avengers = await Character.find();
        res.json(avengers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao obter personagens' });
    }
});
```

12. Testar a aplicação
- Executar a aplicação pelo terminal com `npm start`;
- Acessar `http://localhost:3000/avengers` pelo navegador;

![Image-08-AvengersRouteJSON](/images/Image-08-AvengersRouteJSON.jpg)


## Referências

Alura - 7 Days Of Code - MongoDB: https://7daysofcode.io/matricula/mongodb

ExpressJS - Hello world example: https://expressjs.com/en/starter/hello-world.html

MongoDB Documentation - Manual - CRUD Operations: https://www.mongodb.com/docs/manual/crud/

MongoDB Community Server: https://www.mongodb.com/try/download/community