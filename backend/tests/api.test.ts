import request from 'supertest';
import app from '../src/app';
import { connectDB } from '../src/config/db';
import { collections, collectionNames } from '../src/storage/collections';
import { writeCollection } from '../src/storage/fileStore';
import { businessRepository } from '../src/storage/repositories/businessRepository';
import { userRepository } from '../src/storage/repositories/userRepository';

async function resetCollections(): Promise<void> {
  await Promise.all(collectionNames.map((collectionName) => writeCollection(collectionName, [])));
}

describe('JSON storage backend', () => {
  let demoUserId = '';
  let otherUserId = '';

  beforeAll(async () => {
    await connectDB();
  });

  beforeEach(async () => {
    await resetCollections();
    const business = await businessRepository.create({ name: 'Test Kirana', slug: 'test-kirana' });
    const otherBusiness = await businessRepository.create({ name: 'Other Kirana', slug: 'other-kirana' });
    const user = await userRepository.create({
      businessId: business.id,
      name: 'Owner',
      email: 'owner@test.local',
      passwordHash: 'demo',
      role: 'owner',
    });
    const otherUser = await userRepository.create({
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
    await request(app)
      .post('/api/feedback')
      .set('x-demo-user-id', demoUserId)
      .send({ rating: 2, transcript: 'Slow checkout' })
      .expect(201);

    await request(app)
      .post('/api/feedback')
      .set('x-demo-user-id', otherUserId)
      .send({ rating: 5, transcript: 'Great service' })
      .expect(201);

    const response = await request(app)
      .get('/api/feedback')
      .set('x-demo-user-id', demoUserId)
      .expect(200);

    expect(response.body.total).toBe(1);
    expect(response.body.data[0].transcript).toBe('Slow checkout');
  });

  it('updates stock, returns restock suggestions, and creates notifications', async () => {
    const productResponse = await request(app)
      .post('/api/inventory/products')
      .set('x-demo-user-id', demoUserId)
      .send({ name: 'Rice', sku: 'RICE-1', unit: 'kg', currentStock: 5, reorderLevel: 10 })
      .expect(201);

    await request(app)
      .post('/api/inventory/movements')
      .set('x-demo-user-id', demoUserId)
      .send({ productId: productResponse.body.data.id, type: 'sale', quantity: 4, date: '2026-01-01T00:00:00.000Z' })
      .expect(201);

    const restock = await request(app)
      .get('/api/inventory/restock')
      .set('x-demo-user-id', demoUserId)
      .expect(200);

    expect(restock.body.data[0].suggestedOrder).toBeGreaterThan(0);

    const notifications = await request(app)
      .get('/api/notifications')
      .set('x-demo-user-id', demoUserId)
      .expect(200);

    expect(notifications.body.data).toHaveLength(1);
    expect(notifications.body.data[0].type).toBe('inventory.restock');
  });
});
