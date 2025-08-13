import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SOURCE_DIR = './src/assets/VideoGameAssets';
const OUTPUT_DIR = './src/assets/VideoGameAssets';

// Cover images to compress
const COVER_IMAGES = [
  'MaestroCover.png',
  'PaparazziEscapeCover.png', 
  'BusyGirlCover.png'
];

// Target size for video game tile covers (preserve 16:9 aspect ratio)
const TARGET_SIZE = { width: 300, height: 169 };

// Also create smaller versions for the video game pages
const PAGE_COVER_SIZE = { width: 350, height: 197 };

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

// Create optimized page cover images for faster loading
async function createPageCoverImage(sourceFileName, quality = 85) {
  const sourcePath = path.join(SOURCE_DIR, sourceFileName);
  const baseName = path.parse(sourceFileName).name;
  const outputPath = path.join(OUTPUT_DIR, `${baseName}-page-cover.webp`);
  
  if (!fs.existsSync(sourcePath)) {
    console.log(`⚠️ Source file not found: ${sourceFileName}`);
    return false;
  }
  
  try {
    await sharp(sourcePath)
      .resize(PAGE_COVER_SIZE.width, PAGE_COVER_SIZE.height, {
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
    
    console.log(`✓ Page Cover: ${sourceFileName} → ${baseName}-page-cover.webp`);
    console.log(`  Size: ${(originalSize / 1024).toFixed(1)} KB → ${(compressedSize / 1024).toFixed(1)} KB (${compressionRatio}% reduction)`);
    
    return { 
      path: outputPath, 
      originalSize, 
      compressedSize, 
      compressionRatio,
      fileName: `${baseName}-page-cover.webp`
    };
  } catch (error) {
    console.error(`✗ Failed to create page cover for ${sourceFileName}:`, error.message);
    return false;
  }
}

// Main function
async function main() {
  console.log('🖼️ Compressing Video Game Cover Images...\n');
  
  const results = [];
  const pageResults = [];
  
  for (const coverImage of COVER_IMAGES) {
    console.log(`\n📱 Processing: ${coverImage}`);
    
    // Create tile cover (small, high quality)
    const result = await compressCoverImage(coverImage, 98);
    if (result) {
      results.push(result);
    }
    
    // Create page cover (medium size, optimized for speed)
    const pageResult = await createPageCoverImage(coverImage, 85);
    if (pageResult) {
      pageResults.push(pageResult);
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
  
  pageResults.forEach(result => {
    console.log(`   ${result.fileName}: ${(result.originalSize / 1024).toFixed(1)} KB → ${(result.compressedSize / 1024).toFixed(1)} KB (${result.compressionRatio}% reduction)`);
  });
  
  const totalCompressionRatio = ((totalOriginalSize - totalCompressedSize) / totalOriginalSize * 100).toFixed(1);
  console.log(`\n💾 Total: ${(totalOriginalSize / 1024).toFixed(1)} KB → ${(totalCompressedSize / 1024).toFixed(1)} KB (${totalCompressionRatio}% reduction)`);
  
  console.log(`\n✅ All video game covers compressed successfully!`);
  console.log(`💡 Next steps: Update VideoGamePage.jsx to use page-cover images`);
}

// Run the script
main().catch(console.error); 