const user = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
    const newUser = req.body;

    try {
        const takenUsername = await user.findOne({ username: newUser.username });
        const takenUserEmail = await user.findOne({ email: newUser.email });
        if (takenUsername || takenUserEmail) {
            return res.status(403).send({ message: "This is an existing account" });
        } else {
            const salt = await bcrypt.genSalt(10);
            newUser.password = await bcrypt.hash(req.body.password, salt);
            const dbUser = new user({
                username: newUser.username.toLowerCase(),
                email: newUser.email.toLowerCase(),
                password: newUser.password,
            });

            dbUser.save();
            return res.status(201).send({ message: "New user has been successfully registered." });
        }
    } catch (error) {
        console.error(error.message);
        return res.status(400).send({ message: 'Registration Error!' });
    }
}

exports.loginUser = async (req, res) => {
    try {
        const userLoggingIn = req.body;
        const existingUser = await user.findOne({ username: userLoggingIn.username });
        if (!existingUser) {
            return res.status(401).send({ message: "Please enter valid username and password." });
        }
        const isPasswordCorrect = await bcrypt.compare(userLoggingIn.password, existingUser.password);
        if (isPasswordCorrect) {
            const payload = {
                id: existingUser._id,
                username: existingUser.username
            }
            jwt.sign(
                payload,
                "key is not secure",
                { expiresIn: 3 * 24 * 60 * 60 },
                (err, token) => {
                    if (err) {
                        return res.status(400).send({ message: err.message });
                    }
                    return res.status(200).send({
                        message: "Success",
                        token: "Bearer " + token
                    })
                }
            )
        } else {
            return res.status(401).send({ message: "Please enter valid username and password." });
        }
    } catch (error) {
        console.log(error.message);
        return res.status(400).send({message: "User Login Error"});
    }
}