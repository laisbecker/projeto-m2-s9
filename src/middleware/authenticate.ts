import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"

const authenticate = (req: Request, res: Response, next: NextFunction) => {
    try{
        const token = req.headers.authorization.split(" ")[1]

        if(!token){
            res.status(401).json("Não autorizado!")
            return
        }

        const dadosToken = jwt.verify(token, process.env.JWT_SECRET)

    }catch{
        res.status(401).json("Token inválido")
    }
}
export default authenticate