import { getCustomRepository } from "typeorm";
import { compare} from "bcryptjs";
import { UsersRepositories } from "../repositories/UsersRepositories"
import { sign } from "jsonwebtoken"


interface IAuthenticateRequest{
    email: string;
    password: string;
}

class AuthenticateUserService{

    async execute({email, password}:IAuthenticateRequest ){
        const usersRepositories = getCustomRepository(UsersRepositories);
        //Verificar se email existe
        const user = await usersRepositories.findOne({
            email,
        });

        if(!user){
            throw new Error("Email/Password incorrect")
        }

        //verificar se senha está correta

        const passwordMatch = await compare(password, user.password)

        if(!passwordMatch){
            throw new Error("Email/Password incorrect")
        }

        //gerar token
        const token = sign({
            email: user.email,
            },"7a86bb2f1c32fa4345c1f0e6ce44f5ed",{
                subject: user.id,
                expiresIn: "1d" 
            } 
        
        )

        return token;


    }

}

export { AuthenticateUserService }