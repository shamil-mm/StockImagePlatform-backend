import BaseRepository from "../Base/BaseRepository";
import {  HydratedDocument } from "mongoose";
import { ICollection } from "../../models/collection/collection.interface";
import { CollectionModel } from "../../models/collection/collection.model";
import { ICollectionRepository } from "./ICollectionRepository";
import { BulkWriteResult } from "mongodb";

class CollectionRepository extends BaseRepository<ICollection> implements ICollectionRepository{
    constructor(){
        super(CollectionModel)
    }
    async bulkWrite(operations: any[]): Promise<BulkWriteResult> {
    return this.model.bulkWrite(operations);
  }
    // async findByEmail (email:string):Promise<HydratedDocument<ICollection>|null>{
    //     return this.findOne({email})
    // }
}

export default new CollectionRepository()