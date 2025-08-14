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
 * Get the minimum selectable date based on current day of week and time
 * Rules:
 * - Public Holiday or Sunday: now.add(3, 'day') - whole day, no hour validation
 * - Saturday before 2pm: now.add(2, 'day')
 * - Saturday after 2pm: now.add(3, 'day')
 * - Weekdays (Mon-Fri) before 2pm: now.add(1, 'day')
 * - Weekdays (Mon-Fri) after 2pm: now.add(2, 'day')
 * 
 * @returns {dayjs.Dayjs} - Minimum selectable date
 */
export function getMinimumSelectableDate() {
    const now = dayjs();
    const currentHour = now.hour();
    const dayOfWeek = now.day(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const isToday_PublicHoliday = isPublicHoliday(now);
    
    // Public Holiday or Sunday - whole day, no hour validation
    if (dayOfWeek === 0 || isToday_PublicHoliday) {
        return now.add(3, 'day');
    }
    
    // Saturday
    if (dayOfWeek === 6) {
        if (currentHour < 14) {
            return now.add(2, 'day'); // Before 2pm
        } else {
            return now.add(3, 'day'); // After 2pm
        }
    }
    
    // Monday to Friday (weekdays)
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        if (currentHour < 14) {
            return now.add(1, 'day'); // Before 2pm
        } else {
            return now.add(2, 'day'); // After 2pm
        }
    }
    
    // Fallback (shouldn't reach here)
    return now.add(2, 'day');
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
    const dayOfWeek = now.day();
    const minDate = getMinimumSelectableDate();
    const isToday_PublicHoliday = isPublicHoliday(now);
    
    // Public Holiday or Sunday
    if (dayOfWeek === 0 || isToday_PublicHoliday) {
        const dayType = dayOfWeek === 0 ? 'Sunday' : 'Public Holiday';
        return `Orders placed on ${dayType} can be delivered from ${minDate.format('DD MMM YYYY')} onwards.`;
    }
    
    // Saturday
    if (dayOfWeek === 6) {
        const timeRule = currentHour < 14 ? 'before 2 PM' : 'after 2 PM';
        return `Orders placed on Saturday ${timeRule} can be delivered from ${minDate.format('DD MMM YYYY')} onwards.`;
    }
    
    // Weekdays (Mon-Fri)
    const timeRule = currentHour < 14 ? 'before 2 PM' : 'after 2 PM';
    return `Orders placed on weekday ${timeRule} can be delivered from ${minDate.format('DD MMM YYYY')} onwards.`;
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
 * Get delivery schedule info for debugging/display
 * @returns {object} - Current delivery rules and timing
 */
export function getDeliveryScheduleInfo() {
    const now = dayjs();
    const currentHour = now.hour();
    const dayOfWeek = now.day();
    const minDate = getMinimumSelectableDate();
    const isToday_PublicHoliday = isPublicHoliday(now);
    
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    return {
        currentDay: dayNames[dayOfWeek],
        currentTime: now.format('HH:mm'),
        currentDate: now.format('DD MMM YYYY'),
        isBeforeDeadline: currentHour < 14,
        isPublicHoliday: isToday_PublicHoliday,
        minimumDeliveryDate: minDate.format('DD MMM YYYY'),
        daysFromNow: minDate.diff(now, 'day'),
        rule: getRuleDescription()
    };
}

/**
 * Get description of current rule being applied
 * @returns {string} - Rule description
 */
function getRuleDescription() {
    const now = dayjs();
    const currentHour = now.hour();
    const dayOfWeek = now.day();
    const isToday_PublicHoliday = isPublicHoliday(now);
    
    if (dayOfWeek === 0 || isToday_PublicHoliday) {
        return dayOfWeek === 0 ? 'Sunday: +3 days' : 'Public Holiday: +3 days';
    }
    
    if (dayOfWeek === 6) {
        return currentHour < 14 ? 'Saturday before 2pm: +2 days' : 'Saturday after 2pm: +3 days';
    }
    
    return currentHour < 14 ? 'Weekday before 2pm: +1 day' : 'Weekday after 2pm: +2 days';
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