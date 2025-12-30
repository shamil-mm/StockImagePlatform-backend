import { Request, Response } from "express";
import { IJWTService } from "../utils/interface.JwtService";
import { IUserRepository } from "../repositories/UserRepo/IUserRepository";
import { hashPassword, matchPassword } from "../utils/password";
import cloudinary from "../config/cloudinary";
import { ICollectionRepository } from "../repositories/CollectionRepo/ICollectionRepository";
import { JwtPayload } from "jsonwebtoken";
import { IImage } from "../models/collection/image.interface";

export class AuthController {
  constructor(
    private userRepository: IUserRepository,
    private jwtService: IJWTService,
    private collectionRepository: ICollectionRepository
  ) {}

  register = async (req: Request, res: Response) => {
    try {
      console.log("register is working");
      const { email, name, phone, password } = req.body;

      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser) {
        return res
          .status(400)
          .json({ validationError: true, message: "User already exists" });
      }
      const hashedPassword = await hashPassword(password);
      await this.userRepository.create({
        email,
        name,
        phone,
        password: hashedPassword,
      });
      res
        .status(201)
        .json({ message: "Registration successful. Please login." });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      console.log("login is working");
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          validationError: true,
          message: "Email and password are required",
        });
      }
      const normalizedEmail = email.toLowerCase().trim();
      const user = await this.userRepository.findByEmail(normalizedEmail);
      if (!user) {
        return res.status(401).json({
          validationError: true,
          message: "Invalid credentials",
        });
      }
      const isMatch = await matchPassword(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          validationError: true,
          message: "Invalid credentials",
        });
      }
      const { accessToken, refreshToken } = this.jwtService.generateTokenPair({
        userId: user._id.toString(),
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      const existingCollection = await this.collectionRepository.findOne({
        userId: user._id,
      });
      if (!existingCollection) {
        await this.collectionRepository.create({
          name: "My Images",
          userId: user._id,
          images: [],
        });
      }

      res
        .status(201)
        .json({
          message: "logIn successfully",
          accessToken,
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
            phone: user.phone,
          },
        });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error });
    }
  };

  refresh = async (req: Request, res: Response) => {
    try {
      console.log("refresh controller is working here");
      const oldRefreshToken = req.cookies?.refreshToken;
      if (!oldRefreshToken) {
        return res.status(401).json({
          message: "Refresh token missing",
        });
      }
      const payload = this.jwtService.verifyRefreshToken(oldRefreshToken);
      const { accessToken ,refreshToken}= this.jwtService.generateTokenPair({
        userId: payload.userId.toString(),
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return res.status(200).json({
      accessToken: accessToken
    });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error });
    }
  };

  upload = async (req: Request, res: Response) => {
    try {
      const files = req.files as Express.Multer.File[];
      let { titles } = req.body;
      titles = Array.isArray(titles) ? titles : [titles];
      const { userId } = req?.user as JwtPayload;
      if (!files || files.length === 0) {
        return res.status(400).json({ message: "No files uploaded" });
      }
      const collection = await this.collectionRepository.findOne({
        userId: userId,
      });
      if (!collection) {
        return res.status(404).json({ message: "Collection not found" });
      }
      const startOrder = collection.images.length;
      const uploadImages = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const result = await new Promise<any>((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              {
                folder: "uploads",
                resource_type: "image",
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            )
            .end(file.buffer);
        });
        uploadImages.push({
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          title: titles?.[i] || "Untitled",
          order: startOrder + i,
        });
      }
      collection.images.push(...uploadImages);
      await collection.save();
      return res.status(201).json({
        message: "Uploaded successfully",
        images: uploadImages,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error });
    }
  };

  fetchImage = async (req: Request, res: Response) => {
    try {
      console.log("fetch images controller is working");

      const { userId } = req?.user as JwtPayload;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const collection = await this.collectionRepository.findOne({ userId });
      if (!collection) {
        return res.status(200).json({
          images: [],
          total: 0,
          page,
          limit,
        });
      }

      const sortedImages = [...collection.images].sort(
        (a, b) => a.order - b.order
      );

      const startIndex = (page - 1) * limit;
      const paginatedImages = sortedImages.slice(
        startIndex,
        startIndex + limit
      );

      return res.status(200).json({
        images: paginatedImages,
        total: collection.images.length,
        page,
        limit,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error });
    }
  };
  getImage = async (req: Request, res: Response) => {
    try {
      const publicId = req.query.id;
      const { userId } = req.user as JwtPayload;

      if (!userId || !publicId) {
        return res.status(400).json({ message: "Missing userId or publicId" });
      }

      const collection = await this.collectionRepository.findOne({ userId });

      if (!collection) {
        return res.status(404).json({ message: "Collection not found" });
      }
      const image = collection.images.find((img) => img.publicId === publicId);

      if (!image) {
        return res.status(404).json({ message: "Image not found" });
      }

      return res.status(200).json({
        message: "Image fetched successfully",
        image,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error });
    }
  };
  updateImage = async (req: Request, res: Response) => {
    try {
      const { userId } = req.user as JwtPayload;
      const { publicId, title } = req.body;
      const file = req.file;

      const collection = await this.collectionRepository.findOne({ userId });

      if (!collection)
        return res.status(404).json({ message: "Collection not found" });

      const imageIndex = collection.images.findIndex(
        (img) => img.publicId === publicId
      );

      if (imageIndex === -1)
        return res.status(404).json({ message: "Image not found" });

      const oldImage = collection.images[imageIndex];

      const updatedImage = {
        url: oldImage.url,
        publicId: oldImage.publicId,
        order: oldImage.order,
        width: oldImage.width,
        height: oldImage.height,
        title: title || oldImage.title,
      };

      if (file) {
        const uploadToCloud = () =>
          new Promise<any>((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: "uploads" },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            );
            stream.end(file.buffer);
          });

        const result = await uploadToCloud();

        if (oldImage.publicId) {
          await cloudinary.uploader.destroy(oldImage.publicId);
        }

        updatedImage.url = result.secure_url;
        updatedImage.publicId = result.public_id;
        updatedImage.width = result.width;
        updatedImage.height = result.height;
      }
      collection.images[imageIndex] = updatedImage;
      await collection.save();
      res.json({
        message: "Image updated successfully",
        images: collection.images,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error });
    }
  };

  arrangeImage = async (req: Request, res: Response) => {
    try {
      console.log("arrageImage is working ");
      const { images } = req.body;
      const { userId } = req.user as JwtPayload;

      if (!Array.isArray(images) || images.length === 0)
        return res.status(400).json({ message: "No images to reorder" });

      const bulkOps = images.map((img: IImage) => ({
        updateOne: {
          filter: {
            userId,
            "images.publicId": img.publicId,
          },
          update: {
            $set: {
              "images.$.order": img.order,
            },
          },
        },
      }));

      const result = await this.collectionRepository.bulkWrite(bulkOps);

      return res.status(200).json({
        success: true,
        message: "Image order updated successfully",
        modifiedCount: result.modifiedCount,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error });
    }
  };
 removeImage = async (req: Request, res: Response) => {
  try {
    const { publicId } = req.body;
    const { userId } = req.user as JwtPayload;

    if (!publicId) {
      return res.status(400).json({ message: "publicId is required" });
    }

    const collection = await this.collectionRepository.findOne({ userId });

    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    const imageIndex = collection.images.findIndex(
      (img) => img.publicId === publicId
    );

    if (imageIndex === -1) {
      return res.status(404).json({ message: "Image not found" });
    }

    const deletedImage = collection.images[imageIndex];
    const deletedOrder = deletedImage.order;

    await cloudinary.uploader.destroy(publicId);

    const bulkOps = [
  
      {
        updateOne: {
          filter: { userId },
          update: {
            $pull: { images: { publicId } },
          },
        },
      },

      {
        updateOne: {
          filter: { userId },
          update: {
            $inc: { "images.$[img].order": -1 },
          },
          arrayFilters: [{ "img.order": { $gt: deletedOrder } }],
        },
      },
    ];


    await this.collectionRepository.bulkWrite(bulkOps);

    return res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("removeImage error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
changePassword=async(req:Request,res:Response)=>{
  try {
    const { userId } = req.user as JwtPayload;
    const { password } = req.body;
     if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }
    const user=await this.userRepository.findById(userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    const hashedPassword = await hashPassword(password)

    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      message: "Password updated successfully",
    });

  } catch (error) {
    console.error("removeImage error:", error);
    res.status(500).json({ message: "Server error", error });
  }
}
logout=async(_req:Request,res:Response)=>{
  try {
   res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

}
