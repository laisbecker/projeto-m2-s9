import { Request, Response, Router } from "express";
import { User } from "../entity/User";
import bcrypt from "bcrypt";
import { AppDataSource } from "../data-source";

const userRouter = Router()

const userRepository = AppDataSource.getRepository(User)

userRouter.post("/",  async (req: Request, res: Response) => {
    try {
        const userBody = req.body

        if (!userBody || !userBody.email || !userBody.firstName || !userBody.senha) {
            res.status(400).json("Preencha todos os dados!")
            return
        }

        const salt = await bcrypt.genSalt(10)
        let senhaCriptografada = await bcrypt.hash(userBody.senha, salt)

        userBody.senha = senhaCriptografada

        await userRepository.save(userBody)
        res.status(200).json(userBody)
        return

    } catch (ex) {
        res.status(500).json("Não foi possível executar a solicitação")
    }
})

userRouter.get("/", async (req: Request, res: Response) => {

    try {
        const result = await userRepository.find()

        if (!result) {
            res.status(200).json("Nenhum usuário encontrado!")
            return
        }

        res.status(200).json(result)

    } catch {
        res.status(500).json("Não foi possível executar a solicitação!")
    }
})


export default userRouter