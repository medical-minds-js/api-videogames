const express = require('express')
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const videogameModel = require("./models/videogame.model");
const developerModel = require("./models/developer.model");
const consoleModel = require("./models/console.model");

//config
//---------------------------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

//require('dotenv').config({ path: `${__dirname}/.env` });

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//inicia
//---------------------------------------------------

app.get('/', (req, res) => {
    return res.status(200).send({ message:'Grumafe Api-Videogames' });
});

const urlmongo = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DB}`;


mongoose.connect(urlmongo, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).then(
    () => console.log('Connected to Database', process.env.MONGO_DB),
    err => console.error('ERROR: connection to database.', err)
);




app.all("/api/*",(req, res, next)=>{
    const token = req.headers.authorization;
    try{
        const result = jwt.verify(token, process.env.SECRET);
    } catch(e){
        return res.status(401).send();
    }
    next();
});

// servicios
//---------------------------------------------------

app.post('/access/get-token', (req, res) => {

    const token = jwt.sign(req.body, process.env.SECRET);
    res.status(200).send({ success: true, token });

});

app.post('/api/videogames/search', async (req, res) => {

    try{
        const total = await videogameModel.countDocuments(req.body.filters);
        const videogames = await videogameModel.find(req.body.filters)
            .skip(req.body.pagination.limit*(req.body.pagination.page-1))
            .limit(req.body.pagination.limit);
    
        res.send({ success: true, videogames, total});
    } catch (err){
        req.status(500).send(err);
    }
    
});

app.get('/api/videogames/:id', async (req, res) => {
    try{
        const videogame = await videogameModel.findOne({_id: req.params.id});
        res.send({ success: true, videogame});
    } catch (err){
        req.status(500).send(err);
    }
});

app.post('/api/videogames', async (req, res) => {
    try{
        const result = await videogameModel.create(req.body);
        res.send({ success: true });
    } catch (err){
        req.status(500).send(err);
    }
});

app.put('/api/videogames/:id', async (req, res) => {
    try{
        const result = await videogameModel.updateOne({_id: req.params.id},{ $set: req.body });
        res.send({ success: true });
    } catch (err){
        req.status(500).send(err);
    }
});

app.get('/api/developer/catalog', async (req, res) => {
    try{
        const developers = await developerModel.find({});
        res.send({ success: true, developers});
    } catch (err){
        req.status(500).send(err);
    }
});


app.get('/api/consoles/catalog', async (req, res) => {
    try{
        const consoles = await consoleModel.find({});
        res.send({ success: true, consoles});
    } catch (err) {
        req.status(500).send(err);
    }
});

app.get('/api/consoles/dashboard', async (req, res) => {
    try{
        const dashboard = await videogameModel.aggregate([
            { $unwind: '$console'},
            {
                $group: {
                    _id: '$console.name',
                    total: { $sum: 1}
                }
            },
            {
                $project: {
                   _id: 0,
                   console: '$_id',
                   total: 1
                }
            }
        ]);
        res.send({ success: true, dashboard});
    } catch (err) {
        req.status(500).send(err);
    }
});


//start
//---------------------------------------------------
app.listen(process.env.PORT || 3001, () => {
    console.log(`Server running on port ${process.env.PORT || 3001}`);
});
