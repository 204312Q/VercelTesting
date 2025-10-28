import React, { useState } from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Iconify } from 'src/components/iconify';

function OrderSpecialRequest({ special_requests = [], special_request_notes = '', onUpdate }) {
    const [editing, setEditing] = useState(false);
    const [notes, setNotes] = useState(special_request_notes);
    const [presets, setPresets] = useState(special_requests);

    const handleEdit = () => setEditing(true);
    const handleCancel = () => {
        setNotes(special_request_notes);
        setPresets(special_requests);
        setEditing(false);
    };
    const handleSave = () => {
        if (onUpdate) onUpdate({ special_requests: presets, special_request_notes: notes });
        setEditing(false);
    };

    return (
        <Card sx={{ p: 3, position: 'relative' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Special Requests</Typography>
                {!editing && (
                    <IconButton onClick={handleEdit}>
                        <Iconify icon="solar:pen-bold" />
                    </IconButton>
                )}
            </Box>
            {editing ? (
                <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Preset Requests</Typography>
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            fullWidth
                            multiline
                            rows={presets.length || 1}
                            value={presets.join('\n')}
                            onChange={e => setPresets(e.target.value.split('\n').filter(Boolean))}
                            placeholder="Enter preset requests, one per line"
                        />
                    </Box>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Additional Notes</Typography>
                    <Box sx={{ mb: 2 }}>
                        <TextField
                            fullWidth
                            multiline
                            rows={2}
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            placeholder="Enter any additional notes"
                        />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button variant="contained" size="small" onClick={handleSave}>Save</Button>
                        <Button size="small" onClick={handleCancel}>Cancel</Button>
                    </Box>
                </Box>
            ) : (
                <Box>
                    <ul style={{ margin: 0, paddingLeft: 20 }}>
                        {presets.map((req, idx) => (
                            <li key={idx}>
                                <Typography variant="body2">{req}</Typography>
                            </li>
                        ))}
                        {notes && (
                            <li>
                                <Typography variant="body2">
                                    Additional Notes: {notes}
                                </Typography>
                            </li>
                        )}
                    </ul>
                </Box>
            )}
        </Card>
    );
}

export default OrderSpecialRequest;