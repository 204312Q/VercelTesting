import { MainLayout } from 'src/layouts/main';
import { ProductOrderProvider } from 'src/sections/product/context';

// ----------------------------------------------------------------------

export default function Layout({ children }) {
  return (
    <MainLayout>
      <ProductOrderProvider>
        {children}
      </ProductOrderProvider>
    </MainLayout>
  );
}
