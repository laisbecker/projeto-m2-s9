import dotenv from "dotenv"
dotenv.config()
import { Request, Response, Router } from "express";
import { User } from "../entity/User";
import bcrypt from "bcrypt";
import { AppDataSource } from "../data-source";
import jwt from "jsonwebtoken";

const authRouter = Router()

const userRepository = AppDataSource.getRepository(User)

authRouter.post("/", async (req: Request, res: Response) => {
    try {
        const userBody = req.body

        const user = await userRepository.findOne({
            where: {
                email: userBody.email
            }
        })

        if(!user){
            res.status(401).json("Usuário e/ou senha incorretos!")
            return
        }

        const valido = await bcrypt.compare(userBody.senha, user.senha)

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET não está definido no .env!");
        }

        if(valido){

            const payload = {
                email: user.email,
                userId: user.id
            }

            const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '3h'})

            res.status(201).json(token)
            return
        } else {
            res.status(401).json("Usuário e/ou senha incorretos!")
            return
        }

    } catch(ex){
        console.error("Erro no login:", ex)
        res.status(500).json("Não foi possível executar a solicitação")
    }
})

export default authRouter