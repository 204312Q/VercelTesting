'use client';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import { Iconify } from 'src/components/iconify';

import React, { useState } from 'react';

// ----------------------------------------------------------------------

export function OrderDetailsStarting({ startType, startDate, eddDate, onUpdate }) {
    const [editing, setEditing] = useState(false);
    const [dateType, setDateType] = useState(eddDate ? 'EDD' : 'Confirm Start Date');
    const [type, setType] = useState(startType || '');
    const [date, setDate] = useState(startDate || '');
    const [edd, setEdd] = useState(eddDate || '');

    const handleEdit = () => setEditing(true);
    const handleCancel = () => {
        setDateType(eddDate ? 'EDD' : 'Confirm Start Date');
        setType(startType || '');
        setDate(startDate || '');
        setEdd(eddDate || '');
        setEditing(false);
    };
    const handleSave = () => {
        if (onUpdate) {
            if (dateType === 'EDD') {
                onUpdate({ type: '', date: '', edd });
            } else {
                onUpdate({ type, date, edd: '' });
            }
        }
        setEditing(false);

        setEditing(false);

        // --- Backend logic (to be implemented) ---
        // 1. Send a request to your backend API with the updated values:
        //    - If date type is E.D.D, send { edd }
        //    - If date type is Confirm Start Date, send { type, date }
        //
        // 2. The backend API (e.g. /api/order/update-starting-date) should:
        //    - Receive the payload and orderId
        //    - Use Prisma to update the order record:
        //      Example (pseudo-code):
        //      await prisma.order.update({
        //        where: { id: orderId },
        //        data: {
        //          startType: type,
        //          startDate: date,
        //          eddDate: edd
        //        }
        //      });
        //    - Return success or error response
        //
        // Example frontend call:
        // fetch('/api/order/update-starting-date', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ orderId, type, date, edd })
        // })
        //   .then(res => res.json())
        //   .then(data => { /* handle response */ });
        // -----------------------------------------

    };

    // Logic for display
    let dateTypeLabel = eddDate ? 'E.D.D' : (startDate ? 'Confirm Start Date' : '—');
    let startTypeLabel = eddDate ? '—' : (startType || '—');

    return (
        <>
            <CardHeader
                title="Starting Date"
                action={
                    !editing && (
                        <IconButton onClick={handleEdit}>
                            <Iconify icon="solar:pen-bold" />
                        </IconButton>
                    )
                }
            />
            <Stack spacing={1.5} sx={{ p: 3, typography: 'body2' }}>
                {editing ? (
                    <>
                        <Box sx={{ mb: 2 }}>
                            <Typography sx={{ color: 'text.secondary', mb: 0.5 }}>Date Type</Typography>
                            <Select
                                size="small"
                                value={dateType}
                                onChange={e => setDateType(e.target.value)}
                                sx={{ minWidth: 200 }}
                            >
                                <MenuItem value="Confirm Start Date">Confirm Start Date</MenuItem>
                                <MenuItem value="EDD">E.D.D</MenuItem>
                            </Select>
                        </Box>
                        {dateType === 'EDD' ? (
                            <Box sx={{ mb: 2 }}>
                                <Typography sx={{ color: 'text.secondary', mb: 0.5 }}>E.D.D Date</Typography>
                                <TextField
                                    size="small"
                                    type="date"
                                    value={edd}
                                    onChange={e => setEdd(e.target.value)}
                                    sx={{ minWidth: 200 }}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Box>
                        ) : (
                            <>
                                <Box sx={{ mb: 2 }}>
                                    <Typography sx={{ color: 'text.secondary', mb: 0.5 }}>Start Date</Typography>
                                    <TextField
                                        size="small"
                                        type="date"
                                        value={date}
                                        onChange={e => setDate(e.target.value)}
                                        sx={{ minWidth: 200 }}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Box>
                                <Box sx={{ mb: 2 }}>
                                    <Typography sx={{ color: 'text.secondary', mb: 0.5 }}>Start Type</Typography>
                                    <Select
                                        size="small"
                                        value={type}
                                        onChange={e => setType(e.target.value)}
                                        sx={{ minWidth: 200 }}
                                    >
                                        <MenuItem value="Lunch">Lunch</MenuItem>
                                        <MenuItem value="Dinner">Dinner</MenuItem>
                                    </Select>
                                </Box>
                            </>
                        )}
                        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                            <Button variant="contained" size="small" onClick={handleSave}>Save</Button>
                            <Button size="small" onClick={handleCancel}>Cancel</Button>
                        </Box>
                    </>
                ) : (
                    <>
                        <Box sx={{ mb: 2 }}>
                            <Typography sx={{ color: 'text.secondary', mb: 0.5 }}>Date Type</Typography>
                            <Typography>{dateTypeLabel}</Typography>
                        </Box>
                        {dateTypeLabel === 'E.D.D' ? (
                            <Box sx={{ mb: 2 }}>
                                <Typography sx={{ color: 'text.secondary', mb: 0.5 }}>E.D.D Date</Typography>
                                <Typography>{eddDate || '—'}</Typography>
                            </Box>
                        ) : (
                            <>
                                <Box sx={{ mb: 2 }}>
                                    <Typography sx={{ color: 'text.secondary', mb: 0.5 }}>Start Type</Typography>
                                    <Typography>{startTypeLabel}</Typography>
                                </Box>
                                <Box sx={{ mb: 2 }}>
                                    <Typography sx={{ color: 'text.secondary', mb: 0.5 }}>Start Date</Typography>
                                    <Typography>{startDate || '—'}</Typography>
                                </Box>
                            </>
                        )}
                    </>
                )}
            </Stack>
        </>
    );
}