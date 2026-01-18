// for ADMIN

import { NextFunction, Request, Response } from "express";
import { T } from "../libs/types/comman";
import MemberService from "../models/Member.service";
import { AdminRequest, MemberInput, LoginInput } from "../libs/types/member";
import { MemberType } from "../libs/enums/member.enum";
import Errors, { HttpCode, Message } from "../libs/Errors";

const memberService = new MemberService();

const founderController: T = {};
founderController.goHome = (req: Request, res: Response) => {
    try {
        console.log("goHome");
          // Home page
            
             res.render("Home");
        // send() || json() || redirect() || end() || render()
    } catch(err) {
        console.log("Error, goHome", err);
         res.redirect("/admin");
    }
};

founderController.getSignup = (req: Request, res: Response) => {
    try {
        console.log("getSignup");
        res.render("Signup");
       
    } catch(err) {
        console.log("Error, getSignup", err);
         res.redirect("/admin");
    }
};

founderController.getLogin = (req: Request, res: Response) => {
    try {
        console.log("getLogin");
        res.render("Login");
        
    } catch(err) {
        console.log("Error, getLogin", err);
        res.redirect("/admin");
    }
};



founderController.processSignup = async (req: AdminRequest, res: Response) => {
    try {
        console.log("processSignup");
        console.log("req.body qismi:", req.body);
            const file = req.file;
            console.log(file)
            // if (!file)
            //     throw new Errors(HttpCode.BAD_REQUEST, Message.SOMETHING_WENT_WRONG)
       
        const newMember: MemberInput = req.body;      // req.body ichida foydalanuvchidan kelyotgan ma'lumotni olyabti
       newMember.memberImage = file?.path.replace(/\\/g, "/");
        newMember.memberType = MemberType.FOUNDER;   // A'zoning turini RESTAURANT deb belgilash
        const result = await memberService.processSignup(newMember);   // Yangi a'zoni ro'yxatdan o'tkazish jarayoni
        // TODO: SESSIONS AUTHENTICATION


        req.session.member = result;  // browser cookis ichiga sidni saqlab kelyabti va session collectionga "result" ichidagi ma'lumotni saqledi
        req.session.save(function () {     // Sessiyani saqlab qo'yish
            res.redirect("/admin/product/all");      // Javob sifatida "result" ni clientga qaytarish
        });


        
    } catch(err) {
        console.log("Error, processSignup", err);
         const message = err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
        res.send(`<script> alert("${message}"); window.location.replace('/admin/signup') </script>`);

        //res.send(err);
    }
};

founderController.processLogin = async (req: AdminRequest, res: Response) => {
    try {
        console.log("processLogin");
     

        const input: LoginInput = req.body
        const result = await memberService.processLogin(input);
       // TODO: SESSIONS AUTHENTICATION

        req.session.member = result;  
        req.session.save(function () {
         res.redirect("/admin/product/all"); 
        });
    } catch(err) {
        console.log("Error, processLogin", err);
        const message = err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
        res.send(`<script> alert("${message}"); window.location.replace('/admin/login') </script>`);

    }

};


founderController.logout = async (req: AdminRequest, res: Response) => {
    try {
        console.log("logout");

        req.session.destroy(function () {   // destroy() → sessiyani butunlay yo‘q qiladi (logout).
            res.redirect("/admin");
        })


    } catch(err) {
        console.log("Error, logout", err);
       res.redirect("/admin");    // redirect() → foydalanuvchini boshqa sahifaga o‘tkazadi (yo‘naltiradi).
    }

};


founderController.getUsers = async (req: Request, res: Response) => {
    try {
        console.log("getUsers");
        const result = await memberService.getUsers();
        console.log("result:", result)
        res.render("users", { users: result});
       } catch(err) {
        console.log("Error, getUsers", err);
        res.redirect("/admin/login");
    }
};

founderController.updateChosenUser = async (req: Request, res: Response) => {
    try {
        console.log("updateChosenUser");
        const result = await memberService.updateChosenUser(req.body);
        
        res.status(HttpCode.OK).json({data: result });

       } catch(err) {
        console.log("Error, updateChosenUser", err);
        if(err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standart.code).json(Errors.standart)
    }
};


founderController.checkAuthSession = async (req: AdminRequest, res: Response) => {
    try {
        console.log("checkAuthSession");
      if(req.session?.member) 
      res.send(`<script> alert("${req.session.member.memberNick}")</script>`);
      else res.send(`<script> alert("${Message.NOT_AUTENTICATED}")</script>`);
        } catch(err) {
        console.log("Error, checkAuthSession", err);
        res.send(err);
    }
};



founderController.verifyFounder = (
    req: AdminRequest, res: Response, next: NextFunction
) => {
    
  if(req.session?.member?.memberType === MemberType.FOUNDER) {
  req.member = req.session.member;
  console.log("SESSION MEMBER", req.session?.member);

    next();
    } else {
    const message = Message.NOT_AUTENTICATED;
    res.send(`<script> alert("${message}"); window.location.replace('/admin/login'); </script>`);
    }
         
};



export default founderController;

