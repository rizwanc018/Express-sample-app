const express = require('express')
const hbs = require('hbs')
const session = require('express-session')
const app = express()
const port = 3000

const { products } = require('./data')
const creds = require("./config/credentials")

app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'hbs')
hbs.registerPartials(__dirname + '/views/partials');
app.use(session({ secret: 'secure', saveUninitialized : false, cookie: { maxAge: 600000 }}))

const verifyLogin = (req, res, next) => {
    if (req.session.userloggedIn) {
        next()
    } else {
        res.redirect('/login')
    }
}

app.get('/', verifyLogin, (req, res) => {
    res.render("index", { products, isLoggedIn: req.session.userloggedIn })
})

app.get('/store/:id', verifyLogin, (req, res) => {
    const [item] = products.filter(itm => itm.id === Number(req.params.id))
    res.render('store', { item, isLoggedIn: req.session.userloggedIn })
})

app.get('/login', (req, res) => {
    if (req.session.userloggedIn) {
        res.redirect('/')
    } else {
        res.render('login', { loginErr: req.session.loginErr })
        req.session.loginErr = null
    }
})

app.post('/login', (req, res) => {
    if (creds.EMAIL === req.body.email && creds.PASSWORD === req.body.password) {
        req.session.userloggedIn = true
        res.redirect('/')
    } else {
        req.session.loginErr = true
        res.redirect('/')
    }
})

app.get('/logout', (req, res) => {
    req.session.userloggedIn = false
    res.redirect('/')
})

app.listen(port, () => {
    console.log(`Listening on port : ${port}`);
})
