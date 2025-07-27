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

// Display sizes from CSS (desktop: 450x600, tablet: 350x450, mobile: 200x260)
const SIZES = {
  desktop: { width: 450, height: 600 },
  tablet: { width: 350, height: 450 },
  mobile: { width: 200, height: 260 }
};

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Compress image with specific dimensions
async function compressImage(size, quality) {
  const sourcePath = path.join(SOURCE_DIR, 'ComputerSelfe.png');
  const outputPath = path.join(OUTPUT_DIR, `ComputerSelfe-${size.width}x${size.height}.webp`);
  
  if (!fs.existsSync(sourcePath)) {
    console.log(`⚠️ Source file not found: ComputerSelfe.png`);
    return false;
  }
  
  try {
    await sharp(sourcePath)
      .resize(size.width, size.height, {
        fit: 'cover',
        position: 'center'
      })
      .webp({ 
        quality: quality,
        lossless: false,
        nearLossless: false,
        smartSubsample: true
      })
      .toFile(outputPath);
    
    const compressedSize = fs.statSync(outputPath).size;
    console.log(`✓ Compressed: ${size.width}x${size.height} (${quality}% quality) → ${(compressedSize / 1024).toFixed(1)} KB`);
    
    return { path: outputPath, size: compressedSize };
  } catch (error) {
    console.error(`✗ Failed to compress ${size.width}x${size.height}:`, error.message);
    return false;
  }
}

// Main function
async function main() {
  console.log('🖼️ Aggressively compressing About image...\n');
  
  const qualities = [80, 70, 60]; // Test different quality levels
  const results = [];
  
  for (const [device, size] of Object.entries(SIZES)) {
    console.log(`\n📱 Processing ${device} size (${size.width}x${size.height}):`);
    
    for (const quality of qualities) {
      const result = await compressImage(size, quality);
      if (result) {
        results.push({
          device,
          size: `${size.width}x${size.height}`,
          quality,
          fileSize: result.size,
          path: result.path
        });
      }
    }
  }
  
  console.log(`\n📊 Summary:`);
  results.forEach(result => {
    console.log(`   ${result.device} (${result.size}, ${result.quality}%): ${(result.fileSize / 1024).toFixed(1)} KB`);
  });
  
  // Recommend the best option (smallest file with acceptable quality)
  const bestOption = results.reduce((best, current) => 
    current.fileSize < best.fileSize ? current : best
  );
  
  console.log(`\n💡 Recommended: ${bestOption.device} size with ${bestOption.quality}% quality`);
  console.log(`   File: ${bestOption.path}`);
  console.log(`   Size: ${(bestOption.fileSize / 1024).toFixed(1)} KB`);
  
  console.log(`\n💡 Next steps:`);
  console.log(`1. Update About.jsx to use the recommended file`);
  console.log(`2. Consider implementing responsive images with srcset`);
  console.log(`3. Add lazy loading to the image`);
}

// Run the script
main().catch(console.error); 