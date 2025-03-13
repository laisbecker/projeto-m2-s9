import { Request, Response, Router } from "express";
import { AppDataSource } from "../data-source";
import { Permission } from "../entity/Permission";
import { Role } from "../entity/Role";
import { User } from "../entity/User";
import authenticate from "../middleware/authenticate";

const userRepository = AppDataSource.getRepository(User)
const roleRepository = AppDataSource.getRepository(Role)
const permissionRepository = AppDataSource.getRepository(Permission)

const rbacRouter = Router()

rbacRouter.get("/listAllRoles", authenticate([]), async (req: Request, res: Response) => {
    try {
        const roles = await roleRepository.find({
            relations: ["permissions"]
        })

        res.status(200).json(roles)
    } catch {
        res.status(500).json("Erro ao processar solicitação")
    }
})

rbacRouter.get("/listAllPermissions", authenticate([]), async (req: Request, res: Response) => {
    try {
        const permissions = await permissionRepository.find()

        res.status(200).json(permissions)
    } catch {
        res.status(500).json("Erro ao processar solicitação")
    }
})

rbacRouter.post("/addRole", authenticate([]), async (req: Request, res: Response) => {
    try {
        const roleBody = req.body as Role

        if (!roleBody.description) {
            res.status(400).json("A descrição é obrigatória")
            return
        }

        await roleRepository.save(roleBody)

        res.status(201).json(roleBody)
    } catch {
        res.status(500).json("Erro ao processar solicitação")
    }
})

rbacRouter.post("/addPermission", authenticate([]), async (req: Request, res: Response) => {
    try {
        const permissionBody = req.body as Permission

        if (!permissionBody.description) {
            res.status(400).json("A descrição é obrigatória")
            return
        }

        await permissionRepository.save(permissionBody)

        res.status(201).json(permissionBody)
    } catch {
        res.status(500).json("Erro ao processar solicitação")
    }
})

rbacRouter.post("/addPermissionToRole", authenticate([]), async (req: Request, res: Response) => {
    try {
        const permissionRoleBody = req.body as {
            permissionId: number
            roleId: number
        }

        if (!permissionRoleBody.roleId || !permissionRoleBody.permissionId) {
            res.status(400).json("É necessário enviar o ID do cargo e da permissão")
            return
        }

        const permission = await permissionRepository.findOneBy({ id: permissionRoleBody.permissionId })

        if (!permission) {
            res.status(400).json("A permissão informada não existe")
            return
        }

        const role = await roleRepository.findOne({
            where: {
                id: permissionRoleBody.roleId
            }, relations: ["permissions"]
        })

        if (!role) {
            res.status(400).json("O cargo informado é inválido")
            return
        }

        if(role.permissions.find(x => x.id == permission.id)){
            res.status(400).json("O cargo já possui esta informação")
            return
        }

        role.permissions.push(permission)
        await roleRepository.save(role)

        res.status(201).json(role)
    } catch {
        res.status(500).json("Erro ao processar solicitação")
    }
})

rbacRouter.post("/addRoleToUser", authenticate([]), async (req: Request, res: Response) => {
    try {
        const userRoleBody = req.body as {
            roleId: number
            userId: number
        }

        if(!userRoleBody.userId || !userRoleBody.roleId){
            res.status(400).json("O ID do cargo e do usuário são obrigatórios")
            return
        }

        const role = await roleRepository.findOneBy({id: userRoleBody.roleId})

        if(!role){
            res.status(400).json("O cargo informado é inválido")
            return
        }

        const user =  await userRepository.findOne({
            where: {id: userRoleBody.userId}, relations: ["roles"]
        })

        if(!user){
            res.status(400).json("O usuário não existe")
            return
        }

        if(user.roles.find(x => x.id == role.id)){
            res.status(400).json("O usuário já possui este cargo")
            return
        }

        user.roles.push(role)
        await userRepository.save(user)

        res.status(201).json(user)
    } catch {
        res.status(500).json("Erro ao processar solicitação")
    }
})

export default rbacRouter