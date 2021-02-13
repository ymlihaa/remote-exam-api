module.exports = {
  tyt_pointCalculator: function (studentKey, answerKey) {
    const formul = {
      ek: 100,
      tyt: {
        tr: 3.3,
        mat: 3.3,
        cografya: 3.4,
        tarih: 3.4,
        felsefe: 3.4,
        din: 3.4,
        fizik: 3.4,
        kimya: 3.4,
        biyo: 3.4,
      },
    };

    let total = formul.ek;
    let counter = new Float32Array();
    Object.keys(studentKey).map((key) => {
      studentKey[key].map((item, index) => {
        let katsayi = eval("formul.tyt." + key);
        total += katSayi(item, answerKey[key][index], katsayi);
      });
    });
    return total;
  },
};
function katSayi(val1, val2, dersKatsayi) {
  let point = 0;
  if (val1 == val2) {
    point += dersKatsayi;
  }
  return point;
}
