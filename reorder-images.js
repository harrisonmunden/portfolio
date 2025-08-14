import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Current artwork array with priorities
const artwork = [
  { id: 1, title: 'Apple Tree', priority: 1 },
  { id: 3, title: 'Chess 4', priority: 2 },
  { id: 4, title: 'Chess 5', priority: 5 },
  { id: 5, title: 'Computer 4', priority: 4 },
  { id: 6, title: 'Crown', priority: 5 },
  { id: 8, title: 'Feathers 3', priority: 6 },
  { id: 9, title: 'Flower', priority: 2 },
  { id: 10, title: 'Golden Hill', priority: 9 },
  { id: 11, title: 'Grass', priority: 4 },
  { id: 12, title: 'H6', priority: 11 },
  { id: 13, title: 'Hawk', priority: 12 },
  { id: 14, title: 'Her Profile Photo', priority: 13 },
  { id: 15, title: 'Hfinal', priority: 14 },
  { id: 16, title: 'Julip CD', priority: 15 },
  { id: 17, title: 'Model Walk', priority: 16 },
  { id: 18, title: 'Peacock Side', priority: 17 },
  { id: 19, title: 'Praying Mantis', priority: 18 },
  { id: 20, title: 'Profile', priority: 19 },
  { id: 21, title: 'Rocket', priority: 20 },
  { id: 22, title: 'Rocket Lava Lamp', priority: 21 },
  { id: 23, title: 'Squid', priority: 22 },
  { id: 24, title: 'Star Canvas', priority: 7 },
  { id: 25, title: 'Tiger', priority: 24 },
  { id: 26, title: 'Trees', priority: 25 },
  { id: 27, title: 'Vases', priority: 26 },
  { id: 28, title: 'Worm Song', priority: 27 },
  { id: 29, title: 'Arch Stairs', priority: 28 },
  { id: 30, title: 'Loud Speakers', priority: 29 },
  { id: 31, title: 'Munden Towers', priority: 30 },
  { id: 32, title: 'Architectural Detail', priority: 31 },
  { id: 33, title: 'Verde Room', priority: 32 },
  { id: 34, title: 'Curtains', priority: 33 },
  { id: 35, title: 'Munden Chair', priority: 34 },
  { id: 36, title: 'Hanging Lights', priority: 35 },
  { id: 37, title: 'Orange Blur', priority: 36 },
  { id: 38, title: 'Hairy Room Exterior', priority: 37 },
  { id: 39, title: 'Hairy Chair', priority: 38 },
  { id: 40, title: 'Blue Room with Carpet', priority: 39 },
  { id: 41, title: 'Harrison Stick', priority: 9 },
  { id: 42, title: 'Adirn', priority: 41 },
  { id: 43, title: 'Rainbow', priority: 42 },
  { id: 44, title: 'Munden Yellow', priority: 3 },
  { id: 45, title: 'Glass 2', priority: 44 },
  { id: 46, title: 'Full Size Render', priority: 45 },
  { id: 47, title: 'Coming Along Maybe', priority: 46 },
  { id: 48, title: 'Screen Shot', priority: 47 },
  { id: 49, title: 'HM Room 2', priority: 48 },
  { id: 50, title: 'HM Room 3', priority: 49 },
  { id: 51, title: 'HM Room 1', priority: 1 },
  { id: 52, title: 'SF Alternate', priority: 8 }
];

console.log('🎨 3D Artwork Reordering Tool');
console.log('==============================');
console.log('Current image order (top to bottom):\n');

// Display current order
artwork.forEach((item, index) => {
  console.log(`${item.priority.toString().padStart(2, '0')}. ${item.title} (ID: ${item.id})`);
});

console.log('\n💡 To reorder images:');
console.log('1. Choose which images you want at the top');
console.log('2. Give them priority numbers 1, 2, 3, etc.');
console.log('3. Run this script with new priorities');
console.log('4. The script will update Works.jsx automatically');

console.log('\n📝 Example reordering:');
console.log('If you want "SF Alternate" first, "Apple Tree" second:');
console.log('- SF Alternate: priority = 1');
console.log('- Apple Tree: priority = 2');
console.log('- All others: priority = 3+ (in any order)');

console.log('\n🔧 To implement reordering:');
console.log('1. Edit the priority values in this script');
console.log('2. Run: node reorder-images.js');
console.log('3. The script will update your Works.jsx file');

// Function to update Works.jsx with new priorities
function updateWorksFile(newPriorities) {
  const worksPath = path.join(__dirname, 'src/components/Works.jsx');
  
  try {
    let content = fs.readFileSync(worksPath, 'utf8');
    
    // Update each priority in the file
    newPriorities.forEach(({ id, priority }) => {
      const regex = new RegExp(`(\\{ id: ${id},[^}]+)priority: \\d+`, 'g');
      content = content.replace(regex, `$1priority: ${priority}`);
    });
    
    fs.writeFileSync(worksPath, content, 'utf8');
    console.log('\n✅ Works.jsx updated successfully!');
    console.log('🔄 Refresh your browser to see the new order');
    
  } catch (error) {
    console.error('❌ Error updating Works.jsx:', error.message);
  }
}

// Function to shuffle array randomly
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Create array of remaining images (excluding top 5)
const remainingImages = [
  { id: 37, title: 'Orange Blur' },
  { id: 28, title: 'Worm Song' },
  { id: 15, title: 'Hfinal' },
  { id: 42, title: 'Adirn' },
  { id: 24, title: 'Star Canvas' },
  { id: 33, title: 'Verde Room' },
  { id: 51, title: 'HM Room 1' },
  { id: 19, title: 'Praying Mantis' },
  { id: 46, title: 'Full Size Render' },
  { id: 38, title: 'Hairy Room Exterior' },
  { id: 50, title: 'HM Room 3' },
  { id: 8, title: 'Feathers 3' },
  { id: 43, title: 'Rainbow' },
  { id: 16, title: 'Julip CD' },
  { id: 29, title: 'Arch Stairs' },
  { id: 39, title: 'Hairy Chair' },
  { id: 5, title: 'Computer 4' },
  { id: 47, title: 'Coming Along Maybe' },
  { id: 20, title: 'Profile' },
  { id: 35, title: 'Munden Chair' },
  { id: 13, title: 'Hawk' },
  { id: 48, title: 'Screen Shot' },
  { id: 31, title: 'Munden Towers' },
  { id: 4, title: 'Chess 5' },
  { id: 36, title: 'Hanging Lights' },
  { id: 25, title: 'Tiger' },
  { id: 40, title: 'Blue Room with Carpet' },
  { id: 14, title: 'Her Profile Photo' },
  { id: 45, title: 'Glass 2' },
  { id: 27, title: 'Vases' },
  { id: 21, title: 'Rocket' },
  { id: 6, title: 'Crown' },
  { id: 17, title: 'Model Walk' },
  { id: 44, title: 'Munden Yellow' },
  { id: 30, title: 'Loud Speakers' },
  { id: 23, title: 'Squid' },
  { id: 49, title: 'HM Room 2' },
  { id: 10, title: 'Golden Hill' },
  { id: 34, title: 'Curtains' },
  { id: 26, title: 'Trees' },
  { id: 41, title: 'Harrison Stick' },
  { id: 12, title: 'H6' },
  { id: 18, title: 'Peacock Side' },
  { id: 1, title: 'Apple Tree' },
  { id: 32, title: 'Architectural Detail' }
];

// Shuffle the remaining images randomly
const shuffledRemaining = shuffleArray([...remainingImages]);

// Apply the reordering changes - Keep top 5, randomize everything else
const newPriorities = [
  { id: 52, priority: 1 },  // SF Alternate (stays first)
  { id: 9, priority: 2 },   // Flower (stays second)
  { id: 3, priority: 3 },   // Chess 4 (stays third)
  { id: 11, priority: 4 },  // Grass (stays fourth)
  { id: 22, priority: 5 },  // Rocket Lava Lamp (stays fifth)
  ...shuffledRemaining.map((img, index) => ({ id: img.id, priority: index + 6 }))
];

updateWorksFile(newPriorities);

console.log('\n🎯 Reordering applied! Check your browser to see the new order.'); 