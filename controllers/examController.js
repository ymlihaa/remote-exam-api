const Exam = require("../models/exam");
const calculators = require("../calculators/tyt_pointCalculator");
const tyt_pointCalculator = calculators.tyt_pointCalculator;

const admin = require("firebase-admin");
const serviceAccount = require("../remoteTrialExam-0b090011ed0f.json");
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
          doc.data().id,
          doc.data().answerKey,
          doc.data().startTime,
          doc.data().endTime
        );
        examArr.push(exam);
      });
      res.send(examArr);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const finishExam = async (req, res, next) => {
  res.json(req.body.data);
  const data = req.body.data;
  const docRef = await db.collection("exams").doc(data.user.ExamID);
  await docRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        let json = doc.data();
        tyt_pointCalculator(data.result, json["answerKey"]);
      } else {
        console.log("No such document");
      }
    })
    .catch(function (error) {
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

module.exports = {
  getAll,
  finishExam,
  addExam,
};
