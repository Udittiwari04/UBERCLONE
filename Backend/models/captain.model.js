const mongoose = require ('mongoose')
const jwt= require('jsonwebtoken');
const bcrypt = require('bcrypt')


const captainSchema = new mongoose.Schema({
  fullname:{
    firstname:{
        type:String,
        required: true,
        minlength:[3,'Firstname must be at least 3 character long']
    },
    lastname:{
        type:String,
        minlength:[3,'Firstname must be at least 3 character long']
    }
  },
  email:{
    type:String,
    require:true,
    unique:true,
    lowercase:true,
    
  },
  password:{
    type:String,
    require:true,
    select:false
  },
  socketId:{
    type:String
  },
  status:{
    type:String,
    enum:['active','inactive'],
    default:'inactive'
  },
  vehicle:{
    color:{
        type:String,
        required:true,
        minlength:[3,'Firstname must be at least 3 character long']
    },
    plate:{
        type:String,
        required:true,
        minlength:[3,'Firstname must be at least 3 character long']
    },
    capacity:{
        type:Number,
        required:true,
        min:[1,'Capacity must be atleast 1']
    },
    vehicleType:{
        type:String,
        required:true,
        enum:['car','motorcycle','auto']
    }
  },

  location:{
    lat:{
        type:Number,
    },
    lag:{
        type:Number,
    }
  }
})


captainSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_KEY,{ expiresIn:'24h'});
    return token;
};

captainSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

captainSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
};

const captainModel = mongoose.model('captain', captainSchema);
module.exports = captainModel;