import dayjs from 'dayjs';

/**
 * Singapore public holidays for 2025 (add more years as needed)
 * Format: 'YYYY-MM-DD'
 */
const SINGAPORE_PUBLIC_HOLIDAYS = [
    // 2025 Public Holidays
    '2025-01-01', // New Year's Day
    '2025-01-29', // Chinese New Year
    '2025-01-30', // Chinese New Year
    '2025-04-18', // Good Friday
    '2025-05-01', // Labour Day
    '2025-05-12', // Vesak Day
    '2025-06-16', // Hari Raya Puasa
    '2025-08-09', // National Day
    '2025-08-23', // Hari Raya Haji
    '2025-10-31', // Deepavali
    '2025-12-25', // Christmas Day
    
    // Add 2026 holidays as needed
    '2026-01-01', // New Year's Day
    // ... add more as needed
];

/**
 * Check if a given date is a Singapore public holiday
 * @param {string|dayjs.Dayjs} date - Date to check
 * @returns {boolean} - True if it's a public holiday
 */
export function isPublicHoliday(date) {
    const dateString = dayjs(date).format('YYYY-MM-DD');
    return SINGAPORE_PUBLIC_HOLIDAYS.includes(dateString);
}

/**
 * Get the minimum selectable date based on current time
 * Rules:
 * - Before 2 PM: Can select from day after tomorrow (2 day block)
 * - After 2 PM: Can select from 3 days later (3 day block)
 * - This includes public holidays
 * 
 * @returns {dayjs.Dayjs} - Minimum selectable date
 */
export function getMinimumSelectableDate() {
    const now = dayjs();
    const currentHour = now.hour();
    
    // Check if current time is before 2 PM (14:00)
    if (currentHour < 14) {
        // 2 day block - can select from day after tomorrow
        return now.add(2, 'day');
    } else {
        // 3 day block - can select from 3 days later
        return now.add(3, 'day');
    }
}

/**
 * Check if a date should be disabled in the date picker
 * @param {dayjs.Dayjs} date - Date to check
 * @returns {boolean} - True if the date should be disabled
 */
export function shouldDisableDate(date) {
    const minDate = getMinimumSelectableDate();
    return date.isBefore(minDate, 'day');
}

/**
 * Get a user-friendly message explaining the date restrictions
 * @returns {string} - Explanation message
 */
export function getDateRestrictionMessage() {
    const now = dayjs();
    const currentHour = now.hour();
    const minDate = getMinimumSelectableDate();
    
    if (currentHour < 14) {
        return `Orders placed before 2 PM can be delivered from ${minDate.format('DD MMM YYYY')} onwards.`;
    } else {
        return `Orders placed after 2 PM can be delivered from ${minDate.format('DD MMM YYYY')} onwards.`;
    }
}

/**
 * Validate if a selected date is valid for delivery
 * @param {string|dayjs.Dayjs} selectedDate - The date to validate
 * @returns {object} - Validation result with isValid and message
 */
export function validateSelectedDate(selectedDate) {
    if (!selectedDate) {
        return {
            isValid: false,
            message: 'Please select a delivery date.'
        };
    }
    
    const date = dayjs(selectedDate);
    const minDate = getMinimumSelectableDate();
    
    if (date.isBefore(minDate, 'day')) {
        return {
            isValid: false,
            message: getDateRestrictionMessage()
        };
    }
    
    return {
        isValid: true,
        message: ''
    };
}

/**
 * Get the current time in Singapore timezone (for debugging/display)
 * @returns {dayjs.Dayjs} - Current time in Singapore
 */
export function getCurrentSingaporeTime() {
    // Note: You might want to use timezone libraries like dayjs-plugin-timezone
    // For now, assuming the system is running in Singapore timezone
    return dayjs();
}
