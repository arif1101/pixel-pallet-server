import { Request, Response } from "express";
import { prisma } from "../../config/db";
import { Prisma, Project } from "@prisma/client";
import AppError from "../../errorHelpers/AppError";
import httpStatus from 'http-status-codes'
 


// const createProject = async(payload: Prisma.ProjectCreateInput):Promise<Project> => {
//     const existingProject = await prisma.project.findFirst({
//         where: {
//             OR: [
//                 {slug: payload.slug},
//                 {title: payload.title}
//             ]
//         }
//     })
//     if(existingProject){
//         throw new AppError(httpStatus.BAD_REQUEST, "Project Exist in DB")
//     }
//     const result = await prisma.project.create({
//         data: payload,
//         include: {
//             author: {
//                 select:{
//                     id: true,
//                     name: true,
//                     email: true
//                 }
//             }
//         }
//     })
//     return result
// }


const createProject = async (
    payload: Prisma.ProjectCreateInput
): Promise<Project> => {
    const existingProject = await prisma.project.findFirst({
        where: { OR: [{ slug: payload.slug }, { title: payload.title }] },
    });

    if (existingProject) {
        throw new AppError(httpStatus.BAD_REQUEST, "Project already exists");
    }

    return prisma.project.create({
        data: payload,
        include: {
            author: {
                select: { id: true, name: true, email: true },
            },
        },
    });
};

const updateProjectImage = async (
    id: number,
    imageUrl: string
): Promise<Project> => {
    return prisma.project.update({
        where: { id },
        data: { image: imageUrl },
        include: {
            author: { select: { id: true, name: true, email: true } },
        },
    });
};


const updateProject = async(id: number, payload: Partial<Project>) => {
    const existingProject = await prisma.project.findUnique({where: {id}});
    if(!existingProject){
        throw new AppError(httpStatus.NOT_FOUND, "Project not found")
    }

    if(payload.slug || payload.title){
        const duplicate = await prisma.project.findFirst({
            where: {
                OR: [
                    ...(payload.slug ? [{ slug: payload.slug }] : []),
                    ...(payload.title ? [{ title: payload.title }] : []),
                ],
                NOT: {id},
            },
        });

        if(duplicate){
            throw  new AppError(httpStatus.NOT_ACCEPTABLE, "Slug or Title already exist")
        }
    }

    const updateProject = await prisma.project.update({
        where: {
            id: id
        },
        data: payload
    })

    return updateProject
}

const deleteProject = async(id: number) => {
    const deleteProject = await prisma.project.delete({
        where: {
            id: id
        }
    })

    return deleteProject;
}

export const ProjectServices = {
    createProject,
    updateProject,
    deleteProject,
    updateProjectImage
}