import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SOURCE_DIR = './src/assets/AboutAssets';
const OUTPUT_DIR = './src/assets/AboutAssets';
const QUALITY = 85; // Slightly lower quality for better compression

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`Created output directory: ${OUTPUT_DIR}`);
}

// Compress the about image
async function compressAboutImage() {
  const sourcePath = path.join(SOURCE_DIR, 'ComputerSelfe.png');
  const outputPath = path.join(OUTPUT_DIR, 'ComputerSelfe.webp');
  
  if (!fs.existsSync(sourcePath)) {
    console.log(`⚠️ Source file not found: ComputerSelfe.png`);
    return false;
  }
  
  try {
    await sharp(sourcePath)
      .webp({ 
        quality: QUALITY,
        lossless: false,
        nearLossless: false,
        smartSubsample: true
      })
      .toFile(outputPath);
    
    console.log(`✓ Compressed: ComputerSelfe.png → ComputerSelfe.webp`);
    
    // Get file sizes for comparison
    const originalSize = fs.statSync(sourcePath).size;
    const compressedSize = fs.statSync(outputPath).size;
    const compressionRatio = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
    
    console.log(`📊 File sizes:`);
    console.log(`   Original: ${(originalSize / 1024).toFixed(1)} KB`);
    console.log(`   Compressed: ${(compressedSize / 1024).toFixed(1)} KB`);
    console.log(`   Compression: ${compressionRatio}% smaller`);
    
    return true;
  } catch (error) {
    console.error(`✗ Failed to compress ComputerSelfe.png:`, error.message);
    return false;
  }
}

// Main function
async function main() {
  console.log('🖼️ Compressing About image to WebP format...\n');
  
  const success = await compressAboutImage();
  
  if (success) {
    console.log(`\n💡 Next steps:`);
    console.log(`1. Update the image path in About.jsx to use ComputerSelfe.webp`);
    console.log(`2. Test the performance improvement!`);
  }
}

// Run the script
main().catch(console.error); 