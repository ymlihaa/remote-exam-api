module.exports = {
  tyt_pointCalculator: function (studentKeys, answerKeys) {
    let point = 1;
    let counter = new Float32Array();
    Object.keys(studentKeys).map((index) => {
      console.log(
        index,
        ":",
        "sta:",
        studentKeys[index],
        "=> ans",
        answerKeys[index]
      );
      if (
        studentKeys[index].toUpperCase() == answerKeys[index].toUpperCase() &&
        index <= 39
      ) {
        counter++;
        point = counter * 1.32;
        console.log(point);
      } else if (studentKeys[index] == answerKeys[index] && index <= 69) {
        point = counter * 1.36;
      }
    });

    return point;
  },
};
