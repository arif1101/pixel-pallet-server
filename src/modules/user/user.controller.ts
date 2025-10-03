import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import {UserServices } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes"


const createUser = catchAsync(async(req: Request, res: Response) => {
    const user = await UserServices.createUser(req.body)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User created Successfully",
        data: user
    })
})


const getMyProfile = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.userId
  console.log("-------",userId)
  const result = await UserServices.getMyProfile(Number(userId))

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User profile retrieved successfully',
    data: result,
  });
})


export const userController = {
    createUser,
    getMyProfile
}