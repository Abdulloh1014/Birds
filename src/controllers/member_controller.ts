// for USER

import { NextFunction, Request, Response } from "express";
import { T } from "../libs/types/comman"
import MemberService from "../models/Member.service";
import { ExtendedRequest, LoginInput, Member, MemberInput, MemberUpdateInput } from "../libs/types/member";
import Errors, { HttpCode, Message } from "../libs/Errors";
import AuthService from "../models/Auth.service";
import { AUTH_TIMER } from "../libs/config";

const memberService = new MemberService();
const authService = new AuthService();

// REACT loyihamiz uchun

const memberController: T = {};


memberController.getStore = async  (req: Request, res: Response) => {
     try {
        console.log("getRestaurant");
        const result = await memberService.getFounder();
     
        res.status(HttpCode.OK).json(result);
        
    } catch(err) {
        console.log("Error, getRestaurant", err);
        if(err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standart.code).json(Errors.standart)
    }
}


memberController.Signup = async (req: Request, res: Response) => {
    try {
        console.log("Signup");

        const input: MemberInput = req.body,
         result: Member = await memberService.Signup(input);
         const token = await authService.createToken(result);
         const memberImage = req.file ? req.file.filename : null;

        res.cookie("accessToken", token, { 
            maxAge: AUTH_TIMER * 3600 * 1000, httpOnly: false,
         });



        res.status(HttpCode.CREATED).json({member: result, accessToken: token});
    } catch(err) {
        console.log("Error, Signup", err);
        if(err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standart.code).json(Errors.standart)
    }
};


memberController.Login = async (req: Request, res: Response) => {
    try {
        console.log("Login");
        const input: LoginInput = req.body,
         result = await memberService.Login(input);
         const token = await authService.createToken(result);
      
         res.cookie("accessToken", token, {    // brauser cookiesiga accessToken nomi ostida tokenni saqlayabti
            maxAge: AUTH_TIMER * 3600 * 1000, 
            httpOnly: false,
         });



        res.status(HttpCode.OK).json({member: result, accessToken: token});
    } catch(err) {
        console.log("Error, Login", err);
       if(err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standart.code).json(Errors.standart)
    }
};


memberController.logout = (req: ExtendedRequest, res: Response) => {
    try {
         console.log("logout");
         res.cookie("accessToken", null, {maxAge: 0, httpOnly: true});
         res.status(HttpCode.OK).json({logout: true});
    } catch(err) {
         console.log("Error, logout", err);
       if(err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standart.code).json(Errors.standart)
    }
}


memberController.getMemberDetail = async (req: ExtendedRequest, res: Response) => {
    try {
         console.log("getMemberDetail");
        const result = await memberService.getMemberDetail(req.member);
       res.status(HttpCode.OK).json(result);

    } catch(err) {
         console.log("Error, getMemberDetail", err);
       if(err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standart.code).json(Errors.standart)
    }
}


memberController.updateMember = async (req: ExtendedRequest, res: Response) => {
    try {
         console.log("updateMember");
       const input: MemberUpdateInput = req.body;
       if(req.file) input.memberImage = req.file.path.replace(/\\/g, "/");
       const result = await memberService.updateMember(req.member, input)
       res.status(HttpCode.OK).json(result);
    } catch(err) {
         console.log("Error, updateMember", err);
       if(err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standart.code).json(Errors.standart)
    }
}


memberController.getTopUsers = async (req: Request, res: Response) => {
    try {
         console.log("getTopUsers");
       const result = await memberService.getTopUsers();

       res.status(HttpCode.OK).json(result);
    } catch(err) {
         console.log("Error, getTopUsers", err);
       if(err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standart.code).json(Errors.standart)
    }
}

                                         //Verify — tekshirmoq, tasdiqlamoq degani.
memberController.verifyAuth = async (
    req: ExtendedRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies["accessToken"];
        if(token) req.member = await authService.checkAuth(token);
        if(!req.member)
          throw new Errors(HttpCode.UNAUTHORIZED, Message.NOT_AUTENTICATED);
       next();
       
    } catch (err) {
     console.log("Error, verifyAuth", err);
       if(err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standart.code).json(Errors.standart);
    }
};


memberController.retrieveAuth = async (
    req: ExtendedRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies["accessToken"];
        if(token) req.member = await authService.checkAuth(token);
      
       
    next();
    } catch (err) {
     console.log("Error, retrieveAuth", err);
      next();
    }
};



export default memberController;

