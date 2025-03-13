import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"

const authenticate = (listaPermissoes: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization.split(" ")[1]

            if (!token) {
                res.status(401).json("Token não informado")
                return
            }

            const dadosToken = jwt.verify(token, process.env.JWT_SECRET ?? "") as { id: number }

            console.log("Token decodificado:", dadosToken)
            req.userId = dadosToken.id

            next()

        } catch {
            res.status(401).json("Token inválido")
        }
    }
}

export default authenticate