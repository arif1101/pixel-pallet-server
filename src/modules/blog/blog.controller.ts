import { Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse";
import { BlogServices } from "./blog.service";
import { prisma } from "../../config/db";



const createBlog = catchAsync(async(req: Request, res: Response) => {

    const result = await BlogServices.createBlog(req.body)
    
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Tour created successfully',
        data: result,
    });
})

const updateBlog = catchAsync(async(req: Request, res: Response) =>{
    const {id} = req.params
    const result = await BlogServices.updateBlog(Number(id), req.body)
    console.log(result)
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Blog update successfully',
        data: result,
    });
})

const allBlog = catchAsync(async(req: Request, res: Response) => {
    const blogs = await prisma.blog.findMany()

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Retrived all Blog successfully',
        data: blogs,
    });

})

const deleteBlog = catchAsync(async(req: Request, res: Response) => {
    const {id} = req.params;
    const result = await BlogServices.deleteBlog(Number(id))

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Blog delete successfully',
        data: result,
    });

})


export const BlogController = {
    createBlog,
    updateBlog,
    allBlog,
    deleteBlog
}