import { initializeDatabase } from '../db/database.js';
import { generateAllMaterials } from '../services/generator.js';

initializeDatabase();

console.log('📝 Running materials generator...\n');

generateAllMaterials(7)
  .then(result => {
    console.log('\n✅ Generation complete!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Generation failed:', error.message);
    process.exit(1);
  });
