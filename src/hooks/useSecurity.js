import { useCallback, useMemo } from 'react';
import DOMPurify from 'isomorphic-dompurify';

// Security configuration
const SECURITY_CONFIG = {
  INPUT_LIMITS: {
    NOTE_MAX_LENGTH: 200,
    NAME_MAX_LENGTH: 40,
    ADDRESS_MAX_LENGTH: 200,
    PHONE_MAX_LENGTH:  8,
    EMAIL_MAX_LENGTH: 50,
  },
  
  ALLOWED_CHARACTERS: {
    NAME: /^[a-zA-Z\s\-'.]+$/,
    PHONE: /^[0-9+\-\s()]+$/,
    POSTAL_CODE: /^[0-9]{6}$/,
    ALPHA_NUMERIC: /^[a-zA-Z0-9\s\-_.]+$/,
  },
};

export function useSecurity() {
  // Basic sanitization function
  const sanitizeInput = useCallback((input, options = {}) => {
    if (typeof input !== 'string' || !input) return '';
    
    const {
      maxLength = null,
      allowedPattern = null,
    } = options;
    
    let sanitized = input.trim();
    
    // Apply DOMPurify to remove HTML/script tags
    sanitized = DOMPurify.sanitize(sanitized, { 
      ALLOWED_TAGS: [], 
      ALLOWED_ATTR: [] 
    });
    
    // Apply character pattern restrictions
    if (allowedPattern) {
      // Keep only allowed characters
      sanitized = sanitized.replace(new RegExp(`[^${allowedPattern.source.slice(2, -2)}]`, 'g'), '');
    }
    
    // Apply length limit
    if (maxLength && sanitized.length > maxLength) {
      sanitized = sanitized.substring(0, maxLength);
    }
    
    return sanitized;
  }, []);

  // Specific field sanitizers
  const sanitizers = useMemo(() => ({
    // For names (customer names, etc.)
    name: (input) => sanitizeInput(input, {
      maxLength: SECURITY_CONFIG.INPUT_LIMITS.NAME_MAX_LENGTH,
      allowedPattern: SECURITY_CONFIG.ALLOWED_CHARACTERS.NAME,
    }),
    
    // For email addresses
    email: (input) => {
      if (!input || typeof input !== 'string') return '';
      const sanitized = input.trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(sanitized) && 
             sanitized.length <= SECURITY_CONFIG.INPUT_LIMITS.EMAIL_MAX_LENGTH
             ? sanitized : input.trim(); // Return original if invalid, let form validation handle it
    },
    
    // For phone numbers
    phone: (input) => sanitizeInput(input, {
      maxLength: SECURITY_CONFIG.INPUT_LIMITS.PHONE_MAX_LENGTH,
      allowedPattern: SECURITY_CONFIG.ALLOWED_CHARACTERS.PHONE,
    }),
    
    // For addresses
    address: (input) => sanitizeInput(input, {
      maxLength: SECURITY_CONFIG.INPUT_LIMITS.ADDRESS_MAX_LENGTH,
      allowedPattern: SECURITY_CONFIG.ALLOWED_CHARACTERS.ALPHA_NUMERIC,
    }),
    
    // For postal codes
    postalCode: (input) => sanitizeInput(input, {
      allowedPattern: SECURITY_CONFIG.ALLOWED_CHARACTERS.POSTAL_CODE,
    }),
    
    // For notes and free text
    note: (input) => sanitizeInput(input, {
      maxLength: SECURITY_CONFIG.INPUT_LIMITS.NOTE_MAX_LENGTH,
    }),
    
    // Generic sanitizer
    generic: (input, options) => sanitizeInput(input, options),
  }), [sanitizeInput]);

  return {
    sanitizers,
    config: SECURITY_CONFIG,
  };
}