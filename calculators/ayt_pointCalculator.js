module.exports = {
  ayt_pointCalculator: function (studentKey, answerKey) {
    const formul = {
      ek: 100,
      ayt: {
        say: {
          ayt: { mat: 3.0, fizik: 2.857, kimya: 3.077, biyo: 3.077 },
        },
      },
    };

    let total = formul.ek;
    Object.keys(studentKey).map((key) => {
      let katsayi = eval("formul.ayt.say" + key);
      studentKey[key].map((item, index) => {});
      katSayi(item, answerKey[item][index], key);
    });
    return total;
  },
};
function katSayi(val1, val2, dersKatsayi) {
  let point = 0;
  if (val1.toUpperCase() == val2.toUpperCase()) {
    point += dersKatsayi;
  }
  return point;
}
