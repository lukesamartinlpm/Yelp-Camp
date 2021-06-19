const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

const UsersSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    }
})

UsersSchema.plugin(passportLocalMongoose)

const Users = mongoose.model('users',UsersSchema)

module.exports = Users