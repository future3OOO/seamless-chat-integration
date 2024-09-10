const { execSync } = require('child_process');
const fs = require('fs');

console.log('Starting production build...');

try {
  // Run the Vite build command
  execSync('npx vite build', { stdio: 'inherit' });

  console.log('Vite build completed successfully.');

  // Check if the dist folder exists
  if (fs.existsSync('./dist')) {
    console.log('Production build created in the "dist" folder.');
    console.log('You can now deploy the contents of the "dist" folder to your production server.');
  } else {
    console.error('Error: "dist" folder not found after build.');
  }
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}