// Create: src/utils/security.js
export const SECURITY_CONFIG = {
    MAX_TEXT_INPUT_LENGTH: 100,
    MAX_EMAIL_LENGTH: 50,
    MAX_NAME_LENGTH: 30,
    MAX_PHONE_LENGTH: 8,
    MAX_ADDRESS_LENGTH: 50,
    MAX_TEXTAREA_LENGTH: 100,
};

// XSS pattern detection
export const containsDangerousContent = (text) => {
    if (!text || typeof text !== 'string') return false;

    const dangerousPatterns = [
        /<script/i,
        /<\/script>/i,
        /javascript:/i,
        /on\w+\s*=/i,
        /<iframe/i,
        /<object/i,
        /<embed/i,
        /vbscript:/i,
        /data:text\/html/i,
        /<svg/i,
        /<img[^>]+src[^>]*>/i,
        /&lt;script/i,
        /&lt;\/script&gt;/i,
        /<link/i,
        /<meta/i,
        /<style/i,
        /expression\s*\(/i,
        /url\s*\(/i,
        /@import/i,
        /javascript\s*:/i,
        /vbscript\s*:/i,
        /livescript\s*:/i,
        /mocha\s*:/i,
        /charset\s*=/i,
        /document\./i,
        /window\./i,
        /eval\s*\(/i,
        /alert\s*\(/i,
        /confirm\s*\(/i,
        /prompt\s*\(/i
    ];

    return dangerousPatterns.some(pattern => pattern.test(text));
};

// HTML sanitization
export const sanitizeText = (text) => {
    if (!text || typeof text !== 'string') return '';

    return text
        .replace(/<[^>]*>/g, '')     // Remove HTML tags
        .replace(/&lt;/g, '<')      // Decode HTML entities
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#x27;/g, "'")
        .replace(/&#x2F;/g, '/')
        .replace(/&#x60;/g, '`')
        .replace(/&#x3D;/g, '=')
        .replace(/[<>]/g, '')       // Remove remaining < > characters
        .replace(/\0/g, '')         // Remove null bytes
        .trim();
};

// Validate input with security checks
export const validateSecureInput = (text, maxLength = SECURITY_CONFIG.MAX_TEXT_INPUT_LENGTH) => {
    const errors = [];

    if (!text || typeof text !== 'string') {
        return { isValid: true, errors: [], sanitized: '' };
    }

    // Length validation
    if (text.length > maxLength) {
        errors.push(`Maximum ${maxLength} characters allowed`);
    }

    // XSS validation
    if (containsDangerousContent(text)) {
        errors.push('Invalid content detected. Please remove special characters or scripts.');
    }

    // Sanitize the text
    const sanitized = sanitizeText(text);

    return {
        isValid: errors.length === 0,
        errors,
        sanitized
    };
};