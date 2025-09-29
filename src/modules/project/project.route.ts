import { Router } from "express";
import { ProjectController } from "./project.controller";
import upload from "../../middleware/multer";

const router = Router()

router.get("/", ProjectController.allProject)
router.post("/create", upload.single("image"), ProjectController.createProject)
router.patch("/update/:id", ProjectController.updateProject)
router.delete("/delete/:id", ProjectController.deleteProject)

export const ProjectRouter = router;