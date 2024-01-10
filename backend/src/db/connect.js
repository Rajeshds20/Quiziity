const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async (MONGO_URI) => {
    try {
        const conn = await mongoose.connect(MONGO_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch (e) {
        console.error(`Error: ${e.message}`);
        process.exit(1);
    }
}

module.exports = connectDB;