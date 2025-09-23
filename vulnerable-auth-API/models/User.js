const mongoose =require ('mongoose');
const bcrypt =require ('bcryptjs');

//define schema,defines the structure of a user
const userschema = new mongoose.Schema({
    username:{type:String},// we did not validate
    phoneNumber:{type:String},
    email:{type:String,required: true,unique:true},
    password:{type:String,required:true},
});

// to make this api vulnerable i intentionally commented the bcrypt block

/*

//has passwords before storing them
userschema.pre('save',async function (next){
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password,12);//12 is salt rounds
    next();
});
userschema.methods.comparePassword=function (candidatePassword) { //compare the password with the hashed ones,used in logins
    return bcrypt.compare(candidatePassword, this.password);

};
*/



//converts the schemainto Mongoose model called user
module.exports =mongoose.model('user',userschema);