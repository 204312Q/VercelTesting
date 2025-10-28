'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';

export function ProductAddOnForm({ addOnItems = [], onAddOnChange }) {
    const [selectedAddOns, setSelectedAddOns] = useState([]);
    const [addOnSelections, setAddOnSelections] = useState({});

    // Memoize expensive grouping operation
    const groupedAddOns = useMemo(() => {
        const grouped = {};

        addOnItems.forEach(addon => {
            // Extract base name (remove duration part)
            let baseName = addon.name;
            if (baseName.includes('(')) {
                baseName = baseName.substring(0, baseName.lastIndexOf('(')).trim();
            }

            if (!grouped[baseName]) {
                grouped[baseName] = {
                    name: baseName,
                    items: [],
                    isSingle: false
                };
            }

            grouped[baseName].items.push(addon);
        });

        // Mark single items and sort multi-option items
        Object.keys(grouped).forEach(key => {
            if (grouped[key].items.length === 1) {
                grouped[key].isSingle = true;
            } else {
                // Sort by duration for multi-option items
                grouped[key].items.sort((a, b) => a.duration - b.duration);
            }
        });

        return grouped;
    }, [addOnItems]);

    // Memoize total price calculation
    const totalAddOnPrice = useMemo(() =>
        selectedAddOns.reduce((sum, item) => sum + item.price, 0),
        [selectedAddOns]
    );

    // Memoize isGroupSelected function
    const isGroupSelected = useCallback((groupName, singleItem = null) => {
        if (singleItem) {
            return selectedAddOns.some(item => item.product_id === singleItem.product_id);
        }

        return selectedAddOns.some(item => {
            const baseName = item.name.includes('(')
                ? item.name.substring(0, item.name.lastIndexOf('(')).trim()
                : item.name;
            return baseName === groupName;
        });
    }, [selectedAddOns]);

    // Optimized add-on change handler
    const handleAddOnChange = useCallback((groupName, checked, singleItem = null) => {
        setSelectedAddOns(prev => {
            let updatedAddOns = [...prev];

            if (checked) {
                if (singleItem) {
                    // Single item add-on
                    updatedAddOns.push(singleItem);
                } else {
                    // Multi-option add-on - add first option by default
                    const firstOption = groupedAddOns[groupName].items[0];
                    updatedAddOns.push(firstOption);

                    // Update selections in a separate state update
                    setAddOnSelections(prevSelections => ({
                        ...prevSelections,
                        [groupName]: firstOption.product_id
                    }));
                }
            } else {
                // Remove all items from this group
                updatedAddOns = updatedAddOns.filter(item => {
                    if (singleItem) {
                        return item.product_id !== singleItem.product_id;
                    } else {
                        const baseName = item.name.includes('(')
                            ? item.name.substring(0, item.name.lastIndexOf('(')).trim()
                            : item.name;
                        return baseName !== groupName;
                    }
                });

                // Remove from selections for multi-option items
                if (!singleItem) {
                    setAddOnSelections(prevSelections => {
                        const newSelections = { ...prevSelections };
                        delete newSelections[groupName];
                        return newSelections;
                    });
                }
            }

            return updatedAddOns;
        });
    }, [groupedAddOns]);

    // Optimized option change handler
    const handleOptionChange = useCallback((groupName, selectedProductId) => {
        const selectedOption = groupedAddOns[groupName].items.find(
            item => item.product_id === parseInt(selectedProductId)
        );

        // Update selections
        setAddOnSelections(prev => ({
            ...prev,
            [groupName]: parseInt(selectedProductId)
        }));

        // Update selected add-ons - replace the old option with new one
        setSelectedAddOns(prev => prev.map(item => {
            const baseName = item.name.includes('(')
                ? item.name.substring(0, item.name.lastIndexOf('(')).trim()
                : item.name;

            if (baseName === groupName) {
                return selectedOption;
            }
            return item;
        }));
    }, [groupedAddOns]);

    // Effect to notify parent component of changes
    useEffect(() => {
        if (onAddOnChange) {
            onAddOnChange(selectedAddOns);
        }
    }, [selectedAddOns, onAddOnChange]);

    return (
        <Card sx={{
            mt: 2,
            borderTop: '5px solid #F27C96',
            borderRadius: '4px 4px 0 0',
        }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Add Ons:
                </Typography>

                <Box sx={{ mt: 2 }}>
                    {Object.entries(groupedAddOns).map(([groupName, group]) => {
                        const isSelected = isGroupSelected(groupName, group.isSingle ? group.items[0] : null);

                        return (
                            <Box key={groupName} sx={{ mb: 3 }}>
                                {/* Main Add-On Checkbox with Image */}
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={isSelected}
                                                onChange={(e) => handleAddOnChange(groupName, e.target.checked, group.isSingle ? group.items[0] : null)}
                                                color="primary"
                                            />
                                        }
                                        label=""
                                        sx={{ mr: 2, mt: 1 }}
                                    />

                                    {/* Image */}
                                    <Box sx={{
                                        width: 60,
                                        height: 60,
                                        borderRadius: 1,
                                        overflow: 'hidden',
                                        mr: 2,
                                        flexShrink: 0,
                                        border: '1px solid',
                                        borderColor: 'grey.300'
                                    }}>
                                        <Box
                                            component="img"
                                            src={group.isSingle ? group.items[0].image || '/placeholder-image.jpg' : group.items[0].image || '/placeholder-image.jpg'}
                                            alt={group.isSingle ? group.items[0].name : groupName}
                                            sx={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                            }}
                                            onError={(e) => {
                                                e.target.src = '/placeholder-image.jpg';
                                            }}
                                        />
                                    </Box>

                                    {/* Label and Details */}
                                    <Box sx={{ flex: 1, mt: 1 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                {group.isSingle ? group.items[0].name : groupName}
                                            </Typography>
                                            {group.isSingle && (
                                                <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 600, ml: 2 }}>
                                                    ${group.items[0].price}
                                                </Typography>
                                            )}
                                        </Box>
                                        {/* Show description for both single and multi-option items */}
                                        {((group.isSingle && group.items[0].description) || (!group.isSingle && group.items[0].description)) && (
                                            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                                                {group.items[0].description}
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>

                                {/* Options (if add-on is selected and has multiple options) */}
                                {isSelected && !group.isSingle && (
                                    <Box sx={{ ml: 4, mt: 2 }}>
                                        <RadioGroup
                                            value={addOnSelections[groupName] || group.items[0].product_id}
                                            onChange={(e) => handleOptionChange(groupName, e.target.value)}
                                        >
                                            {group.items.map((item) => (
                                                <FormControlLabel
                                                    key={item.product_id}
                                                    value={item.product_id}
                                                    control={<Radio size="small" />}
                                                    label={
                                                        <Box sx={{ ml: 1, display: 'flex', alignItems: 'center' }}>
                                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                                {item.duration} Serving{item.duration > 1 ? 's' : ''}
                                                            </Typography>
                                                            <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 600, ml: 2 }}>
                                                                ${item.price}
                                                            </Typography>
                                                        </Box>
                                                    }
                                                    sx={{
                                                        mb: 1.5,
                                                        alignItems: 'flex-start',
                                                        '& .MuiFormControlLabel-label': {
                                                            fontSize: '0.875rem',
                                                        }
                                                    }}
                                                />
                                            ))}
                                        </RadioGroup>
                                    </Box>
                                )}
                            </Box>
                        );
                    })}
                </Box>
            </CardContent>
        </Card>
    );
}