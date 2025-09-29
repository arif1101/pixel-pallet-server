import express from "express"
import cors from 'cors'
import compression from "compression"
import { userRouter } from "./modules/user/user.route";
import { AuthRouter } from "./modules/auth/auth.route";
import { BlogRouter } from "./modules/blog/blog.route";
const app = express()

// Middleware
app.use(cors()); // Enables Cross-Origin Resource Sharing
app.use(compression()); // Compresses response bodies for faster delivery
app.use(express.json()); // Parse incoming JSON requests


app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true
    })
)

app.use("/api/v1/user", userRouter)
app.use("/api/v1/auth", AuthRouter)
app.use("/api/v1/blog", BlogRouter)

app.get("/", (_req,res) => {
    res.send("API is running")
})


// 404 handler

app.use((req,res,next) => {
    res.status(404).json({
        success: false,
        message: "Router Not Found"
    })
})


export default app