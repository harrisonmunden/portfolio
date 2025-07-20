import fs from 'fs';
import path from 'path';

const SOURCE_DIR = './src/assets/3DArtwork';
const THUMBNAIL_DIR = './src/assets/3DArtwork/thumbnails';

function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (error) {
    return 0;
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function compareSizes() {
  console.log('📊 File Size Comparison: Original PNG vs WebP Thumbnails\n');
  
  const files = fs.readdirSync(SOURCE_DIR).filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ext === '.png';
  });
  
  let totalOriginalSize = 0;
  let totalThumbnailSize = 0;
  let processedCount = 0;
  
  console.log('File Name'.padEnd(25) + 'Original Size'.padEnd(15) + 'Thumbnail Size'.padEnd(15) + 'Reduction');
  console.log('-'.repeat(70));
  
  for (const file of files) {
    const originalPath = path.join(SOURCE_DIR, file);
    const thumbnailPath = path.join(THUMBNAIL_DIR, `${path.parse(file).name}.webp`);
    
    const originalSize = getFileSize(originalPath);
    const thumbnailSize = getFileSize(thumbnailPath);
    
    if (originalSize > 0 && thumbnailSize > 0) {
      const reduction = ((originalSize - thumbnailSize) / originalSize * 100).toFixed(1);
      const reductionText = `${reduction}%`;
      
      console.log(
        file.padEnd(25) + 
        formatBytes(originalSize).padEnd(15) + 
        formatBytes(thumbnailSize).padEnd(15) + 
        reductionText
      );
      
      totalOriginalSize += originalSize;
      totalThumbnailSize += thumbnailSize;
      processedCount++;
    }
  }
  
  console.log('-'.repeat(70));
  const totalReduction = ((totalOriginalSize - totalThumbnailSize) / totalOriginalSize * 100).toFixed(1);
  
  console.log(`\n📈 Summary:`);
  console.log(`Total Original Size: ${formatBytes(totalOriginalSize)}`);
  console.log(`Total Thumbnail Size: ${formatBytes(totalThumbnailSize)}`);
  console.log(`Overall Size Reduction: ${totalReduction}%`);
  console.log(`Files Processed: ${processedCount}`);
  
  console.log(`\n🚀 Performance Benefits:`);
  console.log(`• Grid loads ${totalReduction}% faster`);
  console.log(`• Bandwidth savings: ${formatBytes(totalOriginalSize - totalThumbnailSize)}`);
  console.log(`• Full resolution only loads when clicked`);
}

compareSizes(); 