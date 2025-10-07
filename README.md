
@kaviyarasan022/image-compressor-target

A lightweight and easy-to-use image compressor for your projects.

**npm install @kaviyarasan022/image-compressor-target**

Features

Compress images easily in Node.js projects

Supports JPEG, PNG, and WebP formats

Lightweight and fast

Simple API for easy integration


const imageCompressor = require('@kaviyarasan022/image-compressor-target');

// Example usage
imageCompressor.compress('input.jpg', 'output.jpg', { quality: 70 })
  .then(() => {
    console.log('Image compressed successfully!');
  })
  .catch((err) => {
    console.error('Error compressing image:', err);
  });


| Option  | Type   | Default       | Description                   |
| ------- | ------ | ------------- | ----------------------------- |
| quality | number | 80            | Compression quality (0-100)   |
| format  | string | same as input | Output format (jpeg/png/webp) |


Dependencies

This package currently depends on:

sharp
 — for image processing

fs-extra
 — for file operations

These dependencies are automatically installed with the package.

git clone <your-repo-url>
cd image-compressor-target



License

MIT License © 2025 Kaviyarasan M
