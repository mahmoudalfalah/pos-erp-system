import { db } from '@/lib/db';

const SEED_CATEGORIES = [
  { name: 'Snacks', description: 'Delicious Snacks', slug: 'snacks' },
  { name: 'Beverages', description: 'Delicious Beverages', slug: 'beverages' },
  { name: 'Food', description: 'Delicious Food', slug: 'food' },
  { name: 'Stationery', description: 'Stationery items', slug: 'stationery' },
  { name: 'Dairy', description: 'Dairy products', slug: 'dairy' },
  { name: 'Meat', description: 'Meat products', slug: 'meat' },
  { name: 'Electronics', description: 'Electronic items', slug: 'electronics' },
  { name: 'Clothing', description: 'Clothing items', slug: 'clothing' },
  { name: 'Shoes', description: 'Shoes', slug: 'shoes' },
  { name: 'Accessories', description: 'Accessories', slug: 'accessories' },
  { name: 'Groceries', description: 'Groceries', slug: 'groceries' },
  { name: 'Hygiene', description: 'Hygiene products', slug: 'hygiene' },
  { name: 'Household', description: 'Household products', slug: 'household' },
  { name: 'Medical', description: 'Medical products', slug: 'medical' },
  { name: 'Baby', description: 'Baby products', slug: 'baby' },
  { name: 'Pets', description: 'Pet products', slug: 'pets' },
  { name: 'Toys', description: 'Toys', slug: 'toys' },
  { name: 'Sports', description: 'Sports products', slug: 'sports' },
  { name: 'Outdoor', description: 'Outdoor products', slug: 'outdoor' },
  { name: 'Home Improvement', description: 'Home Improvement products', slug: 'home-improvement' },
  { name: 'Tools', description: 'Tools', slug: 'tools' },
  { name: 'Gardening', description: 'Gardening products', slug: 'gardening' },
  { name: 'Automotive', description: 'Automotive products', slug: 'automotive' },
  { name: 'Office', description: 'Office products', slug: 'office' },
  { name: 'Art Supplies', description: 'Art supplies', slug: 'art-supplies' },
  { name: 'Craft Supplies', description: 'Craft supplies', slug: 'craft-supplies' },
  { name: 'Party Supplies', description: 'Party supplies', slug: 'party-supplies' },
  { name: 'Gift Supplies', description: 'Gift supplies', slug: 'gift-supplies' },
  { name: 'Packaging Supplies', description: 'Packaging supplies', slug: 'packaging-supplies' },
];

export async function seedCategories() {
  const result = await db.category.createMany({
    data: SEED_CATEGORIES,
    skipDuplicates: true,
  });

  console.log(`Categories: created ${result.count} records`);
}
