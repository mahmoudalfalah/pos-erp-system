import 'dotenv/config';
import { db } from '@/lib/db';
import { seedUsers } from './seeders/users.seeder';
import { seedCategories } from './seeders/categories.seeder';

const main = async () => {
  console.log('Starting seed...');
  await seedUsers();
  await seedCategories();
  console.log('Seed complete');
};

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
