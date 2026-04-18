// Load environment variables from the correct path
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const Product = require('../models/Product');

async function generateSlugs() {
  try {
    // Check if MONGODB_URI exists
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI not found in .env file');
      console.log('💡 Make sure you have a .env file in the backend directory');
      console.log('💡 It should contain: MONGODB_URI=your_mongodb_connection_string');
      process.exit(1);
    }

    console.log('📦 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const products = await Product.find({});
    console.log(`📊 Found ${products.length} products\n`);

    if (products.length === 0) {
      console.log('⚠️  No products found in database');
      process.exit(0);
    }

    let generated = 0;
    let existing = 0;

    for (const product of products) {
      if (!product.slug) {
        await product.save(); // This triggers the pre-save hook to generate slug
        console.log(`✅ Generated slug for: ${product.name} → ${product.slug}`);
        generated++;
      } else {
        console.log(`ℹ️  Slug already exists: ${product.name} → ${product.slug}`);
        existing++;
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('✅ Slug generation complete!');
    console.log('='.repeat(50));
    console.log(`📊 Summary:`);
    console.log(`   - New slugs generated: ${generated}`);
    console.log(`   - Already had slugs: ${existing}`);
    console.log(`   - Total products: ${products.length}`);
    console.log('='.repeat(50) + '\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Check if MongoDB is running');
    console.error('   2. Verify MONGODB_URI in .env file');
    console.error('   3. Make sure .env is in the backend directory');
    process.exit(1);
  }
}

generateSlugs();
