import http, {Server} from "http"
import dotenv from "dotenv"
import app from "./app"
import { prisma } from "./config/db"


dotenv.config()
let server: Server | null=null

async function connectToDB() {
    try{
        await prisma.$connect();
        console.log("***DB ZConnection successfull!!***")
    }catch(error){
        console.log("*** DB connection failed")
        process.exit(1)
    }
}

async function startServer(){
    try{
        await connectToDB()
        server = http.createServer(app);
        server.listen(process.env.PORT, () =>{
            console.log(`🚀 Server is running on port ${process.env.PORT}`)
        })
        // handleProcessEvents();
    }catch(error){
    console.error("❌ Error during server startup:", error);
    process.exit(1);
    }
}


startServer()