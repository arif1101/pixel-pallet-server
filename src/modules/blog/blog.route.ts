import { Router } from "express";
import { BlogController } from "./blog.controller";
import upload from "../../middleware/multer";

const router = Router()

router.get("/", BlogController.allBlog)
router.post("/create", upload.single("image"), BlogController.createBlog)
router.patch("/update/:id", BlogController.updateBlog)
router.delete("/delete/:id", BlogController.deleteBlog)

export const BlogRouter = router;