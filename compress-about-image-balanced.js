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

// Display sizes from CSS (desktop: 600x800, tablet: 450x600, mobile: 250x330)
const SIZES = {
  desktop: { width: 600, height: 800 },
  tablet: { width: 450, height: 600 },
  mobile: { width: 250, height: 330 }
};

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Compress image with specific dimensions and quality
async function compressImage(size, quality) {
  const sourcePath = path.join(SOURCE_DIR, 'ComputerSelfe.png');
  const outputPath = path.join(OUTPUT_DIR, `ComputerSelfe-${size.width}x${size.height}-q${quality}.webp`);
  
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
    
    return { path: outputPath, size: compressedSize, quality };
  } catch (error) {
    console.error(`✗ Failed to compress ${size.width}x${size.height}:`, error.message);
    return false;
  }
}

// Main function
async function main() {
  console.log('🖼️ Creating balanced compression for About image...\n');
  
  const qualities = [95, 90, 85]; // Higher quality levels
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
  
  // Recommend a balanced option (good quality, reasonable size)
  const balancedOption = results.find(r => r.quality === 90 && r.device === 'desktop') || 
                        results.find(r => r.quality === 95 && r.device === 'desktop') ||
                        results[0];
  
  console.log(`\n💡 Recommended balanced option:`);
  console.log(`   File: ${balancedOption.path}`);
  console.log(`   Size: ${(balancedOption.fileSize / 1024).toFixed(1)} KB`);
  console.log(`   Quality: ${balancedOption.quality}%`);
  console.log(`   Device: ${balancedOption.device}`);
  
  console.log(`\n💡 Next steps:`);
  console.log(`1. Update About.jsx to use the balanced file`);
  console.log(`2. Test the visual quality`);
  console.log(`3. If still too compressed, try the 90% quality version`);
}

// Run the script
main().catch(console.error); 