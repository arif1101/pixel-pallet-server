import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { ProjectServices } from "./project.service";
import { prisma } from "../../config/db";
import AppError from "../../errorHelpers/AppError";
import cloudinary from "../../config/cloudinary";
import { parseProjectPayload } from "./project.utils";


const createProject = catchAsync(async (req: Request, res: Response) => {
    const parsedPayload = parseProjectPayload(req.body);

    // First create project
    const project = await ProjectServices.createProject({
        ...parsedPayload,
        images: null,
    });

    // Handle image upload
    let finalProject = project;
    if (req.files && Array.isArray(req.files)) {
        const uploadedImages = await Promise.all(
            req.files.map((file: Express.Multer.File) =>
                cloudinary.uploader.upload(file.path, { folder: "projects" })
            )
        );

        const imageUrls = uploadedImages.map(img => img.secure_url);

        finalProject = await ProjectServices.updateProjectImages(project.id, imageUrls);
    }



    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Project created successfully",
        data: finalProject,
    });
});



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