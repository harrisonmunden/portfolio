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

// Use the same technique as 3D artwork thumbnails
const THUMBNAIL_SIZE = 800;
const QUALITY = 95;

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Compress cover image with high quality, similar to 3D artwork technique
async function compressCoverImage(sourceFileName) {
  const sourcePath = path.join(SOURCE_DIR, sourceFileName);
  const baseName = path.parse(sourceFileName).name;
  const outputPath = path.join(OUTPUT_DIR, `${baseName}-compressed.webp`);
  
  try {
    const stats = fs.statSync(sourcePath);
    const originalSize = stats.size;
    
    await sharp(sourcePath)
      .resize(THUMBNAIL_SIZE, THUMBNAIL_SIZE, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: QUALITY })
      .toFile(outputPath);
    
    const compressedStats = fs.statSync(outputPath);
    const compressedSize = compressedStats.size;
    const reduction = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
    
    console.log(`✓ Compressed: ${sourceFileName} → ${baseName}-compressed.webp`);
    console.log(`  Size: ${(originalSize / 1024).toFixed(1)} KB → ${(compressedSize / 1024).toFixed(1)} KB (${reduction}% reduction)`);
    
    return {
      original: originalSize,
      compressed: compressedSize,
      reduction: reduction
    };
  } catch (error) {
    console.error(`✗ Failed to process ${sourceFileName}:`, error.message);
    return null;
  }
}

// Main function
async function main() {
  console.log('🖼️ Compressing Video Game Cover Images with High Quality...\n');
  console.log(`Using technique: ${THUMBNAIL_SIZE}px, Quality ${QUALITY}, Maintain aspect ratio\n`);
  
  const results = [];
  
  for (const coverImage of COVER_IMAGES) {
    console.log(`📱 Processing: ${coverImage}`);
    const result = await compressCoverImage(coverImage);
    if (result) {
      results.push(result);
    }
    console.log('');
  }
  
  if (results.length > 0) {
    const totalOriginal = results.reduce((sum, r) => sum + r.original, 0);
    const totalCompressed = results.reduce((sum, r) => sum + r.compressed, 0);
    const totalReduction = ((totalOriginal - totalCompressed) / totalOriginal * 100).toFixed(1);
    
    console.log('📊 Summary:');
    results.forEach(result => {
      console.log(`   ${(result.original / 1024).toFixed(1)} KB → ${(result.compressed / 1024).toFixed(1)} KB (${result.reduction}% reduction)`);
    });
    console.log(`\n💾 Total: ${(totalOriginal / 1024).toFixed(1)} KB → ${(totalCompressed / 1024).toFixed(1)} KB (${totalReduction}% reduction)`);
    console.log('\n✅ All video game covers compressed successfully!');
    console.log('💡 Next steps: Copy to public directory and test quality');
  }
}

// Run the script
main().catch(console.error); 