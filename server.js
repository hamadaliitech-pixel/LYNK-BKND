const app = require("./src/app");
const connectdb = require("./src/db/db.js");

const PORT = process.env.PORT || 3000;
async function start(){
  connectdb()
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}
start()