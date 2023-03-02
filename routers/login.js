const express = require('express')
const router = express.Router()
const creds = require("../config/credentials")
const bcrypt = require('bcrypt');

router.route('/')
.get((req, res) => {
        if (req.session.userloggedIn) {
            res.redirect('/')
        } else {
            res.render('login', { loginErr: req.session.loginErr })
            req.session.loginErr = null
        }
    })
    .post(async(req, res) => {
        const HardPassword = await bcrypt.hash(creds.PASSWORD, 10)
        const password = await bcrypt.hash(req.body.password,10)
        if (creds.EMAIL === req.body.email && bcrypt.compare(HardPassword, password)) {
            req.session.userloggedIn = true
            res.redirect('/')
        } else {
            req.session.loginErr = true
            res.redirect('/')
        }
    })

module.exports = router