import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';

function OrderAddonAssignment({ orderId }) {
    const router = useRouter();
    const addons = ['Pig’s Trotter', 'Milk Fish Soup', 'Bird Nest'];

    const handleAssign = (addon) => {
        const addonSlug = encodeURIComponent(addon);
        router.push(`/dashboard/order/${orderId}/addon/${addonSlug}/assign`);
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Assign the Add Ons:
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
                {addons.map((addon, idx) => (
                    <Button
                        key={idx}
                        variant="outlined"
                        sx={{ fontWeight: 700, borderRadius: 2, minWidth: 120 }}
                        onClick={() => handleAssign(addon)}
                    >
                        {addon}
                    </Button>
                ))}
            </Box>
        </Box>
    );
}

export default OrderAddonAssignment;