# Alura - 7 Days Of Code - MongoDB

Alura - 7 Days Of Code - MongoDB - Project:
build a Marvel characters API with a full standalone REST backend in Node.js on top of MongoDB.


## Day 1

1. Create project with WebStorm selecting the "Node.js" option (not "Express"):

![Image-01-ProjectStater-WebStorm](/images/Image-01-ProjectStater-WebStorm.jpg)

2. In the WebStorm "Run" tab, check if `npm init -y` was executed:

![Image-02-Run-NpmInit](/images/Image-02-Run-NpmInit.jpg)

3. In the WebStorm terminal, install express in the project with `npm install express`:

![Image-03-NpmInstallExpress](/images/Image-03-NpmInstallExpres.jpg)

4. Create the **index.js** file with the content:

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

5. In **package.json**, add the key-value `"start": "node index.js"` in "scripts";

6. Test the application execution with `npm start`;

![Image-04-NpmStart](/images/Image-04-NpmStart.jpg)

7. Download [MongoDB Community Server](https://www.mongodb.com/try/download/community) and install it with MongoDB Compass.

8. Run MongoDB Compass and connect:

![Image-05-MongoDbCompass](/images/Image-05-MongoDbCompass.jpg)


## Day 2

9. Create the `my_marvel_database` database in MongoDB Compass:

![Image-06-MongoDbCompass-CreateDatabse](/images/Image-06-MongoDbCompass-CreateDatabse.jpg)

10. Add data manually to the database:
- Generate data with fields "real_name", "nickname", "description" and save them in **data/avengers.json**;
- Import data from the file to the database in MongoDB Compass:

![Image-07-MongoDbCompass-ImportJson](/images/Image-07-MongoDbCompass-ImportJson.jpg)

11. Install mongoose in the project:
- In the terminal, type `npm install mongoose`;
- Add the code in **index.js**:
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
         res.status(500).json({ error: 'Error getting characters' });
     }
});
```

12. Test the application
- Run the application through the terminal with `npm start`;
- Access `http://localhost:3000/avengers` through the browser;

![Image-08-AvengersRouteJSON](/images/Image-08-AvengersRouteJSON.jpg)


## References

Alura - 7 Days Of Code - MongoDB: https://7daysofcode.io/matricula/mongodb

ExpressJS - Hello world example: https://expressjs.com/en/starter/hello-world.html

MongoDB Documentation - Manual - CRUD Operations: https://www.mongodb.com/docs/manual/crud/

MongoDB Community Server: https://www.mongodb.com/try/download/community