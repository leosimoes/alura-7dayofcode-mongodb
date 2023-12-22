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

5. In **package.json**, add the key-value `"start": "node index.js"` in "scripts";

6. Test the application execution with `npm start`;

![Image-04-NpmStart](/images/Image-04-NpmStart.jpg)

7. Download [MongoDB Community Server](https://www.mongodb.com/try/download/community) and install it with MongoDB Compass.

8. Run MongoDB Compass and connect:

![Image-05-MongoDbCompass](/images/Image-05-MongoDbCompass.jpg)


## References

Alura - 7 Days Of Code - MongoDB: https://7daysofcode.io/matricula/mongodb

ExpressJS - Hello world example: https://expressjs.com/en/starter/hello-world.html

MongoDB Documentation - Manual - CRUD Operations: https://www.mongodb.com/docs/manual/crud/

MongoDB Community Server: https://www.mongodb.com/try/download/community