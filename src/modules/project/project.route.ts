import { Router } from "express";
import { ProjectController } from "./project.controller";

const router = Router()

router.get("/", ProjectController.allProject)
router.post("/create", ProjectController.createProject)
router.patch("/update/:id", ProjectController.updateProject)
router.delete("/delete/:id", ProjectController.deleteProject)

export const ProjectRouter = router;