import { Request, Response, Router } from "express";
import { User } from "../entity/User";
import bcrypt from "bcrypt";
import { AppDataSource } from "../data-source";
import { Medicamento } from "../entity/Medicamento";

const medicamentosRouter = Router()

const medicamentosRepository = AppDataSource.getRepository(Medicamento)

medicamentosRouter.post("/", async (req: Request, res: Response) => {
    try {
        const medBody = req.body as Medicamento

        if (!medBody || !medBody.nome || !medBody.quantidade || !medBody.userId || !medBody.descricao) {
            res.status(400).json("Preencha todos os dados!")
            return
        }

        await medicamentosRepository.save(medBody)
        res.status(201).json(medBody)

    } catch (ex) {
        res.status(500).json("Não foi possível executar a solicitação!")
    }
})

medicamentosRouter.get("/", async (req: Request, res: Response) => {
    try {
        const userId = +req.headers.userid
        
        if (!userId) {
            res.status(400).json("Será necessário informar userId no header!")
            return
        }

        const page = Number(req.query.page ?? 1)
        const limit = Number(req.query.limit ?? 10)
        const skip = page > 1 ? (page - 1) * limit : 0

        const result = await medicamentosRepository.find({ where: {userId: userId}, skip: skip, take: limit})

        if (!result) {
            res.status(200).json("Nenhum medicamento encontrado!")
            return
        }

        res.status(201).json(result)
    } catch (ex) {
        res.status(500).json("Não foi possível executar a solicitação!")
    }
})

medicamentosRouter.get("/:id", async (req: Request, res: Response) => {
    try {
        
        const result = await medicamentosRepository.findOne({ where: { id: +req.params.id } })

        if (!result) {
            res.status(200).json("Nenhum medicamento encontrado!")
            return
        }

        res.status(200).json(result)

    } catch {
        res.status(500).json("Não foi possível executar a solicitação!")
    }
})

medicamentosRouter.get("/all", async (req: Request, res: Response) => {
    try {
        const page = Number(req.query.page ?? 1)
        const limit = Number(req.query.limit ?? 10)
        const skip = page > 1 ? (page - 1) * limit : 0

        const result = await medicamentosRepository.find({skip: skip, take: limit})

        if (!result) {
            res.status(200).json("Nenhum medicamento encontrado!")
            return
        }

        res.status(200).json(result)

    } catch {
        res.status(500).json("Não foi possível executar a solicitação!")
    }
})

medicamentosRouter.put("/:id", async (req: Request, res: Response) => {
    try {
        const id = +req.params.id

        const userId = +req.headers.userid
        
        if (!userId) {
            res.status(400).json("Será necessário informar userId no header!")
            return
        }

        const medBody = req.body as Medicamento
        const medicamento = await medicamentosRepository.findOne({where: {id: id, userId: userId}})

        if (!medicamento) {
            res.status(200).json("Nenhum medicamento encontrado!")
            return
        }

        Object.assign(medicamento, medBody)

        await medicamentosRepository.save(medicamento)
        res.status(200).json(medicamento)

    } catch (ex) {
        res.status(500).json("Não foi possível executar a solicitação!")
    }
})

medicamentosRouter.delete("/:id", async (req: Request, res: Response) => {
    try {
        const id = +req.params.id

        const userId = +req.headers.userid
        
        if (!userId) {
            res.status(400).json("Será necessário informar userId no header!")
            return
        }
        
        const medicamento = await medicamentosRepository.findOne({where: {id: id, userId: userId}})

        if (!medicamento) {
            res.status(200).json("Nenhum medicamento encontrado!")
            return
        }

        await medicamentosRepository.remove(medicamento)
        res.status(200).json(medicamento)

    } catch (ex) {
        res.status(500).json("Não foi possível executar a solicitação!")
    }
})

export default medicamentosRouter