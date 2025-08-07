'use client';

import { createContext, useContext } from 'react';

// ----------------------------------------------------------------------

export const ProductOrderContext = createContext({});

export const useProductOrderContext = () => {
  const context = useContext(ProductOrderContext);

  if (!context) {
    throw new Error('useProductOrderContext must be used within a ProductOrderProvider');
  }

  return context;
};
