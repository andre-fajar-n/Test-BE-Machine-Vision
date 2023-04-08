import express from "express";
import cors from "cors";


const app = express();

var corsOptions = {
  origin: "*"
};

import db from "./app/models/index.js";

db.sequelize.sync()
  .then(() => {
    console.log("Synced DB");
  })
  .catch((err) => {
    console.error("Failed to sync DB: "+err.message)
  });

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true}));

// simple route
app.get("/", (req, res) => {
  res.json({
    message: "Server is up"
  })
})

import auth from "./app/routes/auth.route.js";

app.use("/auth", auth);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});