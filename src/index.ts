import dotenv from "dotenv"
dotenv.config()
import { AppDataSource } from "./data-source"
import express from "express"
import cors from "cors"

const app = express()

import userRouter from "./routes/user.routes"
import authRouter from "./routes/auth.routes"
import medicamentosRouter from "./routes/medicamento.routes"
import rbacRouter from "./routes/rbac.routes"

app.use(cors())
app.use(express.json())

app.use("/users", userRouter)
app.use("/login", authRouter)
app.use("/medicamentos", medicamentosRouter)
app.use("/rbac", rbacRouter)


AppDataSource.initialize().then(async () => {
    app.listen(3456, () => {
        console.log("Servidor rodando na porta http://localhost:3456")
    })
})