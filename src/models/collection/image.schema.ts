import { Schema } from "mongoose";

export const ImageSchema = new Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    width: { type: Number },
    height: { type: Number },
    title: { type: String, required: true },
    order: { type: Number, required: true },
  },
  {
    _id: false,
  }
);
