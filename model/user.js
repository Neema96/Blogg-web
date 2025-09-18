var mongoose = require('mongoose');
var crypto = require('crypto')
//var uuid = require('uuid/v1')
const { v1: uuidv1 } = require('uuid');
const userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    salt:{
        type:String,
    },
    hashedPassword:{
        type:String,
    }
})

userSchema.virtual('password').set(function(password){
this._password = password;
this.salt = uuidv1();
this.hashedPassword = this.encryptPassword(password)
}).get(function(){
    this._password
}
)

userSchema.methods = {
    authenticate: function(plaintext){
        return this.encryptPassword(plaintext) === this.hashedPassword
    },

    encryptPassword: function(password){
        if(!password){
            return ''
        }
        try{
            
        return crypto.createHmac('sha1',this.salt).update(password).digest('hex')
        }
        catch(e){
            return e;
        }
    }

}

module.exports=mongoose.model('User',userSchema)


// virtual fields
