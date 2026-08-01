import { describe, test, expect, beforeEach } from "bun:test";
import { ItemMongoRepository } from "../../../repositories/item.repository";
import { ItemModel } from "../../../models/item.model";
import { UserModel } from "../../../models/user.model";
import mongoose from "mongoose";

describe("Unit: ItemMongoRepository", () => {
    let itemRepository: ItemMongoRepository;
    let ownerId: string;

    beforeEach(async () => {
        itemRepository = new ItemMongoRepository();
        const user = await UserModel.create({
            fullName: "Owner User",
            firstName: "Owner",
            lastName: "User",
            email: `owner-${Date.now()}@example.com`,
            username: `owneruser${Date.now()}`,
            password: "password123",
            phoneNumber: "9876543210",
            role: "user"
        });
        ownerId = user._id.toString();
    }, 30000);

    const itemData = {
        title: "Test Room",
        description: "This is a long enough description for testing",
        rent: 5000,
        location: "Kathmandu",
        image: "room.jpg",
    };

    test("should create an item", async () => {
        const item = await itemRepository.createItem({ ...itemData, owner: new mongoose.Types.ObjectId(ownerId) } as any);
        expect(item).toBeDefined();
        expect(item.title).toBe(itemData.title);
    }, 30000);

    test("should find an item by id", async () => {
        const created = await itemRepository.createItem({ ...itemData, owner: new mongoose.Types.ObjectId(ownerId) } as any);
        const found = await itemRepository.getItemById(created._id.toString());
        expect(found).toBeDefined();
        expect(found?.title).toBe(itemData.title);
    }, 30000);

    test("should get all items", async () => {
        await itemRepository.createItem({ ...itemData, owner: new mongoose.Types.ObjectId(ownerId) } as any);
        const all = await itemRepository.getAllItems();
        expect(all.length).toBeGreaterThan(0);
    }, 30000);

    test("should update an item", async () => {
        const created = await itemRepository.createItem({ ...itemData, owner: new mongoose.Types.ObjectId(ownerId) } as any);
        const updated = await itemRepository.updateItem(created._id.toString(), { title: "Updated Room" });
        expect(updated?.title).toBe("Updated Room");
    }, 30000);

    test("should delete an item", async () => {
        const created = await itemRepository.createItem({ ...itemData, owner: new mongoose.Types.ObjectId(ownerId) } as any);
        const deleted = await itemRepository.deleteItem(created._id.toString());
        expect(deleted).toBe(true);
    }, 30000);

    test("should get items by owner", async () => {
        await itemRepository.createItem({ ...itemData, owner: new mongoose.Types.ObjectId(ownerId) } as any);
        const ownerItems = await itemRepository.getItemsByOwner(ownerId);
        expect(ownerItems.length).toBe(1);
        expect(ownerItems[0]?.title).toBe(itemData.title);
    }, 30000);

    test("should get bookmarked items for user", async () => {
        const created = await itemRepository.createItem({ ...itemData, owner: new mongoose.Types.ObjectId(ownerId) } as any);
        // Add bookmarked item to user
        await UserModel.findByIdAndUpdate(ownerId, { $push: { bookmarks: created._id } });
        const bookmarks = await itemRepository.getBookmarkedItems(ownerId);
        expect(bookmarks.length).toBe(1);
        expect(bookmarks[0]?._id.toString()).toBe(created._id.toString());
    }, 30000);

    test("should return empty array when user has no bookmarks", async () => {
        const bookmarks = await itemRepository.getBookmarkedItems(ownerId);
        expect(bookmarks.length).toBe(0);
    }, 30000);

    test("should return null when getting non-existent item by id", async () => {
        const nonExistentId = "507f1f77bcf86cd799439011";
        const found = await itemRepository.getItemById(nonExistentId);
        expect(found).toBeNull();
    }, 30000);
});
