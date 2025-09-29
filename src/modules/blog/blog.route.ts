import { Router } from "express";
import { BlogController } from "./blog.controller";

const router = Router()

router.get("/", BlogController.allBlog)
router.post("/create", BlogController.createBlog)
router.patch("/update/:id", BlogController.updateBlog)
router.delete("/delete/:id", BlogController.deleteBlog)

export const BlogRouter = router;