const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({

  category: {
    type: Schema.Types.ObjectId,
    ref: 'categories'
  },

  title: {
    type: String,
    required: true
  },

  answer: {
    type: String,
    required: true
  },

  date: {
    type: Date,
    default: Date.now
  }

});




module.exports = mongoose.model('questions', QuestionSchema);