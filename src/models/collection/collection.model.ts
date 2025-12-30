import { model } from "mongoose";
import { ICollection } from "./collection.interface";
import { CollectionSchema } from "./collection.schema";

export const CollectionModel = model<ICollection>(
  "Collection",
  CollectionSchema
);
