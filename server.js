require('dotenv').config();
const app = require('./src/app');
const connectDatabase = require('./src/db/db');

const port = Number(process.env.PORT) || 3000;

async function startServer() {
  try {
    await connectDatabase();
    app.listen(port, () => {
      console.log(`Backend server listening on port ${port}`);
    });
  } catch (error) {
    console.error(`Server startup failed: ${error.message}`);
    process.exit(1);
  }
}

startServer();
