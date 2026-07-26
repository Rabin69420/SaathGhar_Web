import { ItemModel, IItem } from "../models/item.model";
import { UserModel } from "../models/user.model";

export interface IItemRepository {
    createItem(item: Partial<IItem>): Promise<IItem>;
    getItemById(id: string): Promise<IItem | null>;
    getAllItems(): Promise<IItem[]>;
    getItemsByOwner(ownerId: string): Promise<IItem[]>;
    getBookmarkedItems(userId: string): Promise<IItem[]>;
    updateItem(id: string, item: Partial<IItem>): Promise<IItem | null>;
    deleteItem(id: string): Promise<boolean>;
}

export class ItemMongoRepository implements IItemRepository {
    async createItem(item: Partial<IItem>): Promise<IItem> {
        const created = await ItemModel.create(item);
        return created;
    }

    async getItemById(id: string): Promise<IItem | null> {
        const found = await ItemModel.findById(id).populate("owner", "fullName username email phoneNumber preferences imageUrl");
        return found;
    }

    async getAllItems(): Promise<IItem[]> {
        const items = await ItemModel.find().populate("owner", "fullName username email phoneNumber preferences imageUrl");
        return items;
    }

    async getItemsByOwner(ownerId: string): Promise<IItem[]> {
        const items = await ItemModel.find({ owner: ownerId }).populate("owner", "fullName username email phoneNumber preferences imageUrl");
        return items;
    }

    async getBookmarkedItems(userId: string): Promise<IItem[]> {
        const user = await UserModel.findById(userId);
        if (!user || !user.bookmarks || user.bookmarks.length === 0) {
            return [];
        }
        const items = await ItemModel.find({ _id: { $in: user.bookmarks } }).populate("owner", "fullName username email phoneNumber preferences imageUrl");
        return items;
    }

    async updateItem(id: string, item: Partial<IItem>): Promise<IItem | null> {
        const updated = await ItemModel.findByIdAndUpdate(id, item, { new: true }).populate("owner", "fullName username email phoneNumber preferences imageUrl");
        return updated;
    }

    async deleteItem(id: string): Promise<boolean> {
        const deleted = await ItemModel.findByIdAndDelete(id);
        return !!deleted;
    }
}
