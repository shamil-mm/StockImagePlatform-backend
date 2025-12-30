import { Schema, Types } from "mongoose";
import { ImageSchema } from "./image.schema";

export const CollectionSchema = new Schema(
  {
    name: { type: String, required: true },
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    images: {
      type: [ImageSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);
CollectionSchema.index({ userId: 1, createdAt: -1 });
