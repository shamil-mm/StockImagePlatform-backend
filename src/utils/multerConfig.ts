import { Request } from 'express'
import multer from 'multer'
const storage=multer.memoryStorage()

const fileFilter=(req:Request,file:Express.Multer.File,cb:multer.FileFilterCallback)=>{
    if(file.mimetype.startsWith('image/'))cb(null,true);
    else cb(new Error('Only image files are allowed'));
}

const limits={fileSize:50*1024*1024}
const upload=multer({storage,fileFilter,limits})
export default upload