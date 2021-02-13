class Student_Exam {
  constructor(key, answerKey, type, point, startTime) {
    this.key = key;
    this.answerKey = answerKey;
    this.point = point;
    this.type = type;
    this.time = startTime;
  }
}

module.exports = Student_Exam;
