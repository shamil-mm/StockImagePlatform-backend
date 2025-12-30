import { Document, Types } from "mongoose";
import { IImage } from "./image.interface";

export interface ICollection extends Document {
  name: string;
  userId: Types.ObjectId;
  images: IImage[];
  createdAt: Date;
  updatedAt: Date;
}
