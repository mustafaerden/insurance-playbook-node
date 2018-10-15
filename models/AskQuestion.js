const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AskQuestionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },

  title: {
    type: String,
    required: true
  },

  category: {
    type: Schema.Types.ObjectId,
    ref: 'categories'
  },

  details: {
    type: String,
    required: true
  }

});


module.exports = mongoose.model('askquestions', AskQuestionSchema);
