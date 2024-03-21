const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const secret = "beacondms"
const bcrypt = require('bcryptjs')

router.post('/register', async (req, res) => {

    try {
        const newPassword = await bcrypt.hash(req.body.password, 10)
        const user = await User.create(
            {
                name: req.body.name,
                email: req.body.email,
                password: newPassword
            }
        );
        res.json({ "status": "ok" });
    } catch (err) {
        res.status(500).send({ status: 'error', error: err })
    }
})
router.post('/login', async (req, res) => {
    try {

        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return { status: 'error', error: 'Invalid login' }
        }
        const isPasswordValid = await bcrypt.compare(
            req.body.password,
            user.password
        )
        if (isPasswordValid) {

            const token = jwt.sign({
                email: user.email,
                name: user.name
            }, secret)
            res.json({ status: 'ok', user: token });
        } else {
            res.json({ status: 'ok', user: false });
        }
    }
    catch (err) {
        res.json({ status: 'error', error: err });
    }

})


module.exports = router;