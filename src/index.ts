import express,{Request, Response} from 'express'
import { StatusCodes } from 'http-status-codes';
import cors from "cors";
import "./database/config/config"
import router from './routers';
import swaggerUi from "swagger-ui-express";
import Document from "../swagger.json"

const app= express();
app.use(express.json());
app.use(cors());

app.get("/", (req:Request, res:Response)=> {
    res.status(StatusCodes.OK).json({
        status: StatusCodes.OK,
        message: "Welcome to e_commerce APIs"
    })
})

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(Document))
app.use("/", router)
const port = process.env.PORT || 7000;

app.listen(port, ()=>{
    console.log(`Server is listening to port ${port}`)
})