import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SOURCE_DIR = './src/assets/3DArtwork';
const THUMBNAIL_DIR = './src/assets/3DArtwork/thumbnails';
const THUMBNAIL_SIZE = 800; 
const QUALITY = 95; 

// Ensure thumbnail directory exists
if (!fs.existsSync(THUMBNAIL_DIR)) {
  fs.mkdirSync(THUMBNAIL_DIR, { recursive: true });
  console.log(`Created thumbnail directory: ${THUMBNAIL_DIR}`);
}

// Get all image files from source directory
function getImageFiles(dir) {
  const files = fs.readdirSync(dir);
  return files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.png', '.jpg', '.jpeg', '.webp'].includes(ext);
  });
}

// Generate thumbnail for a single image
async function generateThumbnail(filename) {
  const sourcePath = path.join(SOURCE_DIR, filename);
  const thumbnailPath = path.join(THUMBNAIL_DIR, `${path.parse(filename).name}.webp`);
  
  try {
    await sharp(sourcePath)
      .resize(THUMBNAIL_SIZE, THUMBNAIL_SIZE, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: QUALITY })
      .toFile(thumbnailPath);
    
    console.log(`✓ Generated: ${filename} → ${path.basename(thumbnailPath)}`);
    return true;
  } catch (error) {
    console.error(`✗ Failed to process ${filename}:`, error.message);
    return false;
  }
}

// Main function
async function generateAllThumbnails() {
  console.log('🎨 Generating WebP thumbnails...\n');
  
  const imageFiles = getImageFiles(SOURCE_DIR);
  
  if (imageFiles.length === 0) {
    console.log('No image files found in source directory.');
    return;
  }
  
  console.log(`Found ${imageFiles.length} images to process:\n`);
  
  let successCount = 0;
  let failCount = 0;
  
  for (const filename of imageFiles) {
    const success = await generateThumbnail(filename);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`✓ Successfully generated: ${successCount} thumbnails`);
  if (failCount > 0) {
    console.log(`✗ Failed to generate: ${failCount} thumbnails`);
  }
  console.log(`\n📁 Thumbnails saved to: ${THUMBNAIL_DIR}`);
  console.log(`\n💡 Next steps:`);
  console.log(`1. Update the thumbnailSrc paths in Works.jsx to use the new WebP files`);
  console.log(`2. Test the performance improvement!`);
}

// Run the script
generateAllThumbnails().catch(console.error); 