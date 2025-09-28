import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import {UserServices } from "./user.service";



const createUser = catchAsync(async(req: Request, res: Response) => {
    const user = await UserServices.createUser(req.body)
})


export const userController = {
    createUser
}