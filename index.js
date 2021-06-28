//index.js
const Joi = require ('joi');
const express = require ('express');
const MongoClient = require('mongodb').MongoClient;
const app = express();

app.use(express.json());

MongoClient.connect('mongodb+srv://usernum1:usernum1pass@task002.t0gnu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{
    useUnifiedTopology: true
}).then(client => {
    console.log('Connected to Database')
    const db = client.db('myFirstDatabase')
    const gradesCollection = db.collection('gradeStatusCollection')

    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Listening from port ${port}...`));

    console.log ('This is a practice API. Hi!!!');
    app.get('/', (req, res) => {
        res.send('Hi!!!! This is my sample API');
    })
    app.get('/api/grades', (req, res) => {
        db.collection('gradeStatusCollection').find({}).toArray((err, result) => {
            if (err) throw err;
                res.send(result);
            });
    });
    app.post('/api/grades', (req, res) =>{
        const { error } = validateGrades(req.body);
        if (error){
            res.send(error.details[0].message);
            return;
        }
        gradesCollection.insertOne(req.body);
        res.send(req.body);
    });

function validateGrades(grade){
    const schema = {
        gradeStatus : Joi.string().min(4).required()
    };
    return Joi.validate(grade, schema);
}
});