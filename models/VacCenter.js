const sql = require("../config/vacCenterDB");

const VacCeter = function (vacCenter) {
  this.id = vacCenter.id;
  this.name = vacCenter.name;
  this.tel = vacCenter.tel;
};

VacCeter.getAll = (result) => {
  sql.query("SELECT * FROM vacCenters", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    console.log("vacCenters: ", res);
    result(null, res);
  });
};

module.exports = VacCeter;
