const express = require('express')
const hbs = require('hbs')
var path = require('path')
const app = express()
const port = 3000

const { products } = require('./data')

// app.use(express.static('./public'))
app.use(express.static('public'))
app.set('view engine', 'hbs')
hbs.registerPartials(__dirname + '/views/partials');
// app.use(express.urlencoded({extended: true}))
// app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
    // console.log(data)
    res.render("index", { title: "Express", products: products })
})

// app.post('/signup', (req, res) => {
//     // console.log(req)
//     let email = req.body.email
//     res.render('index', {title : "Express", email: email})
// })

app.listen(port, () => {
    console.log(`Listening on port : ${port}`);
})
