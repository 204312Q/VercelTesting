'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Accordion from '@mui/material/Accordion';
import Typography from '@mui/material/Typography';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function FaqsList({ contents }) {
  const [expandedCategory, setExpandedCategory] = useState(false);
  const [expandedQuestion, setExpandedQuestion] = useState(false);

  const handleCategoryChange = (panel) => (event, isExpanded) => {
    setExpandedCategory(isExpanded ? panel : false);
    // Close any open questions when category changes
    if (!isExpanded) {
      setExpandedQuestion(false);
    }
  };

  const handleQuestionChange = (panel) => (event, isExpanded) => {
    setExpandedQuestion(isExpanded ? panel : false);
  };

  return (
    <Box sx={{ mt: 5 }}>
      {contents.map((category) => (
        <Accordion
          key={category.id}
          expanded={expandedCategory === `category-${category.id}`}
          onChange={handleCategoryChange(`category-${category.id}`)}
          sx={{
            mb: 2,
            '&:before': { display: 'none' },
            boxShadow: 2,
            borderRadius: 1,
            '&.Mui-expanded': {
              boxShadow: 3,
            },
          }}
        >
          <AccordionSummary
            expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
            sx={{
              px: 3,
              py: 1,
              minHeight: 30,
              backgroundColor: 'primary.lighter',
              color: 'black',
              borderRadius: 1,
              '&.Mui-expanded': {
                minHeight: 64,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
              },
              '& .MuiAccordionSummary-expandIconWrapper': {
                color: 'black',
              },
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {category.category}
            </Typography>
          </AccordionSummary>

          <AccordionDetails sx={{ p: 0 }}>
            {/* Questions in this category */}
            <Box sx={{ p: 2 }}>
              {category.questions.map((question) => (
                <Accordion
                  key={question.id}
                  expanded={expandedQuestion === question.value}
                  onChange={handleQuestionChange(question.value)}
                  sx={{
                    mb: 1,
                    '&:before': { display: 'none' },
                    boxShadow: 1,
                    borderRadius: 1,
                    '&.Mui-expanded': {
                      boxShadow: 2,
                    },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
                    sx={{
                      px: 2,
                      py: 1,
                      minHeight: 56,
                      '&.Mui-expanded': {
                        minHeight: 56,
                      },
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                      {question.heading}
                    </Typography>
                  </AccordionSummary>

                  <AccordionDetails sx={{ px: 2, py: 3 }}>
                    <Typography
                      variant="body1"
                      sx={{
                        color: 'text.secondary',
                        lineHeight: 1.6,
                        whiteSpace: 'pre-line',
                        '& a': {
                          color: 'primary.main',
                          textDecoration: 'none',
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        },
                      }}
                      dangerouslySetInnerHTML={{ __html: question.detail }}
                    />
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}