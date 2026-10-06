const fs = require('fs');
const path = require('path');

// Define the pre-push script content
const prePushScript = `#!/bin/sh
echo "Running build process before pushing..."

# Run the Next.js build command
npm run build

# Check if the build was successful
if [ $? -ne 0 ]; then
    echo "Build failed. Push aborted."
    exit 1
fi

echo "Build succeeded. Proceeding with push."
exit 0`;

// Define the path to the .husky directory
const huskyDir = path.join(__dirname, '../.husky');

// Ensure the .husky directory exists
if (!fs.existsSync(huskyDir)) {
	fs.mkdirSync(huskyDir);
}

// Define the path to the pre-push file
const prePushPath = path.join(huskyDir, 'pre-push');

// Write the script to the pre-push file
fs.writeFileSync(prePushPath, prePushScript, { mode: 0o755 });


