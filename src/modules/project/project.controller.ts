import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { ProjectServices } from "./project.service";
import { prisma } from "../../config/db";


const createProject = catchAsync(async(req: Request, res: Response) => {
    const result = await ProjectServices.createProject(req.body)

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Porject created successfully',
        data: result,
    });
})

const updateProject = catchAsync(async(req: Request, res: Response) => {
    const {id} = req.params;
    const result = await ProjectServices.updateProject(Number(id), req.body)
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Porject update successfully',
        data: result,
    });
})

const allProject = catchAsync(async(req: Request, res: Response) => {
    const projects = await prisma.project.findMany()

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Retrived all Project successfully',
        data: projects,
    });

})

const deleteProject = catchAsync(async(req: Request, res: Response) => {
    const {id} = req.params;
    const result = await ProjectServices.deleteProject(Number(id))

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Project delete successfully',
        data: result,
    });

})

export const ProjectController = {
    createProject,
    updateProject,
    allProject,
    deleteProject
}