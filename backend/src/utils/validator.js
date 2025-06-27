var validator = require('validator');

let validate=(data)=>{
    //mandatory field
    let mandatoryField=["firstName","emailId","password"];
    let isAllowed=mandatoryField.every((key)=>key in data)
    if(!isAllowed)
        throw new Error("some field is missing ");
    //email
    if(!validator.isEmail(data.emailId))
        throw new Error("invalid email");

    //strong password
    if(!validator.isStrongPassword(data.password))
        throw new Error("week password");
   
}
module.exports=validate
