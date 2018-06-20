const express = require ('express')
const app = express()
var bodyParser = require('body-parser')
var jwt = require('jsonwebtoken');
var secretkey = 'wwwwwwww'

//app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
    let obj = {
        'username'  : 'Dogo',
        'password'  : '12345'
    }
    res.status(404).end('Tidak ditemukan')
})

app.post('/login', (req, res) => {
    let body = req.body
    if(body.username == 'wow' && body.password == '1234'){
        let token = jwt.sign({'Hello' : 'World'}, secretkey)
        res.send(token)
    }else{
        res.status(403).end('Forbidden')
    }

})

app.get('/profile', (req, res) => {
    var token = req.headers['authorization']
    jwt.verify(token, secretkey, function(err, decoded) {
        if(decoded == undefined){
            res.status(403).end('Forbidden')
        }else{
            res.status(200).end('OK')
        }
    });
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