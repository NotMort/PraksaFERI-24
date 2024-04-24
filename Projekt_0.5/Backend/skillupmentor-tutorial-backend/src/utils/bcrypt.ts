import { InternalServerErrorException, Logger } from "@nestjs/common"
import * as bcrypt from 'bcrypt'
export const hash = async (data:string,salt =10):Promise<string> =>{
    try {
        const genaratedSalt = await bcrypt.genSalt(salt)
        return bcrypt.hash(data, genaratedSalt)
    } catch (error) {
        Logger.error(error)
        throw new InternalServerErrorException('Somthing want wrong while hasing password')
    }
}

export const compareHash =async (data:string | Buffer, encryptedData:string): Promise<Boolean> =>{
    try {
        return bcrypt.compare(data,encryptedData)
    } catch (error) {
        Logger.error(error)
        throw new InternalServerErrorException('somthing want wrong while compering hash')
    }
}