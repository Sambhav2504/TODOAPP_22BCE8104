const jwt = require('jsonwebtoken');
exports.authenticate = async (req, res) => {
    const token = req.headers['Authorization']?.split(' ')[1]
    if (token) {
        jwt.verify(
            token,
            "key is not secure",
            (error, decoded) => {
                if (error) {
                    return res.status(401).send({
                        isLoggedIn: false,
                        message: "Authentication Failed"
                    })
                }
                req.user = {};
                req.user.id = decoded.id;
                req.user.username = decoded.username;
            })
    } else {
        res.status(401).send({ message: 'You are not an authenticated user. Please login or signup to continue' });
    }
}