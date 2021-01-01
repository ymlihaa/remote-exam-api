const { Router } = require("express");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
var cors = require("cors");
require("dotenv/config");

// İmport Routers
const examRouter = require("./routes/exam_router");

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

app.use("/exam", examRouter);
app.listen(process.env.PORT);

/**
 * TODO:
 * hangi derste kaç yanlış
 * sıralama
 * hangi soruda kaç kişi yanlış yapmış .
 */
