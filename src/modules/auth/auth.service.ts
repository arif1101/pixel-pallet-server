import { Prisma, User } from "@prisma/client";
import { prisma } from "../../config/db";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes"
import bcryptjs from "bcryptjs";
import { generateToken } from "../../utils/jwt";
import { envVars } from "../../config/env";


const credentialsLogin = async(payload: Prisma.UserCreateInput) => {
    const {email, password} = payload;

    const isUserExist = await prisma.user.findUnique({
        where: {email}
    })

    if(!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "Email address invalid")
    }

    console.log(isUserExist)

    const isPasswordMatched = await bcryptjs.compare(password as string, isUserExist.password as string)

    if(!isPasswordMatched){
        throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password")
    }

    const jwtPayload = {
        userId: isUserExist.id,
        email: isUserExist.email,
        phone: isUserExist.phone,
        role: isUserExist.role
    }

    const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)
    

    return {accessToken}
}

export const AuthServices = {
    credentialsLogin
}
