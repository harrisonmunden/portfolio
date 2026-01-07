import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SOURCE_DIR = './public/AboutAssets/About';
const QUALITY = 95;
// Standardize header image dimensions - use the widest width (3454px) for consistency
const HEADER_IMAGE_WIDTH = 3454;
const HEADER_IMAGE_HEIGHT = 140; 

// Get all image files from source directory (excluding already compressed files)
function getImageFiles(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`Source directory does not exist: ${dir}`);
    return [];
  }
  
  const files = fs.readdirSync(dir);
  return files.filter(file => {
    // Skip already compressed files
    if (file.includes('-compressed.webp') || file.endsWith('.webp')) return false;
    const ext = path.extname(file).toLowerCase();
    return ['.png', '.jpg', '.jpeg'].includes(ext);
  });
}

// Generate compressed WebP version for a single image
async function compressImage(filename) {
  const sourcePath = path.join(SOURCE_DIR, filename);
  const compressedName = `${path.parse(filename).name}-compressed.webp`;
  const compressedPath = path.join(SOURCE_DIR, compressedName);
  
  // Force regenerate - always compress to ensure we have the latest version
  // if (fs.existsSync(compressedPath)) {
  //   console.log(`⊘ Skipped (already exists): ${filename}`);
  //   return 'skipped';
  // }
  
  try {
    // Compress without resizing - maintain original dimensions
    await sharp(sourcePath)
      .webp({ quality: QUALITY })
      .toFile(compressedPath);
    
    console.log(`✓ Generated: ${filename} → ${compressedName}`);
    return true;
  } catch (error) {
    console.error(`✗ Failed to process ${filename}:`, error.message);
    return false;
  }
}

// Main function
async function compressAllImages() {
  console.log('🎨 Compressing About images to WebP...\n');
  
  const imageFiles = getImageFiles(SOURCE_DIR);
  
  if (imageFiles.length === 0) {
    console.log('No image files found in source directory.');
    return;
  }
  
  console.log(`Found ${imageFiles.length} images to process:\n`);
  
  let successCount = 0;
  let failCount = 0;
  let skippedCount = 0;
  
  for (const filename of imageFiles) {
    const result = await compressImage(filename);
    if (result === true) {
      successCount++;
    } else if (result === 'skipped') {
      skippedCount++;
    } else {
      failCount++;
    }
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`✓ Successfully generated: ${successCount} compressed images`);
  console.log(`⊘ Skipped (already exist): ${skippedCount} images`);
  if (failCount > 0) {
    console.log(`✗ Failed to generate: ${failCount} images`);
  }
  console.log(`\n📁 Compressed images saved to: ${SOURCE_DIR}`);
}

// Run the script
compressAllImages().catch(console.error);

