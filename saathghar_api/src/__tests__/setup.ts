import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongo: MongoMemoryServer;

import { beforeAll, afterAll, beforeEach } from "bun:test";

beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();
    await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 10000,
    });
});

afterAll(async () => {
    await mongoose.connection.close();
    if (mongo) {
        await mongo.stop();
    }
});

beforeEach(async () => {
    const collections: Record<string, any> = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        if (collection) {
            await collection.deleteMany({});
        }
    }
});
