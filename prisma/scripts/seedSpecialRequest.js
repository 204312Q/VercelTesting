// prisma/scripts/seedSpecialRequest.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const ITEMS = [
  { value: 'No Pork Innards',                              label: 'Pork Innards',                              sort: 1,  active: true },
  { value: 'No Pig Trotter',                               label: 'Pig Trotter',                               sort: 2,  active: true },
  { value: 'No Chicken',                                   label: 'Chicken',                                   sort: 3,  active: true },
  { value: 'No Fish',                                      label: 'Fish',                                      sort: 4,  active: true },
  { value: 'No Chicken & Egg for the first 1 or 2 weeks',  label: 'Chicken & Egg for the first 1 or 2 weeks',  sort: 5,  active: true },
  { value: 'No Papaya Fish Soup',                          label: 'Papaya Fish Soup',                          sort: 6,  active: true },
  { value: 'No Salmon',                                    label: 'Salmon',                                    sort: 7,  active: true },
  { value: 'No Snow/Sweet Peas',                           label: 'Snow/Sweet Peas',                           sort: 8,  active: true },
  { value: 'No Sugar in Red Dates Tea',                    label: 'Sugar in Red Dates Tea',                    sort: 9,  active: true },
];


export default async function seedSpecialRequest() {
  for (const item of ITEMS) {
    await prisma.specialRequest.upsert({
      where: { value: item.value }, // upsert by canonical key
      update: { label: item.label, sort: item.sort, active: item.active },
      create: item,
    });
  }
  console.log('✅ Seeded special request.');
}
