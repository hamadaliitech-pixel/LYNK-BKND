const multer = require('multer');

// Keep the upload in memory so the controller can send its buffer to ImageKit.
const upload = multer({ storage: multer.memoryStorage() });

module.exports = upload;
