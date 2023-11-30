const mongoose = require("mongoose");
const app = require("./app");

const port = process.env.PORT || 4000;

app.listen(port, () => {
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
      console.log(`Listening on http://localhost:${port}`);
      console.log("Connected to MongoDB DataBase");
    })
    .catch(() => {
      console.log("Connection failed!");
    });
});

