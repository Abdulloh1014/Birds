// Backend


import cors from "cors";
import express from 'express';   // bu serverni quradi
import path from 'path';   // path (Windows, Linux, macOS) yo‘l formatlari farq qiladi —path moduli bu farqlarni avtomatik hisobga olib, har joyda to‘g‘ri ishlaydigan yo‘l yaratadi.
import router from "./router"
import routerAdmin from "./router-admin"
import morgan from "morgan";
import cookieParser from "cookie-parser";
import {MORGAN_FORMAT} from "./libs/config";
import { Server as SocketIOServer } from "socket.io";
import http from "http";

import session from "express-session";
import ConnectMongoDB from "connect-mongodb-session";
import { T } from './libs/types/comman';

const MongoDBStore = ConnectMongoDB(session);
const store = new MongoDBStore({
    uri: String(process.env.MONGO_URL),
    collection: "sessions"
});

/**  1-ENTRANSE  **/
const app = express();

app.use(express.static(path.join(__dirname, "public")));   // `join()` — bir nechta yo‘l qismlarini (masalan, papka nomlari) bitta to‘liq yo‘lga birlashtiradi \\\ __dirname — joriy papka manzili  
app.use("/uploads", express.static("./uploads"));
app.use(express.urlencoded({extended: true}));   // Tradition API ga hizmat qiladi.     // urlencoded() — forma orqali kelgan ma’lumotlarni o‘qiydi  \\\ murakkab ma’lumotlarni ham o‘qishga imkon beradi  
app.use(express.json());                                                   // Rest. API. React API ga hizmat qiladi.         // IPA sifatida req bo'layotgan datalarni bodysida kelyotgan json datani o'tkazishga ruhsat beryabmiz
app.use(cors({credentials: true, origin: true,}));
app.use(cookieParser());                 // kelayotgan requestdagi cookie’larni o‘qish uchun kerak.  //⚡ Express serveri cookie’larni o‘zi o‘qiy olmaydi.      
app.use(morgan(MORGAN_FORMAT));     // formatini (metod, URL, vaqt va h.k.) ko‘rsatadi.       


/**  2-SESSION  **/

app.use(
    session({
        secret: String(process.env.SESSION_SECRET),  //sessionlarni  hosil qilishda ishlatiladi
        cookie: {
            maxAge: 1000 * 3600 * 6, // 6h foydalanuvchi tizimga kirganda serverda vaqtincha saqlanadigan ma’lumotlar (masalan: login holati, user ID, token va h.k.).
        },
        store: store, // yuqoridagi mantiqni kiritganmiz
        resave: true, // foydalanuvchi oxirgi marta kirgan vaqtidan 6 soat malomotlarini sessionda saqledi
        saveUninitialized: true,      //. yangi, hali to‘ldirilmagan sessiyalarni ham saqlaydi.


    })
);

app.use( function (req, res, next) {
    const sessionInstance = req.session as T;
    res.locals.member = sessionInstance.member;
    next();
});

/**  3-VIEWS  **/
app.set('views', path.join(__dirname, "views"));
app.set("view engine", "ejs");

/**  4-ROUTERS  **/
app.use('/admin', routerAdmin) //for admin  // EJS
app.use('/', router)           //for user   // SPA  /  REACT // Middleware Design Pattern

const server = http.createServer(app);
const io = new SocketIOServer(server, {
    cors: {
        origin: true,
        credentials: true,
    }
});

let summaryClient = 0;
io.on("connection", (socket) => {
    summaryClient++;
    console.log(`Connection & total [${summaryClient}]`); 

    socket.on("disconnect", () => {
        summaryClient--;
        console.log(`Disconnect & total [${summaryClient}]`); 
    });
});

export default server;