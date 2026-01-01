


import dotenv from 'dotenv';      // dotenv paketini chaqiradi (ya’ni loyihada .env fayl bilan ishlash imkonini beradi).
dotenv.config();   // .env fayldagi o‘zgaruvchilarni process.env ga yuklaydi. bu orqali maxfiy ma’lumotlarni kod ichiga yozmasdan ishlatiladi.

import mongoose from "mongoose";
import app from "./app";   // app ni ya'ni express() ni chaqiryabmiz

mongoose     // mongoDB ga ulab beradigon package
  .connect(process.env.MONGO_URL as string, {})      // .env faylga yozilgan MongoDB manzilini olib beryabti
                                                
    .then((data) => {
    console.log("MongoDB connection succeed");
    const PORT = process.env.PORT ?? 3003;
    app.listen(PORT, function () {    // listen()- serverni ishga tushiradi. Ya’ni u berilgan portni eshitishni boshlaydi va shu portga keladigan so‘rovlarni qabul qiladi.
        console.info(`The server is running succesfully on port: ${PORT}`);
        console.info(`Admin project on http://localhost${PORT}/admin \n`);
    });
   })
   
   .catch((err) => console.log("ERROR on connection MongoDB", err))

