const mongoose = require("mongoose");
const Listing = require("../models/listing");
const initData = require("./data");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"
main().then((res) => {
    console.log("Database connected");
}).catch((err) => {
    console.log("Database not connected")
})

async function main() {
    await mongoose.connect(MONGO_URL)
};







//  async function initDB() {
//     await Listing.deleteMany({});
//     console.log("successfully deleted");

    
// }
// initDB()

const initDb = async ()=>{
    await Listing.deleteMany({});
  initData.data = initData.data.map((obj)=>({...obj, owner:"688e2a94a6ae7d7cf65bced7"}))
    await Listing.insertMany(initData.data);
    console.log("data was added");
    
    
}
initDb()



