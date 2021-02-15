const Exam = require("../models/exam");
const Times = require("../models/times");
const Joined_Student = require("../models/Joined_Student");
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
  console.log(examID);
  const timeArr = [];
  console.log(examID);
  try {
    const exams = await db.collection("exams").doc(examID);
    const data = await exams.get();
    console.log(data);
    if (!data.exists) {
      res.status(404).send("no exams record found");
    } else {
      const times = new Times(
        data.data().id,
        data.data().startTime,
        data.data().endTime,
        data.data().type
      );
      timeArr.push(times);
      res.status(200).send(times);
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).send(error.message);
  }
};

const finishExam = async (req, res, next) => {
  let obj;
  const data = req.body.data;
  console.log(data);
  const docRef = await db.collection("exams").doc(data.user.ExamID);
  await docRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        const answerKey = doc.data().answerKey;
        const studentKey = data.result;
        switch (doc.data().type) {
          case "TYT":
            obj = tyt_pointCalculator(studentKey, answerKey);
            break;
        }

        Student_Exam(data, obj);
        console.log(obj);
        console.log(obj.total);
        res.status(200).send("successfully");
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
  try {
    arr = data.answerKey;
    console.log(arr);
    const docRef = await db.collection("exams").doc(examID);
    await docRef
      .set({
        answerKey: data.answerKey,
        startTime: data.startTime,
        endTime: data.endTime,
        type: data.type,
      })
      .then(() => {
        res.send(examID);
      })
      .catch((error) => {
        res.status(404).send(error.message);
      });
  } catch {
    res.status(404).send();
  }
};

const Student_Exam = async (data, obj) => {
  const docRef = await db
    .collection(data.user.ExamID)
    .doc(data.user.studentNumber);
  await docRef
    .set({
      answerKey: data.result,
      point: obj.total,
      D: obj.D,
      Y: obj.Y,
      B: obj.B,
      name: data.user.name,
      surname: data.user.surname,
      studentNumber: data.user.studentNumber,
      type: data.user.type,
    })
    .then(() => {
      return true;
    })
    .catch((error) => {
      console.log(error);
    });
};

const examine = async (req, res, next) => {
  const data = req.body;
  console.log(data);
  try {
    const docRef = await db.collection(data.examID);
    const students = await docRef.get();
    const student_List = [];
    if (students.empty) {
      res.status(404).send("no exams record found");
    } else {
      students.forEach((doc) => {
        const Joined_Student_List = new Joined_Student(
          doc.data().name,
          doc.data().surname,
          doc.data().studentNumber,
          doc.data().point,
          doc.data().type,
          doc.data().D,
          doc.data().Y,
          doc.data().B
        );
        console.log(Joined_Student_List);
        student_List.push(Joined_Student_List);
      });
      res.send(student_List);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
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
  examine,
};
