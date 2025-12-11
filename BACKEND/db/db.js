 const  mongoose = require('mongoose');


 function connectToDb() {
     mongoose.connect( process.env.DB_CONNECT)
     .then(() => {
        const isAtlas = process.env.DB_CONNECT.includes('mongodb+srv');
        const dbName = process.env.DB_CONNECT.split('/').pop().split('?')[0];
        console.log(`✅ Connected to ${isAtlas ? 'MongoDB Atlas (Cloud)' : 'MongoDB (Local)'} - Database: ${dbName}`);
     }).catch((err) => {
        console.log('❌ Database connection failed:', err.message);
     });
 }
 module.exports = connectToDb;