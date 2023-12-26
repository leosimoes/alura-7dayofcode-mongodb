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
const express = require('express');
const app = express();
const port = 3000;

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
const mongoose = require('mongoose');

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
        res.status(500).json({ error: 'Error getting characters!' });
    }
});
```

12. Testar a aplicação
- Executar a aplicação pelo terminal com `npm start`;
- Acessar `http://localhost:3000/avengers` pelo navegador;

![Image-08-AvengersRouteJSON](/images/Image-08-AvengersRouteJSON.jpg)


## Dia 3

13. Criar endpoint GET `/avengers/:id`:
- Adicionar o código em **index.js**:
```javascript
app.get('/avengers/:id/', async (req, res) => {
    try {
        const character = await Character.findById(req.params.id);

        if (!character) {
            return res.status(404).json({ error: 'Character not found!' });
        }

        res.json(character);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error getting character by ID!' });
    }
});
```
- Testar `http://localhost:3000/avengers/6586daaf0ca46f4ddfbc6654` pelo navegador:

![Image-09-AvengersGetId-IronMan](/images/Image-09-AvengersGetId-IronMan.jpg)

14. Criar endpoint POST `/avengers`:
- Adicionar o código em **index.js**:
```javascript
app.use(express.json());

app.post('/avengers/', async (req, res) => {
    try {
        const { real_name, nickname, description } = req.body;

        if (!real_name || !nickname || !description) {
            return res.status(400).json({ error: 'All fields are mandatory.' });
        }

        const newCharacter = new Character({
            real_name,
            nickname,
            description
        });

        const savedCharacter = await newCharacter.save();

        res.status(201).json(savedCharacter);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Error creating a new character!' });
    }
});
```
- Testar o endpoint com Postman, inserindo um novo dado:

![Image-10-AvengersPost-Spiderman](/images/Image-10-AvengersPost-Spiderman.jpg)


## Dia 4

15. Adicionar validação do endpoint POST `/avengers`:
- Anteriormente já validava se os dados possuiam todos os 3 atributos requeridos:

![Image-11-Post-Ultron](/images/Image-11-Post-Ultron.jpg)

- Verificar se os dados não possuem nenhum atributo extra:

```javascript
const hasAdditionalAttributes = Object.keys(req.body).some(attribute => !['real_name', 'nickname', 'description'].includes(attribute));

if (hasAdditionalAttributes) {
    return res.status(400).json({ error: 'Only "real_name", "nickname", and "description" are allowed.' });
}
```

![Image-12-Post-Thanos](/images/Image-12-Post-Thanos.jpg)


## Dia 5

16. Remover o atributo `_id` do retorno do endpoint GET `/avengers/`:
```javascript
const avengers = await Character.find({}, { _id: 0 });
```
![Image-13-AvengersRouteJSON-v2](/images/Image-13-AvengersRouteJSON-v2.jpg)

17. Criar endpoint GET `/avengers/nickname/:nickname`:
- Os objetos retornados não devem ter `_id`:
```javascript
const avengerWithoutId = avenger.toObject();
delete avengerWithoutId._id;
```
- Adicionar o código:
```javascript
app.get('/avengers/nickname/:nickname', async (req, res) => {
    try {
        const { nickname } = req.params;
        const decodedNickname = decodeURIComponent(nickname); // Decodifica o valor

        const avenger = await Character.findOne({ nickname: decodedNickname });

        if (!avenger) {
            return res.status(404).json({ error: 'Avenger not found' });
        }

        const avengerWithoutId = avenger.toObject();
        delete avengerWithoutId._id;

        res.json(avengerWithoutId);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Error getting Avenger by nickname' });
    }
});
```

- Testar com o Postman:

![Image-14-AvengersGetNickname-CaptainAmerica](/images/Image-14-AvengersGetNickname-CaptainAmerica.jpg)

18. Criar endpoint GET `/avengers/realname/:realname`:
- Os objetos retornados não devem ter `_id`;
```javascript
const avengerWithoutId = avenger.toObject();
delete avengerWithoutId._id;
```
- Adicionar o código:
```javascript
app.get('/avengers/realname/:realname', async (req, res) => {
    try {
        const { realname } = req.params;
        const decodedNickname = decodeURIComponent(realname); // Decodifica o valor

        const avenger = await Character.findOne({ real_name: decodedNickname });

        if (!avenger) {
            return res.status(404).json({ error: 'Avenger not found!' });
        }

        const avengerWithoutId = avenger.toObject();
        delete avengerWithoutId._id;

        res.json(avengerWithoutId);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Error getting Avenger by nickname!' });
    }
});
```
- Testar com o Postman:

![Image-15-AvengersGetRealName-TChalla](/images/Image-15-AvengersGetRealName-TChalla.jpg)


## Referências

Alura - 7 Days Of Code - MongoDB: https://7daysofcode.io/matricula/mongodb

ExpressJS - Hello world example: https://expressjs.com/en/starter/hello-world.html

MongoDB Documentation - Manual - CRUD Operations: https://www.mongodb.com/docs/manual/crud/

MongoDB Community Server: https://www.mongodb.com/try/download/community