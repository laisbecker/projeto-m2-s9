import dotenv from "dotenv"
dotenv.config
import { AppDataSource } from "./data-source"
import express from "express"
import cors from "cors"
import authenticate from "./middleware/authenticate"
import { Role } from "./entity/Role"
import { Permission } from "./entity/Permission"

const app = express()

import userRouter from "./routes/user.routes"
import authRouter from "./routes/auth.routes"
import medicamentosRouter from "./routes/medicamento.routes"

app.use(cors())
app.use(express.json())

app.use("/users", authenticate, userRouter)
app.use("/login", authRouter)
app.use("/medicamentos", medicamentosRouter)

AppDataSource.initialize().then(async () => {
    app.listen(3004, () => {
        console.log("Servidor rodando na porta http://localhost:3004")
    })
})