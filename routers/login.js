const express = require('express')
const router = express.Router()
const creds = require("../config/credentials")


router.route('/')
    .get((req, res) => {
        if (req.session.userloggedIn) {
            res.redirect('/')
        } else {
            res.render('login', { loginErr: req.session.loginErr })
            req.session.loginErr = null
        }
    })
    .post((req, res) => {
        if (creds.EMAIL === req.body.email && creds.PASSWORD === req.body.password) {
            req.session.userloggedIn = true
            res.redirect('/')
        } else {
            req.session.loginErr = true
            res.redirect('/')
        }
    })
module.exports = router