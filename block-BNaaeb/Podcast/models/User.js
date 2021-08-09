var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bcrypt = require('bcrypt');

var userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true},
  password: { type: String, required: true},
  category: {type: String, required: true},
  isAdmin: {type: Boolean, default: false}
});

userSchema.pre('save', function(next){
  if(this.email && this.email === 'destinedks@gmail.com'){
    this.isAdmin = true;
  }
  if(this.password){
    bcrypt.hash(this.password, 10, (error, hashed) => {
      if(error) return next(error);
      this.password = hashed;
      return next();
    })
  }else{
    next();
  }
})

userSchema.methods.comparePassword = function(password, cb){
    bcrypt.compare(password, this.password, (error, result) => {
      return cb(error, result);
    });
} 

module.exports = mongoose.model('User', userSchema);
