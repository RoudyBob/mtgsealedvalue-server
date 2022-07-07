const { User } = require('../models');
const { Router } = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const validateSession = require ('../middleware/validate-session');
const router = Router();

// This endpoint allows a new user to create a user account
router.post('/signup', function (req, res) {
    User.create({
        email: req.body.user.email,
        password: bcrypt.hashSync(req.body.user.password, 13),
        firstname: req.body.user.firstname,
        lastname: req.body.user.lastname,
        currency: req.body.user.currency
    })
    .then(
        function createSuccess(user) {
           let token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});
           console.log(user)
           res.status(200).json({
               user: user,
               message: "User successfully registered!",
               sessionToken: token
            });
        }
    )
    .catch(err => res.status(500).json({ error: err }));
});

// This endpoint allows user to update information
// TODO: Add password update capability
router.put('/:id', validateSession, function (req, res) {
    if (req.user.id == req.params.id) {
        const query = { where: { id: req.params.id, id: req.user.id }};
        const updateUser = {
            email: req.body.user.email,
            firstname: req.body.user.firstname,
            lastname: req.body.user.lastname
        };
        User.update(updateUser, query)
        .then(rowsAffected => res.status(200).json(rowsAffected))
        .catch(err => res.status(500).json({ error: err }));
    } else {
        // User
        return res.status(403).json({ message: "Not Authorized to update user information." })
    }
});

// This endpoint validates the user and password and provides a token
router.post('/login', function (req, res) {
    User.findOne({
        where: {
            email: req.body.user.email
        }
    })
    .then(
        function loginSuccess(user) {
            if(user) {
                bcrypt.compare(req.body.user.password, user.password, function (err, matches) {
                    if (matches) {
                        let token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});

                        res.status(200).json({
                            user: user,
                            message: "User login successful!",
                            sessionToken: token
                        })

                    } else {
                        return res.status(502).send({ error: 'Login Failed' });
                    };
                }); 
            } else {
                return res.status(500).json({ error: 'User does not exist.' })
            };
        })
    .catch(err => res.status(500).json({error: err}));
})

// This endpoint gets user information by ID
router.get('/:id', validateSession, function (req, res) {
    if (req.user.id == req.params.id) {
        const query = {
            where: {id: req.params.id}
        }
        User.findOne(query)
            .then((user) => res.status(200).json(user))
            .catch((err) => res.status(500).json({ error: err }));
    } else {
        // No User Found
        return res.status(403).json({ message: "Not Authorized to view user information." })
    }
});

module.exports = router;