'use client';

import { useState, useEffect } from "react";
import { format, parseISO, addDays } from "date-fns";
import { Box, Typography, Button, Paper, Divider } from "@mui/material";
import { recoveryMenuPool, nourishMenuPool } from "src/_mock/_menu";
import { getMenuIndexesForDate } from "../../components/menu/getMenuIndexesForDate";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { paths } from 'src/routes/paths';

const BASE_DATE = parseISO("2025-01-01");

export default function MenuPage() {
    const [startDate, setStartDate] = useState(new Date());
    const [startDateStr, setStartDateStr] = useState(format(new Date(), "yyyy-MM-dd"));
    const [selectedWeek, setSelectedWeek] = useState(1);
    const [weekDays, setWeekDays] = useState([]);
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedDayByWeek, setSelectedDayByWeek] = useState({});
    const [menu, setMenu] = useState({ lunchDishes: [], dinnerDishes: [] });

    // Helper to get the date start
    const getActualWeekStart = (baseDate, weekIndex) => addDays(baseDate, (weekIndex - 1) * 7);

    useEffect(() => {
        setSelectedWeek(1);
    }, []);

    useEffect(() => {
        const parsedStartDate = parseISO(startDateStr);
        const baseWeekStart = getActualWeekStart(parsedStartDate, selectedWeek);

        const rotatedWeek = [];
        let currentDate = baseWeekStart;

        for (let i = 0; i < 7; i++) {
            rotatedWeek.push({
                day: format(currentDate, "EEEE"),
                date: format(currentDate, "dd/MM/yyyy"),
                rawDate: currentDate
            });
            currentDate = addDays(currentDate, 1);
        }

        setWeekDays(rotatedWeek);

        if (selectedDayByWeek[selectedWeek]) {
            setSelectedDay(selectedDayByWeek[selectedWeek]);
        } else {
            const firstDay = rotatedWeek[0];
            setSelectedDay(firstDay);
            setSelectedDayByWeek((prev) => ({
                ...prev,
                [selectedWeek]: firstDay,
            }));
        }
    }, [startDate, selectedWeek, selectedDayByWeek, startDateStr]);

    useEffect(() => {
        if (!selectedDay) return;
        const { recoveryIndex, nourishIndex } = getMenuIndexesForDate(selectedDay.rawDate, []);
        const isRecoveryWeek = selectedWeek === 1;

        const selectedMenu = isRecoveryWeek
            ? recoveryMenuPool[recoveryIndex] ?? { lunchDishes: [], dinnerDishes: [] }
            : nourishMenuPool[nourishIndex] ?? { lunchDishes: [], dinnerDishes: [] };

        setMenu(selectedMenu);
    }, [selectedDay, selectedWeek, startDate]);

    return (
        <>
            <Box sx={{ mb: 4, p: 3, maxWidth: '48rem', mx: 'auto', bgcolor: 'white', boxShadow: 3, borderRadius: 2, border: '1px solid', borderColor: 'grey.200', textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 6, color: '#f27b96' }}>
                    Select Your Meal Start Date
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            label="Select Start Date"
                            value={startDate}
                            onChange={(newValue) => {
                                if (!newValue) return;
                                setStartDate(newValue);
                                setStartDateStr(format(newValue, "yyyy-MM-dd"));
                                setSelectedWeek(1);
                                setSelectedDayByWeek({});
                            }}
                            format="dd/MM/yyyy"
                            slotProps={{
                                textField: {
                                    size: "medium",
                                    sx: { width: 256 },
                                },
                            }}
                        />
                    </LocalizationProvider>
                </Box>

                {/* Week Selection Buttons */}
                <Box sx={{ display: 'flex', gap: { xs: 0.5, md: 1 }, justifyContent: 'center', flexWrap: 'wrap', mb: 2 }}>
                    {[1, 2, 3, 4].map((week) => (
                        <Button
                            key={week}
                            variant={selectedWeek === week ? "contained" : "outlined"}
                            onClick={() => setSelectedWeek(week)}
                            sx={{
                                flex: { xs: '1 0 48%', sm: '1 0 22%' }, // 2 per row on mobile, 4 on larger screens
                                display: 'flex',
                                flexDirection: 'column',
                                py: { xs: 1.5, md: 2.5 },
                                px: { xs: 1, md: 2 },
                                fontWeight: 'bold',
                                minWidth: { xs: 140, md: 100 }, // Adjust minimum width for mobile
                                minHeight: { xs: 60, md: 70 },
                                maxWidth: { xs: 160, md: 'none' }, // Prevent buttons from getting too wide on mobile
                                backgroundColor: selectedWeek === week
                                    ? (week === 1 ? '#f27b96' : '#3e4f8b')
                                    : 'white',
                                color: selectedWeek === week
                                    ? '#fff'
                                    : (week === 1 ? '#f27b96' : '#3e4f8b'),
                                borderColor: week === 1 ? '#f27b96' : '#3e4f8b',
                                borderWidth: 2,
                                borderRadius: 2,
                                boxShadow: selectedWeek === week ? 3 : 1,
                                '&:hover': {
                                    backgroundColor: selectedWeek === week
                                        ? (week === 1 ? '#e26782' : '#2a3a6b')
                                        : (week === 1 ? '#fce9ed' : '#e3f2fd'),
                                    boxShadow: 2,
                                    transform: 'translateY(-1px)',
                                },
                                transition: 'all 0.2s ease-in-out',
                            }}
                        >
                            <span style={{ fontSize: '1rem', marginBottom: '2px' }}>Week {week}</span>
                            <span style={{ fontSize: '0.7rem', opacity: 0.9, fontWeight: 500 }}>
                                {week === 1 ? "Recovery" : "Nourish"}
                            </span>
                        </Button>
                    ))}
                </Box>
                {/* Day Selection Buttons */}
                <Box sx={{ display: 'flex', gap: { xs: 0.3, md: 1 }, justifyContent: 'center', flexWrap: 'nowrap', mb: 6 }}>
                    {weekDays.map((item) => (
                        <Button
                            key={item.date}
                            variant={selectedDay?.date === item.date ? "contained" : "outlined"}
                            onClick={() => {
                                setSelectedDay(item);
                                setSelectedDayByWeek((prev) => ({
                                    ...prev,
                                    [selectedWeek]: item,
                                }));
                            }}
                            sx={{
                                flex: '1', // Equal flex for all buttons
                                display: 'flex',
                                flexDirection: 'column',
                                py: { xs: 1, md: 1.5 },
                                px: { xs: 0.3, md: 1 }, // Reduced padding on mobile
                                minWidth: { xs: 40, md: 80 }, // Smaller minimum width on mobile
                                maxWidth: { xs: 50, md: 'none' }, // Add max width to prevent overflow
                                minHeight: { xs: 50, md: 65 },
                                backgroundColor: selectedDay?.date === item.date
                                    ? (selectedWeek === 1 ? '#f27b96' : '#3e4f8b')
                                    : 'white',
                                color: selectedDay?.date === item.date
                                    ? '#fff'
                                    : (selectedWeek === 1 ? '#f27b96' : '#3e4f8b'),
                                borderColor: selectedWeek === 1 ? '#f27b96' : '#3e4f8b',
                                borderWidth: 2,
                                borderRadius: 2,
                                boxShadow: selectedDay?.date === item.date ? 2 : 0.5,
                                '&:hover': {
                                    backgroundColor: selectedDay?.date === item.date
                                        ? (selectedWeek === 1 ? '#e26782' : '#2a3a6b')
                                        : (selectedWeek === 1 ? '#fce9ed' : '#e3f2fd'),
                                    transform: 'translateY(-1px)',
                                    boxShadow: 1,
                                },
                                transition: 'all 0.2s ease-in-out',
                            }}
                        >
                            <Typography
                                sx={{
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    fontSize: { xs: '0.6rem', md: '0.9rem' }, // Smaller font on mobile
                                    mb: 0.25,
                                    color: 'inherit'
                                }}
                            >
                                {item.day.slice(0, 3)}
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: { xs: '0.5rem', md: '0.75rem' }, // Smaller font on mobile
                                    fontWeight: 500,
                                    color: 'inherit'
                                }}
                            >
                                {item.date.split('/').slice(0, 2).join('/')}
                            </Typography>
                        </Button>
                    ))}
                </Box>
                {selectedDay && (
                    <>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: 'grey.900' }}>
                            LONGAN RED DATE TEA SERVED WITH EVERY MEAL
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: ['column', 'row'], gap: 3, mt: 2 }}>
                            {["Lunch", "Dinner"].map((type) => (
                                <Paper
                                    key={type}
                                    elevation={3}
                                    sx={{
                                        flex: 1,
                                        p: 3,
                                        textAlign: 'center',
                                        backgroundColor: selectedWeek === 1 ? '#FACAD5' : '#B3D9FF' // Pink for Recovery, Blue for Nourish
                                    }}
                                >
                                    <Typography variant="h5" sx={{ fontWeight: 'extrabold', textTransform: 'uppercase', color: 'grey.900' }}>
                                        {type}
                                    </Typography>
                                    <Typography
                                        variant="subtitle1"
                                        sx={{
                                            fontWeight: 'bold',
                                            color: selectedWeek === 1 ? '#f27b96' : '#3e4f8b' // Pink text for Recovery, Blue text for Nourish
                                        }}
                                    >
                                        {type === "Lunch" ? "午餐" : "晚餐"}
                                    </Typography>
                                    <Divider sx={{ my: 2 }} />
                                    <Box sx={{ textAlign: 'left' }}>
                                        {(type === "Lunch" ? menu.lunchDishes : menu.dinnerDishes).map((dish, index) => (
                                            <Box key={index} sx={{ mb: 2 }}>
                                                <Typography
                                                    sx={{
                                                        fontWeight: 600,
                                                        color: 'grey.900',
                                                        lineHeight: 1.4,
                                                        wordBreak: 'break-word', // Prevent overflow
                                                        hyphens: 'auto' // Allow hyphenation
                                                    }}
                                                >
                                                    {typeof dish.english === 'string'
                                                        ? dish.english.replace(/[\u4e00-\u9fff]/g, '').trim() // Remove any Chinese characters
                                                        : dish.english || 'N/A'
                                                    }
                                                </Typography>
                                                <Typography
                                                    sx={{
                                                        color: 'grey.700',
                                                        lineHeight: 1.4,
                                                        wordBreak: 'break-word',
                                                        fontSize: '0.95rem'
                                                    }}
                                                >
                                                    {typeof dish.chinese === 'string'
                                                        ? dish.chinese.replace(/[a-zA-Z]/g, '').trim() // Remove any English characters
                                                        : dish.chinese || 'N/A'
                                                    }
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                </Paper>
                            ))}
                        </Box>

                    </>
                )}
            </Box>
            <Box
                sx={{
                    px: { xs: 2, md: 10 },
                    textAlign: 'center',
                    borderRadius: 3,
                    mb: 6,
                }}
            >
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    href={paths.product.root}
                    component="a"
                    sx={{ minWidth: 240 }}
                >
                    Order Now
                </Button>
            </Box>
        </>
    );
}