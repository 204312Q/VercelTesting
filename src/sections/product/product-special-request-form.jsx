'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';

import { Iconify } from 'src/components/iconify';

// Move outside component to prevent recreation
const PRESET_REQUESTS = [
    { id: 'sp-1', value: 'No Pork Innards', label: 'Pork Innards' },
    { id: 'sp-2', value: 'No Pig Trotter', label: 'Pig Trotter' },
    { id: 'sp-3', value: 'No Chicken/Fish', label: 'Chicken/Fish' },
    { id: 'sp-4', value: 'No Chicken & Egg for first 1 or 2 weeks', label: 'Chicken & Egg for the first 1 or 2 weeks' },
    { id: 'sp-5', value: 'No Papaya Fish Soup', label: 'Papaya Fish Soup' },
    { id: 'sp-6', value: 'No Salmon', label: 'Salmon' },
    { id: 'sp-7', value: 'All White Rice', label: 'All White Rice' },
    { id: 'sp-8', value: 'All Brown Rice', label: 'All Brown Rice' },
    { id: 'sp-9', value: 'No Snow/Sweet Peas', label: 'Snow/Sweet Peas' },
    { id: 'sp-10', value: 'No Sugar in Red Dates Tea', label: 'Sugar in Red Dates Tea' },
    { id: 'sp-11', value: 'No Weekend Deliveries', label: 'Weekend Deliveries' },
];

export function ProductSpecialRequestForm({ onRequestChange }) {
    const [customRequests, setCustomRequests] = useState('');
    const [presetRequests, setPresetRequests] = useState([]);
    const [expanded, setExpanded] = useState(false);

    // Memoize expensive calculations
    const hasRequests = useMemo(() =>
        presetRequests.length > 0 || customRequests.trim().length > 0,
        [presetRequests.length, customRequests]
    );

    const totalRequests = useMemo(() => {
        const allRequests = [...presetRequests];
        if (customRequests.trim()) {
            allRequests.push(customRequests.trim());
        }

        return allRequests.join('; ');
    }, [presetRequests, customRequests]);

    // Optimized event handlers
    const handleCustomRequestChange = useCallback((e) => {
        setCustomRequests(e.target.value);
    }, []);

    const handlePresetRequestChange = useCallback((requestValue) => {
        setPresetRequests(prev =>
            prev.includes(requestValue)
                ? prev.filter(val => val !== requestValue)
                : [...prev, requestValue]
        );
    }, []);

    const handleAccordionChange = useCallback((event, isExpanded) => {
        setExpanded(isExpanded);
    }, []);

    // Notify parent only when totalRequests changes
    useEffect(() => {
        if (onRequestChange) {
            onRequestChange(totalRequests);
        }
    }, [totalRequests, onRequestChange]);

    return (
        <Box sx={{
            mt: 2,
            borderTop: '5px solid #F27C96',
            borderRadius: '4px 4px 0px 0px',
            boxShadow: 2
        }}>
            <Accordion
                expanded={expanded}
                onChange={handleAccordionChange}
                sx={{
                    '&:before': {
                        display: 'none',
                    },
                }}
            >
                <AccordionSummary
                    expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
                    sx={{
                        py: 0.5,
                        '& .MuiAccordionSummary-content': {
                            alignItems: 'center',
                        }
                    }}
                >
                    <Typography variant="h6" sx={{ ml: 1 }}>
                        Special Requests {hasRequests && `(${presetRequests.length + (customRequests.trim() ? 1 : 0)})`}
                    </Typography>
                </AccordionSummary>

                <AccordionDetails sx={{ pt: 0, pb: 3, px: 3 }}>
                    {/* Preset Checkboxes */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" gutterBottom sx={{ mb: 2, color: 'primary.darker', pl: 0 }}>
                            Exclude the Following:
                        </Typography>
                        <Box sx={{ pl: 0 }}>
                            <Grid container spacing={1}>
                                {PRESET_REQUESTS.map((request) => (
                                    <Grid item xs={12} sm={4} key={request.id}>
                                        <PresetRequestCheckbox
                                            request={request}
                                            checked={presetRequests.includes(request.value)}
                                            onChange={handlePresetRequestChange}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </Box>

                    {/* Custom Notes */}
                    <Box>
                        <Typography variant="subtitle2" gutterBottom sx={{ mb: 2, pl: 0 }}>
                            Notes:
                        </Typography>
                        <Box sx={{ pl: 0 }}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                variant="outlined"
                                placeholder="Enter any additional special requests here..."
                                value={customRequests}
                                onChange={handleCustomRequestChange}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: 'grey.300',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: 'primary.main',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: 'primary.main',
                                        },
                                    },
                                }}
                            />
                        </Box>
                    </Box>

                    {customRequests && (
                        <Box sx={{ mt: 2, p: 1.5, backgroundColor: 'grey.50', borderRadius: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                                Character count: {customRequests.length}
                            </Typography>
                        </Box>
                    )}
                </AccordionDetails>
            </Accordion>
        </Box>
    );
}

// Separate component to prevent unnecessary re-renders
const PresetRequestCheckbox = ({ request, checked, onChange }) => {
    const handleChange = useCallback(() => {
        onChange(request.value);
    }, [onChange, request.value]);

    return (
        <FormControlLabel
            control={
                <Checkbox
                    checked={checked}
                    onChange={handleChange}
                    size="small"
                    value={request.value}
                />
            }
            label={
                <Typography variant="body2">
                    {request.label}
                </Typography>
            }
            sx={{
                width: '100%',
                m: 0,
                p: 0,
                '& .MuiFormControlLabel-label': {
                    fontSize: '0.875rem'
                }
            }}
        />
    );
};