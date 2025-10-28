// src/sections/menu/menu-calendar-skeleton.jsx
'use client';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Container from '@mui/material/Container';

export function MenuCalendarSkeleton() {
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4, p: 3, maxWidth: '48rem', mx: 'auto', bgcolor: 'white', boxShadow: 3, borderRadius: 2 }}>

                {/* Title Skeleton */}
                <Skeleton variant="text" sx={{ fontSize: '2rem', mb: 6, mx: 'auto', width: '60%' }} />

                {/* Date Picker Skeleton */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
                    <Skeleton variant="rounded" width={256} height={56} />
                </Box>

                {/* Week Buttons Skeleton */}
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mb: 2 }}>
                    {[1, 2, 3, 4].map((week) => (
                        <Skeleton key={week} variant="rounded" width={140} height={70} />
                    ))}
                </Box>

                {/* Day Buttons Skeleton */}
                <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center', mb: 6 }}>
                    {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                        <Skeleton key={day} variant="rounded" width={50} height={65} />
                    ))}
                </Box>

                {/* Menu Cards Skeleton */}
                <Box sx={{ display: 'flex', gap: 3, mt: 2 }}>
                    {["Lunch", "Dinner"].map((type) => (
                        <Paper key={type} elevation={3} sx={{ flex: 1, p: 3, backgroundColor: '#FACAD5' }}>
                            <Skeleton variant="text" sx={{ fontSize: '1.5rem', mb: 1 }} />
                            <Skeleton variant="text" sx={{ fontSize: '1rem', mb: 2, width: '40%' }} />

                            {/* Menu Items Skeleton */}
                            {[1, 2, 3, 4].map((item) => (
                                <Box key={item} sx={{ mb: 2 }}>
                                    <Skeleton variant="text" sx={{ mb: 0.5 }} />
                                    <Skeleton variant="text" sx={{ width: '70%', fontSize: '0.9rem' }} />
                                </Box>
                            ))}
                        </Paper>
                    ))}
                </Box>
            </Box>
        </Container>
    );
}