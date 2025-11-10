'use client';

import { useMemo, useEffect, useCallback, useState } from 'react';

import { useSecurity } from '../../hooks/useSecurity';

import Grid from '@mui/material/Grid';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Accordion from '@mui/material/Accordion';
import Box from '@mui/material/Box';

import { Iconify } from 'src/components/iconify';

// Enum values (what you store) and display labels (UI only)
const RICE_ENUMS = ['WHITE', 'BROWN', 'NO_PREF'];
const RICE_LABEL_MAP = {
  WHITE: 'All White Rice',
  BROWN: 'All Brown Rice',
  NO_PREF: 'No Preference',
};
const RICE_LABELS = Object.values(RICE_LABEL_MAP);

export function ProductSpecialRequestForm({ onRequestChange, onOptionsChange, value }) {

  const { sanitizers } = useSecurity();

  const [options, setOptions] = useState([]); // [{id,label}]
  const [selected, setSelected] = useState(new Map()); // id -> bool
  const [note, setNote] = useState('');
  const [expanded, setExpanded] = useState(false);

  // Enum-driven rice option (default NO_PREF)
  const [riceOption, setRiceOption] = useState('NO_PREF');

  useEffect(() => {
    let active = true;
    fetch('/api/special-requests')
      .then((r) => r.json())
      .then((rows) => {
        const normalized = (rows || []).map((o) => ({
          id: Number(o.id),
          value: o.value,   // e.g.: "no-pig-trotter"
          label: o.label,   // e.g.: "Pig Trotter"
        }));

        const nonRice = normalized.filter(o => !RICE_LABELS.includes(o.label));

        if (active) {
          setOptions(nonRice);
          onOptionsChange?.(nonRice);
        }
      });
    return () => {
      active = false;
    };
  }, [onOptionsChange]);

  // Emit in the exact backend shape your /requests route expects
  // Update the useEffect that emits data (around line 63)
  useEffect(() => {
    const requests = [...selected.entries()]
      .filter(([, v]) => v === true)
      .map(([id]) => ({
        specialRequestId: Number(id),
        value: true,
      }));

    // Note is already sanitized when set, so it's safe to emit
    onRequestChange?.({ requests, note, riceOption });
  }, [selected, note, riceOption, onRequestChange]);

  // Memoize expensive calculations
  const hasRequests = useMemo(
    () => [...selected.values()].some(Boolean) || note.trim().length > 0 || riceOption !== 'NO_PREF',
    [selected, note, riceOption]
  );

  const countSelected = useMemo(() => {
    const presets = [...selected.values()].filter(Boolean).length;
    const n = presets + (note.trim() ? 1 : 0) + (riceOption !== 'NO_PREF' ? 1 : 0);
    return n;
  }, [selected, note, riceOption]);

  const toggle = useCallback((id) => {
    id = Number(id);
    setSelected((prev) => {
      const next = new Map(prev);
      const cur = !!next.get(id);
      next.set(id, !cur);

      // Optional UX: client-side mutex for ids 10/11 to mirror server rule
      if ((id === 10 && !cur) || (id === 11 && !cur)) {
        const other = id === 10 ? 11 : 10;
        next.set(other, false);
      }
      return next;
    });
  }, []);

  return (
    <Box
      sx={{
        mt: 2,
        borderTop: '5px solid #F27C96',
        borderRadius: '4px 4px 0px 0px',
        boxShadow: 2,
      }}
    >
      <Accordion
        expanded={expanded}
        onChange={(_, isExpanded) => setExpanded(isExpanded)}
        sx={{
          '&:before': {
            display: 'none',
          },
        }}
      >
        <AccordionSummary
          expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
        //   sx={{
        //     py: 0.5,
        //     '& .MuiAccordionSummary-content': {
        //       alignItems: 'center',
        //     },
        //   }}
        >
          <Typography variant="h6" sx={{ ml: 1 }}>
            Special Requests {hasRequests ? `(${countSelected})` : ''}
            {/* Special Requests{' '}
            {hasRequests && `(${presetRequests.length + (customRequests.trim() ? 1 : 0)})`} */}
          </Typography>
        </AccordionSummary>

        <AccordionDetails sx={{ pt: 0, pb: 3, px: 3 }}>
          {/* Dynamic Checkboxes from DB*/}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="subtitle2"
              gutterBottom
              sx={{ mb: 2, color: 'primary.darker', pl: 0 }}
            >
              Exclude the Following:
            </Typography>

            <Box sx={{ pl: 0 }}>
              <Grid container spacing={1}>
                {options.map((o) => (
                  <Grid item xs={12} sm={4} key={o.id}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          checked={!!selected.get(o.id)}
                          onChange={() => toggle(o.id)}
                        />
                      }
                      label={<Typography variant="body2">{o.label}</Typography>}
                      sx={{ width: '100%', m: 0, p: 0 }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>

          {/* Rice Option (enum-driven, separate from checkboxes) */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom sx={{ mb: 2, color: 'primary.darker', pl: 0 }}>
              Rice Option:
            </Typography>
            <RadioGroup
              row
              value={riceOption}
              onChange={(e) => setRiceOption(e.target.value)} // 'WHITE' | 'BROWN' | 'NO_PREF'
            >
              {RICE_ENUMS.map((v) => (
                <FormControlLabel key={v} value={v} control={<Radio />} label={RICE_LABEL_MAP[v]} />
              ))}
            </RadioGroup>
          </Box>

          {/* Note field */}
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Notes:
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Enter any additional special requests here..."
              value={note}
              onChange={(e) => {
                // Sanitize the input before setting state
                const sanitizedValue = sanitizers.note(e.target.value);
                setNote(sanitizedValue);
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'grey.300' },
                  '&:hover fieldset': { borderColor: 'primary.main' },
                  '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                },
              }}
            />
            {note && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Character count: {note.length}/{sanitizers.config?.INPUT_LIMITS?.NOTE_MAX_LENGTH || 200}
              </Typography>
            )}
          </Box>

          {/* Custom Notes
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
          )} */}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}

// // Separate component to prevent unnecessary re-renders
// const PresetRequestCheckbox = ({ request, checked, onChange }) => {
//   const handleChange = useCallback(() => {
//     onChange(request.value);
//   }, [onChange, request.value]);

//   return (
//     <FormControlLabel
//       control={
//         <Checkbox checked={checked} onChange={handleChange} size="small" value={request.value} />
//       }
//       label={<Typography variant="body2">{request.label}</Typography>}
//       sx={{
//         width: '100%',
//         m: 0,
//         p: 0,
//         '& .MuiFormControlLabel-label': {
//           fontSize: '0.875rem',
//         },
//       }}
//     />
//   );
// };
