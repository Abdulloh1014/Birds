
import Errors, { HttpCode, Message } from "../libs/Errors";
import { AUTH_TIMER } from "../libs/config";
import { Member } from "../libs/types/member"
import jwt from "jsonwebtoken";        // token yaratish va tekshirish uchun ishlatiladi


class AuthService {
    private readonly secretToken;
    constructor() {
        this.secretToken = process.env.SECRET_TOKEN as string;
    }
   
        public async createToken( payload: Member) {
         return new Promise((resolve, reject) => {      // resolve() → hammasi yaxshi bo‘lsa muvaffaqiyatli natija qaytaradi
            const duration = `${AUTH_TIMER}h`;          // reject() → xatolik bo‘lsa xato qaytaradi
             jwt.sign(  //sign() → “ma’lumotni olib, JWT tokenga aylantiradi.    // "{ jwt }" token yaratish va tekshirish uchun ishlatiladi
                payload,
                process.env.SECRET_TOKEN as string,
                {
                    expiresIn: duration,    // expiresIn — tokenning amal qilish vaqtini belgilaydi.
                },
                (err, token) => {
                    if(err) reject(new Errors(HttpCode.UNAUTHORIZED, Message.TOKEN_CREATE_FAILED)
                    );
                else resolve(token as string);
                }
             );

         });
        }


        
        public async checkAuth(token: string): Promise<Member> {
           const result: Member = (await jwt.verify(token, this.secretToken)) as Member;
           console.log(`--- [AUTH] memberNick: ${result.memberNick}---`);
           return result;
        }


    }


    export default AuthService;
    