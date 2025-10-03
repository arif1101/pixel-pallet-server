import { Prisma, User } from "@prisma/client"
import { prisma } from "../../config/db"
import bcryptjs from "bcryptjs";



const createUser = async(payload: Prisma.UserCreateInput):Promise<User> => {

    const {password, ...rest} = payload

    if(!password){
        throw new Error("Password is required");
    }

    const hashedPassword = await bcryptjs.hash(password,10)

    
    const createdUser = await prisma.user.create({
        data: {
            ...rest,
            password: hashedPassword,
        },
    });
    const {password: _, ...userWithoutPassword} = createdUser;
    return userWithoutPassword as User
}


const getMyProfile = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: {
        id: userId
    }
  })
  if(!user){
    throw new Error('User not found');
  }
  
  return {
    user
  }
};


export const UserServices = {
    createUser,
    getMyProfile
}