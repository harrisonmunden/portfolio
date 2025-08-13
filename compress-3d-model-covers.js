import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SOURCE_DIR = './src/assets/3DModels';
const OUTPUT_DIR = './src/assets/3DModels';

// Cover images to compress
const COVER_IMAGES = [
  'CarCover.png',
  'FlowersCover.png', 
  'MotorcycleCover.png',
  'PurseCover.png'
];

// Target size for model tile covers (preserve 16:9 aspect ratio)
const TARGET_SIZE = { width: 300, height: 169 };

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Compress cover image with specific dimensions and quality
async function compressCoverImage(sourceFileName, quality = 98) {
  const sourcePath = path.join(SOURCE_DIR, sourceFileName);
  const baseName = path.parse(sourceFileName).name;
  const outputPath = path.join(OUTPUT_DIR, `${baseName}-compressed.webp`);
  
  if (!fs.existsSync(sourcePath)) {
    console.log(`⚠️ Source file not found: ${sourceFileName}`);
    return false;
  }
  
  try {
    await sharp(sourcePath)
      .resize(TARGET_SIZE.width, TARGET_SIZE.height, {
        fit: 'inside',
        position: 'center'
      })
      .webp({ 
        quality: quality,
        lossless: false,
        nearLossless: false,
        smartSubsample: true
      })
      .toFile(outputPath);
    
    const originalSize = fs.statSync(sourcePath).size;
    const compressedSize = fs.statSync(outputPath).size;
    const compressionRatio = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
    
    console.log(`✓ Compressed: ${sourceFileName} → ${baseName}-compressed.webp`);
    console.log(`  Size: ${(originalSize / 1024).toFixed(1)} KB → ${(compressedSize / 1024).toFixed(1)} KB (${compressionRatio}% reduction)`);
    
    return { 
      path: outputPath, 
      originalSize, 
      compressedSize, 
      compressionRatio,
      fileName: `${baseName}-compressed.webp`
    };
  } catch (error) {
    console.error(`✗ Failed to compress ${sourceFileName}:`, error.message);
    return false;
  }
}

// Main function
async function main() {
  console.log('🖼️ Compressing 3D Model Cover Images...\n');
  
  const results = [];
  
  for (const coverImage of COVER_IMAGES) {
    console.log(`\n📱 Processing: ${coverImage}`);
    const result = await compressCoverImage(coverImage, 98);
    if (result) {
      results.push(result);
    }
  }
  
  console.log(`\n📊 Summary:`);
  let totalOriginalSize = 0;
  let totalCompressedSize = 0;
  
  results.forEach(result => {
    totalOriginalSize += result.originalSize;
    totalCompressedSize += result.compressedSize;
    console.log(`   ${result.fileName}: ${(result.originalSize / 1024).toFixed(1)} KB → ${(result.compressedSize / 1024).toFixed(1)} KB (${result.compressionRatio}% reduction)`);
  });
  
  const totalCompressionRatio = ((totalOriginalSize - totalCompressedSize) / totalOriginalSize * 100).toFixed(1);
  console.log(`\n💾 Total: ${(totalOriginalSize / 1024).toFixed(1)} KB → ${(totalCompressedSize / 1024).toFixed(1)} KB (${totalCompressionRatio}% reduction)`);
  
  console.log(`\n✅ All 3D model covers compressed successfully!`);
  console.log(`💡 Next steps: Update Works.jsx to use these compressed covers`);
}

// Run the script
main().catch(console.error); 