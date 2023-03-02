const express = require('express')
const app = express()
const hbs = require('hbs')
const session = require('express-session')
const port = 3000
const nocache = require("nocache");
// const { products } = require('./data')
const products  = require('./data')

const loginRouter = require('./routers/login')

app.use(nocache());
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'hbs')
hbs.registerPartials(__dirname + '/views/partials');
app.use(session({ secret: 'secure', cookie: { maxAge: 600000 }}))


app.use('/login', loginRouter)

const verifyLogin = (req, res, next) => {
    if (req.session.userloggedIn) {
        next()
    } else {
        res.redirect('/login')
    }
}

app.use(verifyLogin)

app.get('/', (req, res) => {
    res.render("index", { products, isLoggedIn: req.session.userloggedIn })
})

app.get('/table', (req, res) => {
    res.render("table", { products, isLoggedIn: req.session.userloggedIn })
})

app.get('/store/:id', (req, res) => {
    const [item] = products.filter(itm => itm.id === Number(req.params.id))
    res.render('store', { item, isLoggedIn: req.session.userloggedIn })
})

app.get('/logout', (req, res) => {
    req.session.destroy()
    console.log(req.session)
    res.redirect('/')
})

app.listen(port, () => {
    console.log(`Listening on port : ${port}`);
})