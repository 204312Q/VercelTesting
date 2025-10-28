import { useMemo } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';


// Move static data outside component to prevent recreation
const DELIVERY_NOTES = [
    "Lunch: 10:00AM to 1:00PM",
    "Dinner: 4:00PM to 7:00PM",
];

const DELIVERY_EXCEPTIONS = [
    "Christmas Day",
    "Eve, 1st and 2nd Day of Chinese New Year"
];

const ACTIVATION_NOTES = [
    "We would need 1 working day's notice (before 2PM) on weekdays.",
    "We would need 2 working day's notice (before 2PM) on weekends.",
    "Any orders or activations after operating hours would require 2 working day's notice."
];

const TRIAL_MEAL = [
    "Pig's Trotters with Black Vinegar, Ginger and Egg",
    "Stir-Fried Spinach with Sea Cucumber topped with Wolfberries",
    "Sesame Kampung Chicken with Omelette",
    "Red Bean, Burdock Pork Rib Soup",
    "Steamed Fragrant White Rice",
    "Longan with Red Dates Tea"
];

const BMB_MEAL = [
    "28-Day Dual Meal from Chilli Padi Confinement",
    "10 Sessions of Signature 2-in-1 Postnatal Massage (TCM + Javanese) 60min"
];

const BMB_MEAL_EXTRAS = [
    "Chilli Padi Nonya Restaurant voucher (worth $50)",
    "20min Baby massage (U.P. $79)",
    "BMB Gift Voucher (worth $100, Redeem from BMB)",
];

// const POSTNATAL_MASSAGE_BENEFITS = [
//     "Relieve neck and shoulder pain from carrying and breastfeeding baby",
//     "Help to restore the uterus to its original state",
//     "Help to eliminate excess body fluids and reduces fluid retention",
//     "Help in weight loss",
//     "Increase blood circulation"
// ];

const POSTNATAL_TRANSPORT = [
    "Customer may opt for home service for single sessions or first-trial sessions with a top-up of $50 for the transportation fee",
    "**With the exception of Sentosa"
];

const QUEEN_PREMIER_NOTES = [
    "2D1N",
    "Welcome gift from MyQueen",
    "6 Month Personal Accident Coverage*"
];

const OASIA_TNC_NOTES = [
    "3:00PM check-in, 1:00PM check-out",
    "This is a purchase of a voucher. Call +65 8028 8186 to book your slots.",
    "Please take note that this is subject to availability. Do book in advance.",
    "A separate T&C applies for the 6-month Personal Accident Coverage."
];

export function ProductNotes({ selectedCategory, selectedBundle }) {
    const categoryName = selectedCategory?.name;

    // Memoize bundle notes calculation
    const bundleNotes = useMemo(() => {
        if (!selectedBundle || selectedBundle.length === 0) {
            return null;
        }

        const bundleNames = selectedBundle.map(bundle => bundle.name?.toLowerCase());

        if (bundleNames.some(name => name?.includes('bmb') || name?.includes('massage'))) {
            return {
                title: "BMB Massage Package Includes:",
                items: [...BMB_MEAL, ...BMB_MEAL_EXTRAS],
                additionalSections: [
                    {
                        title: "Terms & Conditions:",
                        items: POSTNATAL_TRANSPORT
                    }
                ]
            };
        }

        if (bundleNames.some(name => name?.includes('queen') || name?.includes('staycay'))) {
            return {
                title: "MyQueen Staycay Package Includes:",
                items: QUEEN_PREMIER_NOTES,
                additionalSections: [
                    {
                        title: "Terms & Conditions:",
                        items: OASIA_TNC_NOTES
                    }
                ]
            };
        }

        return null;
    }, [selectedBundle]);

    // Memoize display conditions
    const displayConditions = useMemo(() => ({
        showDeliveryTimes: categoryName === "Dual Meal" || categoryName === "Single Meal" || categoryName === "Trial Meal",
        showDiscountNote: categoryName !== "Trial Meal",
        showActivationNotes: categoryName !== "Trial Meal",
        showTrialMealNotes: categoryName === "Trial Meal"
    }), [categoryName]);

    // Memoize sections to prevent re-rendering
    const trialMealSection = useMemo(() => {
        if (!displayConditions.showTrialMealNotes) return null;

        return (
            <Box sx={{ mb: 3, p: 2, backgroundColor: '#FFF5F7', borderRadius: 1, border: '1px solid #F27C96' }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold', color: '#F27C96' }}>
                    Trial Meal Package Includes:
                </Typography>
                <Box sx={{ color: 'text.secondary', '& > *': { mb: 0.5 } }}>
                    {TRIAL_MEAL.map((item, index) => (
                        <Typography key={index} variant="body2">
                            • {item}
                        </Typography>
                    ))}
                </Box>
            </Box>
        );
    }, [displayConditions.showTrialMealNotes]);

    const bundleNotesSection = useMemo(() => {
        if (!bundleNotes) return null;

        return (
            <Box sx={{ mb: 3, p: 2, backgroundColor: '#FFF5F7', borderRadius: 1, border: '1px solid #F27C96' }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold', color: '#F27C96' }}>
                    {bundleNotes.title}
                </Typography>
                <Box sx={{ color: 'text.secondary', '& > *': { mb: 0.5 } }}>
                    {bundleNotes.items.map((item, index) => (
                        <Typography key={index} variant="body2">
                            • {item}
                        </Typography>
                    ))}
                </Box>

                {bundleNotes.additionalSections?.map((section, sectionIndex) => (
                    <Box key={sectionIndex} sx={{ mt: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold', color: '#F27C96' }}>
                            {section.title}
                        </Typography>
                        <Box sx={{ color: 'text.secondary', '& > *': { mb: 0.5 } }}>
                            {section.items.map((item, index) => (
                                <Typography key={index} variant="body2">
                                    • {item}
                                </Typography>
                            ))}
                        </Box>
                    </Box>
                ))}
            </Box>
        );
    }, [bundleNotes]);

    const activationNotesSection = useMemo(() => {
        if (!displayConditions.showActivationNotes) return null;

        return (
            <>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                    For E.D.D selection/new orders/next day activation:
                </Typography>
                <Box sx={{ color: 'text.secondary', '& > *': { mb: 0 } }}>
                    {ACTIVATION_NOTES.map((note, index) => (
                        <Typography key={index} variant="body2">
                            • {note}
                        </Typography>
                    ))}
                </Box>
            </>
        );
    }, [displayConditions.showActivationNotes]);

    const deliveryTimesSection = useMemo(() => {
        if (!displayConditions.showDeliveryTimes) return null;

        return (
            <>
                <Typography variant="body2" sx={{ mb: 0.5, mt: 0.5 }}>
                    Delivery time range between:
                </Typography>
                <Box sx={{ color: 'text.secondary', '& > *': { mb: 0 } }}>
                    {DELIVERY_NOTES.map((note, index) => (
                        <Typography key={index} variant="body2">
                            • {note}
                        </Typography>
                    ))}
                </Box>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5, mt: 0.5, fontStyle: 'italic' }}>
                    For delivery to Sentosa additional $20 per trip.
                </Typography>
            </>
        );
    }, [displayConditions.showDeliveryTimes]);

    const deliveryExceptionsSection = useMemo(() => (
        <>
            <Typography variant="body2" sx={{ mb: 0.5, mt: 0.5 }}>
                Please note that there are no meal deliveries for the following days:
            </Typography>
            <Box sx={{ color: 'text.secondary', '& > *': { mb: 0 } }}>
                {DELIVERY_EXCEPTIONS.map((note, index) => (
                    <Typography key={index} variant="body2">
                        • {note}
                    </Typography>
                ))}
            </Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5, mt: 0.5, fontStyle: 'italic' }}>
                The meals will be replaced, customers would still <br />receive the full amount of Days/Meals they have paid for.
            </Typography>
        </>
    ), []);

    const discountNoteSection = useMemo(() => {
        if (!displayConditions.showDiscountNote) return null;

        return (
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5, mt: 0.5, fontStyle: 'italic' }}>
                Discounted price is only applicable for orders made at least 30 days before estimated due date.
            </Typography>
        );
    }, [displayConditions.showDiscountNote]);

    const contactSection = useMemo(() => (
        <Box sx={{
            mt: 2,
            pt: 2,
            borderTop: 1,
            borderColor: 'grey.200',
            textAlign: 'center'
        }}>
            <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
                For more information or special arrangements, please contact us at <span style={{ textDecoration: 'underline' }}>6914 9900</span>
                {' '} | email us at <a href="mailto:confinement@chillipadi.com.sg" style={{ textDecoration: 'underline' }}>confinement@chillipadi.com.sg</a> | chat with us on <a href="https://www.facebook.com/messages/t/412974612448347" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>Messenger</a>
            </Typography>
        </Box>
    ), []);

    return (
        <Card sx={{ mt: 2 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                    Important Notes
                </Typography>

                {/* Render memoized sections */}
                {trialMealSection}
                {bundleNotesSection}
                {activationNotesSection}
                {deliveryTimesSection}
                {deliveryExceptionsSection}
                {discountNoteSection}
                {contactSection}
            </CardContent>
        </Card>
    );
}