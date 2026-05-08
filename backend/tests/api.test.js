"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
const db_1 = require("../src/config/db");
const collections_1 = require("../src/storage/collections");
const fileStore_1 = require("../src/storage/fileStore");
const businessRepository_1 = require("../src/storage/repositories/businessRepository");
const userRepository_1 = require("../src/storage/repositories/userRepository");
async function resetCollections() {
    await Promise.all(collections_1.collectionNames.map((collectionName) => (0, fileStore_1.writeCollection)(collectionName, [])));
}
describe('JSON storage backend', () => {
    let demoUserId = '';
    let otherUserId = '';
    beforeAll(async () => {
        await (0, db_1.connectDB)();
    });
    beforeEach(async () => {
        await resetCollections();
        const business = await businessRepository_1.businessRepository.create({ name: 'Test Kirana', slug: 'test-kirana' });
        const otherBusiness = await businessRepository_1.businessRepository.create({ name: 'Other Kirana', slug: 'other-kirana' });
        const user = await userRepository_1.userRepository.create({
            businessId: business.id,
            name: 'Owner',
            email: 'owner@test.local',
            passwordHash: 'demo',
            role: 'owner',
        });
        const otherUser = await userRepository_1.userRepository.create({
            businessId: otherBusiness.id,
            name: 'Other Owner',
            email: 'other@test.local',
            passwordHash: 'demo',
            role: 'owner',
        });
        demoUserId = user.id;
        otherUserId = otherUser.id;
    });
    it('creates and lists feedback scoped by business', async () => {
        await (0, supertest_1.default)(app_1.default)
            .post('/api/feedback')
            .set('x-demo-user-id', demoUserId)
            .send({ rating: 2, transcript: 'Slow checkout' })
            .expect(201);
        await (0, supertest_1.default)(app_1.default)
            .post('/api/feedback')
            .set('x-demo-user-id', otherUserId)
            .send({ rating: 5, transcript: 'Great service' })
            .expect(201);
        const response = await (0, supertest_1.default)(app_1.default)
            .get('/api/feedback')
            .set('x-demo-user-id', demoUserId)
            .expect(200);
        expect(response.body.total).toBe(1);
        expect(response.body.data[0].transcript).toBe('Slow checkout');
    });
    it('updates stock, returns restock suggestions, and creates notifications', async () => {
        const productResponse = await (0, supertest_1.default)(app_1.default)
            .post('/api/inventory/products')
            .set('x-demo-user-id', demoUserId)
            .send({ name: 'Rice', sku: 'RICE-1', unit: 'kg', currentStock: 5, reorderLevel: 10 })
            .expect(201);
        await (0, supertest_1.default)(app_1.default)
            .post('/api/inventory/movements')
            .set('x-demo-user-id', demoUserId)
            .send({ productId: productResponse.body.data.id, type: 'sale', quantity: 4, date: '2026-01-01T00:00:00.000Z' })
            .expect(201);
        const restock = await (0, supertest_1.default)(app_1.default)
            .get('/api/inventory/restock')
            .set('x-demo-user-id', demoUserId)
            .expect(200);
        expect(restock.body.data[0].suggestedOrder).toBeGreaterThan(0);
        const notifications = await (0, supertest_1.default)(app_1.default)
            .get('/api/notifications')
            .set('x-demo-user-id', demoUserId)
            .expect(200);
        expect(notifications.body.data).toHaveLength(1);
        expect(notifications.body.data[0].type).toBe('inventory.restock');
    });
});
