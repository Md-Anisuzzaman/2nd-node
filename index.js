const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port =process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yhzyn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
  try {

    await client.connect();
    const database = client.db('foodCluster');
    const usersCollection = database.collection('users');

    //Get API
    app.get('/users',async(eq,res)=>{
      const cursor = usersCollection.find({});
      const users = await cursor.toArray();
      res.send(users);
    });

    //POST API
    app.post('/users', async (req, res) => {

      const newUser = req.body;
      const result = await usersCollection.insertOne(newUser);

      console.log('Got new user', req.body);
      console.log("added user", result);
      res.send(result);
    });

    //DELLET API

    app.delete('/users/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id:ObjectId(id)};
      const result = await usersCollection.deleteOne(query);
      console.log('deleting user with id',result);
      res.send(result);
    });

  }
  finally {
    //await client.close();
  }

}
run().catch(console.dir);



// async function run() {
//     try {
//       await client.connect();
//       const database = client.db("foodMaster");
//       const usersCollection = database.collection("users");
//       // create a document to insert
//       const doc = {
//         name: "Special one",
//         email: "Special@htmail.com",
//       }
//       const result = await usersCollection.insertOne(doc);
//       console.log(`A document was inserted with the _id: ${result.insertedId}`);
//     } finally {
//       await client.close();
//     }
//   }
//   run().catch(console.dir);




/*..then diye kora insert*/

// client.connect(err => {
//     const collection = client.db("foodMaster").collection("users");
//     // perform actions on the collection object
//     console.log('htting the database');

//     const user  = {name: 'ashraf',  email: 'ashraf@gmail.com', phone:'01225554568'};

//     collection.insertOne(user)
//     .then(() => {
//        console.log("insert success");
//     });
//     // client.close();
// });



app.get('/hello', (req, res) => {
  res.send('hello updated githere');
});

app.get('/', (req, res) => {
  res.send('Running  my crud');
});

app.listen(port, () => {
  console.log('server on port', port);
});