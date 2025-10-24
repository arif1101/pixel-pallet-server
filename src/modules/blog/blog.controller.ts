import { Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse";
import { BlogServices } from "./blog.service";
import { prisma } from "../../config/db";
import cloudinary from "../../config/cloudinary";
import AppError from "../../errorHelpers/AppError";



// const createBlog = catchAsync(async(req: Request, res: Response) => {

//     const result = await BlogServices.createBlog(req.body)
    
//     sendResponse(res, {
//         statusCode: 201,
//         success: true,
//         message: 'Blog created successfully',
//         data: result,
//     });
// })

// const createBlog = catchAsync(async (req: Request, res: Response) => {
//   let payload = { ...req.body };

//   // If an image file exists, upload to Cloudinary
//   if (req.file) {
//     const uploaded = await cloudinary.uploader.upload(req.file.path, {
//       folder: "blogs",
//     });
//     payload.image = uploaded.secure_url; // store URL in DB
//   }

//   const result = await BlogServices.createBlog(payload);
//   console.log("---------",result)

//   sendResponse(res, {
//     statusCode: 201,
//     success: true,
//     message: "Blog created successfully",
//     data: result,
//   });
// });

const createBlog = catchAsync(async (req: Request, res: Response) => {
  let payload = { ...req.body };
  console.log(payload)

  // Convert authorId to number
  const authorId = Number(payload.authorId);
  if (isNaN(authorId)) {
    throw new AppError(400, "authorId must be a valid number");
  }

  const { authorId: _unused, ...rest } = payload; // remove string authorId from rest

  // 1️⃣ Create blog record first (without image)
  const blog = await BlogServices.createBlog({ authorId, ...rest, image: null });

  // 2️⃣ Upload image if exists
  if (req.file) {
    const uploaded = await cloudinary.uploader.upload(req.file.path, {
      folder: "blogs",
    });

    // 3️⃣ Update blog with image URL
    const updatedBlog = await prisma.blog.update({
      where: { id: blog.id },
      data: { image: uploaded.secure_url },
      include: { author: { select: { id: true, name: true, email: true } } }
    });

    return sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Blog created successfully",
      data: updatedBlog,
    });
  }

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Blog created successfully",
    data: blog,
  });
});



const updateBlog = catchAsync(async(req: Request, res: Response) =>{
    const {id} = req.params
    const result = await BlogServices.updateBlog(Number(id), req.body)
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Blog update successfully',
        data: result,
    });
})

// const allBlog = catchAsync(async(req: Request, res: Response) => {
//     const blogs = await prisma.blog.findMany()

//     sendResponse(res, {
//         statusCode: 201,
//         success: true,
//         message: 'Retrived all Blog successfully',
//         data: blogs,
//     });

// })

const allBlog = catchAsync(async (req: Request, res: Response) => {
  const result = await BlogServices.getAllBlogsFromDB(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Retrieved all blogs successfully",
    meta: result.meta,
    data: result.data,
  });
});


const singleBlog = catchAsync(async(req: Request, res: Response) => {
    
    const { id } = req.params;
    const blog = await BlogServices.singleBlog(Number(id))
    
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Retrived Blog successfully',
        data: blog,
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
    deleteBlog,
    singleBlog
}