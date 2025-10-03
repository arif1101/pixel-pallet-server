import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { setAuthCookie } from "../../utils/setCookie";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes"
import { AuthServices } from "./auth.service";


const credentialsLogin = catchAsync(async(req: Request, res: Response) => {
    const loginInfo = await AuthServices.credentialsLogin(req.body)
    
    
    setAuthCookie(res, loginInfo)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User logged in successfully",
        data: loginInfo
    })
})



const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    res.clearCookie("accessToken", {
        httpOnly: true,
        // secure: envVars.NODE_ENV === "production", // match login
        secure: true,
        sameSite: "none",
        path: "/",
    })

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User Logged Out Successfully",
        data: null,
    })
})


export const AuthControllers = {
    credentialsLogin,
    logout
}