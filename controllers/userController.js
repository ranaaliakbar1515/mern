const userModal = require("../modals/user_modal")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

exports.login = (req, res) => {
    res.render("authentication/login", {layout: false})
}

exports.signup = (req, res) => {
    res.render("authentication/signup", {layout: false})
}

exports.insertUser = (req, res) => {
    const user = new userModal(req.body)
    user.save().then((r) => {
        res.redirect('/login')
    }).catch((err) => {
        console.log("user registration: " + err)
    })
}

exports.loginUser = (req, res) => {
    userModal.findOne({user_email: req.body.user_email}).then((user) => {
        if(user) {
            bcrypt.compare(req.body.user_password, user.user_password, function(err, result) {
                if(result) {
                    console.log("login successful")
                    const token = jwt.sign({user_id: user._id, user_name: user.user_name}, process.env.secret, {expiresIn: 3600})
                    res.cookie("access_token", token)
                    res.redirect('/')
                } else {
                    console.log("password incorrect")
                }
            });
        } else {
            console.log("Credentials invalid...")
        }
    }).catch((err) => {
        console.log("user find: " + err)
    })
}

exports.logout = (req, res) => {
    res.clearCookie("access_token")
    res.redirect('/login')
}
