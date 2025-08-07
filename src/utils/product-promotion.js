import { PROMO_CODES } from 'src/_mock/_promo';

export function validatePromoCode(code, orderData, selectedAddOns = []) {
    const promoCode = PROMO_CODES.find(promo =>
        promo.code.toLowerCase() === code.toLowerCase()
    );

    if (!promoCode) {
        return { valid: false, error: "Invalid promo code" };
    }

    const conditions = promoCode.conditions;
    const basePrice = orderData?.selectedProduct?.price || 0;
    const bundlePrice = orderData?.bundlePrice || 0;
    const addOnTotal = selectedAddOns.reduce((sum, item) => sum + item.price, 0);
    const packagePrice = bundlePrice > 0 ? bundlePrice : basePrice;
    const subtotal = packagePrice + addOnTotal;

    // Check date validity
    const now = new Date();
    const validFrom = new Date(conditions.validFrom);
    const validUntil = new Date(conditions.validUntil);

    if (now < validFrom || now > validUntil) {
        return { valid: false, error: "Promo code has expired" };
    }

    // Check minimum order amount
    if (conditions.minOrderAmount && subtotal < conditions.minOrderAmount) {
        return {
            valid: false,
            error: `Minimum order of $${conditions.minOrderAmount} required`
        };
    }

    // Check product restrictions
    if (conditions.applicableProducts?.length > 0) {
        const productId = orderData?.selectedProduct?.product_id;
        if (!conditions.applicableProducts.includes(productId)) {
            return {
                valid: false,
                error: "This promo code is not applicable to the selected product"
            };
        }
    }

    // Check category restrictions  
    if (conditions.applicableCategories?.length > 0) {
        const category = orderData?.category;
        if (!conditions.applicableCategories.includes(category)) {
            return {
                valid: false,
                error: "This promo code is not applicable to the selected category"
            };
        }
    }

    // Check bundle exclusions
    if (conditions.excludesBundles && orderData?.selectedBundles?.length > 0) {
        return {
            valid: false,
            error: "This promo code cannot be used with bundles"
        };
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (promoCode.type === "percentage") {
        discountAmount = (subtotal * promoCode.value) / 100;
        if (conditions.maxDiscountAmount) {
            discountAmount = Math.min(discountAmount, conditions.maxDiscountAmount);
        }
    } else if (promoCode.type === "fixed") {
        discountAmount = promoCode.value;
    }

    return {
        valid: true,
        promoCode,
        discountAmount: Math.round(discountAmount * 100) / 100, // Round to 2 decimal places
        description: promoCode.description
    };
}