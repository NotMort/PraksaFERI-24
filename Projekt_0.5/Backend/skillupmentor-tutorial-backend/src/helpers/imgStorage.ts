const FileType = import('file-type')
import { Logger } from '@nestjs/common'
import fs from 'fs'
import{ diskStorage, Options} from 'multer'
import { extname} from 'path'

type validFileExtensionsType = 'png' | 'jpg' | 'jpeg'
type validMimeType = 'imge/png' | 'imge/jpg' | 'imge/jpeg'
const validFileExtension: validFileExtensionsType[] = ['png','jpg','jpeg']
const validMimeTypes:validMimeType[] = ['imge/jpg','imge/png','imge/jpeg']

export const saveImageToStorage:Options = {
    storage: diskStorage({
        destination:'./files',
        filename(req,file,callback){
            const uniqueSuffix = Date.now()+'-'+Math.round(Math.random()*1e9)
            const ext = extname(file.originalname)
            const filename = `${uniqueSuffix}${ext}`
            callback(null,filename)
        },
    }),
    fileFilter(req,file,callback){
        const allowedMimeTypes:validMimeType[] = validMimeTypes
        allowedMimeTypes.includes(file.mimetype as validMimeType) ? callback(null,true) : callback(null,false)
    },
}

export const isFileExtensionSafe = async (fullFilePath:string) : Promise<Boolean> =>{
    return (await FileType).fileTypeFromFile(fullFilePath).then((fileExtensionAndMimeType) =>{
        if(!fileExtensionAndMimeType) return false
        const isFileTypeLegit = validFileExtension.includes(fileExtensionAndMimeType.ext as validFileExtensionsType)
        const isMimeTypeLegit = validMimeTypes.includes(fileExtensionAndMimeType.ext as validMimeType)
        const isFileLegite = isFileTypeLegit && isMimeTypeLegit
        return isFileLegite
    })
}

export const removeFile =(fullFilePath:string):void =>{
    try {
        fs.unlinkSync(fullFilePath)
    } catch (error) {
        Logger.error(error)
    }
}