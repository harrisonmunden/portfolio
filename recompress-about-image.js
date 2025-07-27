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

// Clean up old compressed files
function cleanupOldFiles() {
  console.log('🧹 Cleaning up old compressed files...\n');
  
  const filesToDelete = [
    'ComputerSelfe-200x260-q80.webp',
    'ComputerSelfe-200x260-q85.webp',
    'ComputerSelfe-200x260-q90.webp',
    'ComputerSelfe-200x260-q95.webp',
    'ComputerSelfe-350x450-q80.webp',
    'ComputerSelfe-350x450-q85.webp',
    'ComputerSelfe-350x450-q90.webp',
    'ComputerSelfe-350x450-q95.webp',
    'ComputerSelfe-450x600-q80.webp',
    'ComputerSelfe-450x600-q85.webp',
    'ComputerSelfe-450x600-q90.webp',
    'ComputerSelfe-450x600-q95.webp',
    'ComputerSelfe-200x260.webp',
    'ComputerSelfe-350x450.webp',
    'ComputerSelfe-450x600.webp',
    'ComputerSelfe.webp'
  ];
  
  let deletedCount = 0;
  for (const file of filesToDelete) {
    const filePath = path.join(OUTPUT_DIR, file);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`🗑️ Deleted: ${file}`);
      deletedCount++;
    }
  }
  
  console.log(`\n✅ Cleaned up ${deletedCount} old files\n`);
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
  console.log('🖼️ Recompressing new About image...\n');
  
  // First clean up old files
  cleanupOldFiles();
  
  const qualities = [95, 92, 90]; // Higher quality levels
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
  
  // Recommend a higher quality option
  const recommendedOption = results.find(r => r.quality === 92 && r.device === 'desktop') || 
                           results.find(r => r.quality === 90 && r.device === 'desktop') ||
                           results[0];
  
  console.log(`\n💡 Recommended option:`);
  console.log(`   File: ${recommendedOption.path}`);
  console.log(`   Size: ${(recommendedOption.fileSize / 1024).toFixed(1)} KB`);
  console.log(`   Quality: ${recommendedOption.quality}%`);
  console.log(`   Device: ${recommendedOption.device}`);
  
  console.log(`\n💡 Next steps:`);
  console.log(`1. Update About.jsx to use the new compressed file`);
  console.log(`2. Test the visual quality`);
  console.log(`3. If needed, adjust quality settings`);
}

// Run the script
main().catch(console.error); 