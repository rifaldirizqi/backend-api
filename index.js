const express = require ('express')
const app = express()
var bodyParser = require('body-parser')
var jwt = require('jsonwebtoken');
var secretkey = 'wwwwwwww'
var mongoclient = require('mongodb').MongoClient
var ObjectId = require('mongodb').ObjectId
const logger = require('morgan')

//app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(logger('dev'))

var db = null
mongoclient.connect("mongodb://localhost:27017/apidb", (err, client) => {
    if (err) throw err
    db = client.db('apidb')
    console.log('mongodb connected')
})

app.get('/', (req, res) => {
    let obj = {
        'username'  : 'Dogo',
        'password'  : '12345'
    }
    res.status(404).end('Tidak ditemukan')
})

app.post('/register', (req, res) => {
    let datadb = {
        'username' : req.body.username,
        'password' : req.body.password
    }
    db.collection('users').insertOne(datadb)
    .then ((result) => {
        res.json(result)
    })
})

app.post('/login', (req, res) => {
    db.collection('users').findOne({
        'username' : req.body.username,
        'password' : req.body.password  
    })
    .then((result) => {
        if (result == null){
            res.status(404).end('Username/Password Salah')
        }else{
            let token = jwt.sign(result, secretkey)
            let responsedata = {
                token : token,
                userdata : result
            }
            res.json(responsedata)
        }
    })
})

app.put('/update', (req, res) => {
    var token = req.headers['authorization']
    jwt.verify(token, secretkey, function(err, decoded) {
        if(decoded == undefined){
            res.status(403).end('Token Salah')
        }else{
            let userid = decoded._id
            db.collection('users').findOne({
                '_id' : ObjectId(userid)
            })
            .then((result) => {
                if (result == null){
                    res.status(404).end('Username/Password Salah')
                }else{
                    db.collection('users').updateOne(
                        {'_id' : ObjectId(userid)},
                        {$set : {'username' : req.body.username}}
                    )
                    .then ((resultupdate) => {
                        res.json(resultupdate)
                    })
                }               
            })
        }
    })
})


app.get('/myprofile', (req, res) => {
    var token = req.headers['authorization']
    jwt.verify(token, secretkey, function(err, decoded) {
        if(decoded == undefined){
            res.status(403).end('Token Salah')
        }else{
            let userid = decoded._id
            db.collection('users').findOne({
                '_id' : ObjectId(userid)
            })
            .then((result) => {
                if (result == null){
                    res.status(404).end('Username/Password Salah')
                }else{
                    res.json(result)
                }               
            })
        }
    })
})

app.delete('/delete', (req, res) => {
    var token = req.headers['authorization']
    jwt.verify(token, secretkey, function(err, decoded) {
        if(decoded == undefined){
            res.status(403).end('Token Salah')
        }else{
            let userid = decoded._id
            db.collection('users').findOne({
                '_id' : ObjectId(userid)
            })
            .then((result) => {
                if (result == null){
                    res.status(404).end('Username/Password Salah')
                }else{
                    db.collection('users').deleteOne(
                        {'_id' : ObjectId(userid)}
                    )
                    .then ((resultdelete) => {
                        res.json(resultdelete)
                    })
                }               
            })
        }
    })
})

app.get('/myprofile/:userid', (req, res) => {
    let userid = req.params.userid
    res.send('My profile ' + userid)
})

app.post('/user', (req, res) => {
    let body = req.body
    res.json(body)
})

app.post('/account', (req, res) => {
    let body = req.body
    res.json(body)
})

app.put('/user', (req, res) => {
    let body = req.body
    res.json(body)
})

app.delete('/user', (req, res) => {
    let body = req.body
    res.json(body)
})

app.listen(3000)