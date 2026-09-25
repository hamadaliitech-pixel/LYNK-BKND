const app = require("./src/app");
const connectdb = require("./src/db/db.js");
const PORT = 3000;

app.listen(PORT, async () => {
  await connectdb();
  console.log(`Server is running on port ${PORT}`);
});
