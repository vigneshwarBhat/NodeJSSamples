var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
const saltRounds = 10;
const Schema = mongoose.Schema;
const userModel = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
    //firstName: String ,
    //lastname: String,
    //email: String,
    //password: String,
    //permissionLevel: Number
});

userModel.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.hash(user.password, saltRounds, function (err, hash) {
            if (err) { 
                return next(err);
            }
            user.password = hash;
            next();
        });
    }
    else {
        return next();
    }
});


userModel.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};
const user=mongoose.model('user', userModel);
module.exports = user;