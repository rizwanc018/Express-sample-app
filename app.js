const express = require('express')
const hbs = require('hbs')
const session = require('express-session')
const app = express()
const port = 3000
const { products } = require('./data')
const loginRouter = require('./routers/login')
const nocache = require("nocache");

app.use(nocache());
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'hbs')
hbs.registerPartials(__dirname + '/views/partials');
app.use(session({ secret: 'secure', saveUninitialized : false, cookie: { maxAge: 600000 }}))

app.use('/login', loginRouter)

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

app.get('/table', verifyLogin, (req, res) => {
    res.render("table", { products, isLoggedIn: req.session.userloggedIn })
})

app.get('/store/:id', verifyLogin, (req, res) => {
    const [item] = products.filter(itm => itm.id === Number(req.params.id))
    res.render('store', { item, isLoggedIn: req.session.userloggedIn })
})

app.get('/logout', (req, res) => {
    req.session.userloggedIn = false
    res.redirect('/')
})

app.listen(port, () => {
    console.log(`Listening on port : ${port}`);
})