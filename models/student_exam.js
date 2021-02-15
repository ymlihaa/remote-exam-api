class Student_Exam {
  constructor(key, answerKey, type, point, startTime, D, Y, B) {
    this.key = key;
    this.answerKey = answerKey;
    this.D = D;
    this.Y = Y;
    this.B = B;
    this.point = point;
    this.type = type;
    this.time = startTime;
  }
}

module.exports = Student_Exam;
