const Exam = require("../models/exam");
const Times = require("../models/times");
const calculators = require("../calculators/tyt_pointCalculator");
const tyt_pointCalculator = calculators.tyt_pointCalculator;

const admin = require("firebase-admin");
const serviceAccount = require("../remoteTrialExam-0b090011ed0f.json");
const { debug } = require("dotenv/lib/env-options");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

function makeid(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const getAll = async (req, res, next) => {
  try {
    const exams = await db.collection("exams");
    const data = await exams.get();
    const examArr = [];
    if (data.empty) {
      res.status(404).send("no exams record found");
    } else {
      data.forEach((doc) => {
        console.log(doc.id);
        const exam = new Exam(
          doc.id,
          doc.data().answerKey,
          doc.data().startTime,
          doc.data().endTime
        );
        console.log(examArr);
        examArr.push(exam);
      });
      res.send(examArr);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getOne = async (req, res, next) => {
  const examID = req.body.examID;
  const timeArr = [];
  console.log(examID);
  try {
    const exams = await db.collection("exams").doc(examID);
    const data = await exams.get();
    if (data.empty) {
      res.status(404).send("no exams record found");
    } else {
      const times = new Times(
        data.data().id,
        data.data().startTime,
        data.data().endTime
      );
      timeArr.push(times);
      res.status(200).send(times);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const finishExam = async (req, res, next) => {
  let point = 0;
  const data = req.body.data;
  const docRef = await db.collection("exams").doc(data.user.ExamID);
  await docRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        let json = doc.data();
        point = tyt_pointCalculator(data.result, json["answerKey"]);
        console.log("point:", point);
      } else {
        res.status(400).send("No such document");
      }
    })
    .catch(function (error) {
      res.status(404).send(error.message);
      console.log("Error getting document:", error);
    });
};

const addExam = async (req, res, next) => {
  const data = req.body;
  const examID = makeid(7);
  let arr;
  arr = data.answerKey.split(",");
  console.log(arr);
  const docRef = await db.collection("exams").doc(examID);
  await docRef
    .set({
      answerKey: arr,
      startTime: data.startTime,
      endTime: data.endTime,
    })
    .then(() => {
      res.send(examID);
    })
    .catch((error) => {
      res.status(404).send(error.message);
    });
};

const deleteExam = async (req, res, next) => {
  const data = req.body;
  const docRef = await db.collection("exams").doc(data.examID);
  await docRef
    .delete()
    .then(() => {
      console.log("Document successfuly deleted ! ");
      res.status(200).send();
    })
    .catch((error) => {
      console.log("Error removing document: ", error);
      res.status(404).send(error.message);
    });
};

module.exports = {
  getAll,
  finishExam,
  addExam,
  getOne,
  deleteExam,
};
