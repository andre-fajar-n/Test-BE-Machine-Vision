import express from "express";
import cors from "cors";
import db from "./app/models/index.js";
import authRouter from "./app/routes/auth.route.js";
import userRouter from "./app/routes/user.route.js";
import postRouter from "./app/routes/post.route.js";
import fileRouter, { directoryUpload } from "./app/routes/file.route.js";

const app = express();

var corsOptions = {
  origin: "*"
};

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

// server static file inside directory "uploads"
app.use(express.static(directoryUpload))

// simple route
app.get("/", (req, res) => {
  res.json({
    message: "Server is up"
  })
})

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/post", postRouter);
app.use("/file", fileRouter);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});