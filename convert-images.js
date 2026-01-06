import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const SOURCE_DIR = './src/assets/GlassyObjects/About';
const OUTPUT_DIR = './src/assets/GlassyObjects/About';

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function convertImage(inputPath, outputPath) {
  try {
    await sharp(inputPath)
      .webp({ 
        quality: 90,
        lossless: true,
        nearLossless: false,
        smartSubsample: true
      })
      .toFile(outputPath);
    
    console.log(`✓ Converted: ${path.basename(inputPath)} → ${path.basename(outputPath)}`);
    return true;
  } catch (error) {
    console.error(`✗ Failed to convert ${path.basename(inputPath)}:`, error.message);
    return false;
  }
}

async function convertAllImages() {
  console.log('🖼️ Converting images to WebP format...\n');
  
  const images = [
    { input: 'Head.png', output: 'Head.webp' },
    { input: 'Body.png', output: 'Body.webp' }
  ];
  
  let successCount = 0;
  let failCount = 0;
  
  for (const image of images) {
    const inputPath = path.join(SOURCE_DIR, image.input);
    const outputPath = path.join(OUTPUT_DIR, image.output);
    
    if (fs.existsSync(inputPath)) {
      const success = await convertImage(inputPath, outputPath);
      if (success) {
        successCount++;
      } else {
        failCount++;
      }
    } else {
      console.log(`⚠️ Source file not found: ${image.input}`);
    }
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`✓ Successfully converted: ${successCount} images`);
  if (failCount > 0) {
    console.log(`✗ Failed to convert: ${failCount} images`);
  }
  console.log(`\n💡 Next steps:`);
  console.log(`1. Update the image paths in PersonFigure.jsx to use .webp files`);
  console.log(`2. Test the performance improvement!`);
}

convertAllImages().catch(console.error); 