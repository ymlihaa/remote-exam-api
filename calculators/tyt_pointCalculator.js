module.exports = {
  tyt_pointCalculator: function (studentKey, answerKey) {
    this.D = 0;
    this.Y = 0;
    this.B = 0;
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

    const katSayi = (val1, val2, dersKatsayi) => {
      let point = 0;
      if (val1 == val2) {
        point += dersKatsayi;
        console.log("doğru", ++this.D);
      } else if (val1 == null || val1 == undefined) {
        console.log("boş", ++this.B);
      } else {
        console.log("yanliş", ++this.Y);
      }
      return point;
    };

    Object.keys(answerKey).map((key) => {
      studentKey[key].map((item, index) => {
        let katsayi = eval("formul.tyt." + key);
        total += katSayi(item, answerKey[key][index], katsayi);
      });
    });
    var obj = {
      total: total,
      D: this.D,
      Y: this.Y,
      B: this.B,
    };
    return obj;
  },
};
