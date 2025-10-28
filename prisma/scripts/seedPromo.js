// prisma/scripts/seedPromo.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export default async function seedPromo() {
  // 2025-01-01 → 2026-12-31
  const STARTS_AT = new Date('2025-01-01T00:00:00+08:00');       // Singapore time
  const ENDS_AT   = new Date('2026-12-31T23:59:59.999+08:00');

  const promos = [
    { code: 'EB5',  percent: '5',  label: 'Early Bird 5%' },
    { code: 'GB15', percent: '15', label: 'Gift Box 15%' },
  ];

  for (const p of promos) {
    await prisma.promotion.upsert({
      where: { promotion_code: p.code },
      update: {
        discount_type: 'PERCENT',     // 👈 plain string avoids enum import issues
        discount_value: p.percent,    // 👈 string → Decimal safely
        starts_at: STARTS_AT,
        ends_at: ENDS_AT,
        max_uses: null,
        extra_rules: { label: p.label },
      },
      create: {
        promotion_code: p.code,
        discount_type: 'PERCENT',
        discount_value: p.percent,
        starts_at: STARTS_AT,
        ends_at: ENDS_AT,
        max_uses: null,
        extra_rules: { label: p.label },
        created_by: 'seed',
      },
    });
  }

  console.log('✅ Seeded promotions: EB5 (5%), GB15 (15%)');
}
