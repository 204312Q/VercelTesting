import seedBanner from './seedBanner.js';
import seedProduct from './seedProduct.js';
import seedSpecialRequest from './seedSpecialRequest.js';
import seedPromo from './seedPromo.js';

async function main() {
  await seedBanner();
  await seedProduct();
  await seedSpecialRequest();
  await seedPromo(); 
}

main()
  .then(() => {
    console.log('✅ All seeds completed.');
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
