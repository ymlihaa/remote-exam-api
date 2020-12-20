var express = require("express");
var router = express.Router();
// const admin = require("firebase-admin");
// const serviceAccount = require("../remoteTrialExam-0b090011ed0f.json");

const {
  getAll,
  finishExam,
  addExam,
} = require("../controllers/examController");

// Listed Exams
router.get("/", getAll);
// creating Exams
router.post("/create", addExam);
// deleted Exams
router.post("/delete", addExam);
// finish Exam
router.post("/finish", finishExam);

module.exports = router;
