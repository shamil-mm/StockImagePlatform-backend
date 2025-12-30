import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import UserRepository from "../repositories/UserRepo/UserRepository";
import CollectionRepository from "../repositories/CollectionRepo/CollectionRepository";
import JwtService from "../utils/JwtService";
import { AuthMiddleware } from "../middleware/authMiddleware";
import upload from "../utils/multerConfig";
const router=Router();

const authController=new AuthController(UserRepository,JwtService,CollectionRepository)
const authMiddleware=new AuthMiddleware(JwtService)

router.post("/register",authController.register)
router.post("/login",authController.login)
router.post("/refresh",authController.refresh)
router.post("/upload",authMiddleware.use,upload.array("files",10),authController.upload)
router.get("/fetch",authMiddleware.use,authController.fetchImage)
router.get("/image",authMiddleware.use,authController.getImage)
router.patch("/upload",upload.single("image"),authMiddleware.use,authController.updateImage)
router.patch("/reorder",authMiddleware.use,authController.arrangeImage)
router.delete("/image",authMiddleware.use,authController.removeImage)
router.put("/change-password",authMiddleware.use,authController.changePassword)
router.post("/logout",authMiddleware.use,authController.logout)
export default router;
