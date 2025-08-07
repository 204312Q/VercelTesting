export const PROMO_CODES = [
    {
        code: "EB5OFF",
        description: "5% off Early Bird",
        type: "percentage",
        value: 5,
        conditions: {
            minOrderAmount: 0,
            maxDiscountAmount: 0,
            applicableProducts: [1, 2, 3, 5], // Empty = all products
            applicableCategories: [],
            excludesBundles: false,
            validFrom: "2024-01-01",
            validUntil: "2025-12-31"
        }
    },
]