import { useState, useCallback } from 'react';
import { validateSecureInput, containsDangerousContent, SECURITY_CONFIG } from '../utils/security';

export const useSecureInput = (initialValue = '', maxLength = SECURITY_CONFIG.MAX_TEXT_INPUT_LENGTH) => {
    const [value, setValue] = useState(initialValue);
    const [error, setError] = useState('');

    const handleChange = useCallback((event) => {
        const inputValue = event.target ? event.target.value : event;

        // Clear previous error
        setError('');

        // Validate the input
        const validation = validateSecureInput(inputValue, maxLength);

        if (validation.isValid) {
            setValue(validation.sanitized);
        } else {
            setError(validation.errors[0]);
            // Don't update value if invalid
            return;
        }
    }, [maxLength]);

    const handlePaste = useCallback((event) => {
        const pastedText = event.clipboardData.getData('text');

        if (containsDangerousContent(pastedText)) {
            event.preventDefault();
            setError('Invalid content detected in pasted text');
            setTimeout(() => setError(''), 3000);
        }
    }, []);

    const reset = useCallback(() => {
        setValue('');
        setError('');
    }, []);

    return {
        value,
        error,
        handleChange,
        handlePaste,
        reset,
        isValid: !error && value.length <= maxLength,
        characterCount: value.length,
        maxLength,
        helperText: error || '' // REMOVED character count
    };
};

// Specialized hook for email input
export const useSecureEmailInput = (initialValue = '') => {
    const input = useSecureInput(initialValue, SECURITY_CONFIG.MAX_EMAIL_LENGTH);

    const validateEmail = useCallback((value) => {
        if (!value.trim()) return null;
        if (!/\S+@\S+\.\S+/.test(value)) return 'Email is invalid';
        return null;
    }, []);

    const emailError = input.value ? validateEmail(input.value) : null;

    return {
        ...input,
        emailError,
        isValidEmail: !input.error && !emailError,
        helperText: input.error || emailError || '' // REMOVED character count
    };
};

// Specialized hook for phone input
export const useSecurePhoneInput = (initialValue = '') => {
    const input = useSecureInput(initialValue, SECURITY_CONFIG.MAX_PHONE_LENGTH);

    const validatePhone = useCallback((value) => {
        if (!value.trim()) return null;
        // Basic phone validation - adjust regex as needed for Singapore format
        if (!/^[\+]?[0-9\s\-\(\)]{8,20}$/.test(value)) return 'Invalid phone number format';
        return null;
    }, []);

    const phoneError = input.value ? validatePhone(input.value) : null;

    return {
        ...input,
        phoneError,
        isValidPhone: !input.error && !phoneError,
        helperText: input.error || phoneError || '' // REMOVED character count
    };
};