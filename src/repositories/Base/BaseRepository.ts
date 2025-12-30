import { Model, UpdateQuery, HydratedDocument } from "mongoose";

type ICreate<T> = Parameters<Model<T>["create"]>[0]


export default class BaseRepository<T> {
  constructor(protected readonly model: Model<T>) {}

  create(data: ICreate<T>): Promise<HydratedDocument<T>> {
    return this.model.create(data);
  }

  findById(id: string): Promise<HydratedDocument<T> | null> {
    return this.model.findById(id).exec();
  }

  findOne(filter: Partial<T>): Promise<HydratedDocument<T> | null> {
    return this.model.findOne(filter).exec();
  }

  find(filter: Partial<T> = {}): Promise<HydratedDocument<T>[]> {
    return this.model.find(filter).exec();
  }

  updateById(
    id: string,
    update: UpdateQuery<T>
  ): Promise<HydratedDocument<T> | null> {
    return this.model.findByIdAndUpdate(id, update, { new: true }).exec();
  }

  deleteById(id: string): Promise<HydratedDocument<T> | null> {
    return this.model.findByIdAndDelete(id).exec();
  }
}
