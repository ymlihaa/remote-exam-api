var express = require("express");
var router = express.Router();
// const admin = require("firebase-admin");
// const serviceAccount = require("../remoteTrialExam-0b090011ed0f.json");

const {
  getAll,
  finishExam,
  addExam,
  examine,
  getOne,
  deleteExam,
} = require("../controllers/examController");

// Listed Exams
router.get("/", getAll);
//get One exam data
router.post("/getOne", getOne);
// creating Exams
router.post("/create", addExam);
// deleted Exams
router.post("/delete", deleteExam);
// finish Exam
router.post("/finish", finishExam);
// examine student resuls
router.post("/examine", examine);

module.exports = router;
