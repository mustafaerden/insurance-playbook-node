const moment = require('moment');


module.exports = {


  //Tarihi düzgün göstermek için ayarlama;
  generateTime: function(date, format) {

    return moment(date).format(format);

  }



}