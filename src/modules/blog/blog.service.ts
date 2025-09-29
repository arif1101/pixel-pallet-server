import { Blog, Prisma } from "@prisma/client";

import { prisma } from "../../config/db";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes"


const createBlog = async(payload: Prisma.BlogCreateInput & { authorId: number }): Promise<Blog> => {
  const { authorId, ...rest } = payload;

  const result = await prisma.blog.create({
    data: {
      ...rest,
      author: {
        connect: { id: Number(authorId) } // connect by ID
      }
    },
    include: {
      author: {
        select: { id: true, name: true, email: true }
      }
    }
  });

  return result;
}

const updateBlog = async(id : number, payload : Partial<Blog>) => {
    const existingBlog = await prisma.blog.findUnique({where: {id}});
    if(!existingBlog){
        throw new AppError(httpStatus.NOT_FOUND, "Blog not found")
    }


    if (payload.slug || payload.title) {
        const duplicate = await prisma.blog.findFirst({
        where: {
            OR: [
            ...(payload.slug ? [{ slug: payload.slug }] : []),
            ...(payload.title ? [{ title: payload.title }] : []),
            ],
            NOT: { id }, // Exclude current blog
        },
        });

        if (duplicate) {
        throw new Error("Slug or title already exists");
        }
    }
    

    const updateBlog = await prisma.blog.update({
        where: {
            id: id
        },
        data: payload
    })
    
    return updateBlog
}

const deleteBlog = async(id: number) => {
    const deleteBlog = await prisma.blog.delete({
        where: {
            id: id
        }
    })

    return deleteBlog;
}

export const BlogServices = {
    createBlog,
    updateBlog,
    deleteBlog
}