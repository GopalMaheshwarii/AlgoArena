let mongoose=require("mongoose");


async function main(){
    await mongoose.connect(process.env.DB_PASS_KEY);
}

module.exports=main;