const mongoose = require('mongoose');
// Category Url ini pretty yapıyoruz;
const URLSlugs = require('mongoose-url-slugs');

const Schema = mongoose.Schema;

const CategorySchema = new Schema({

  name: {
    type: String,
    required: true
  },

  slug: {
    type: String
  }

});

// pretty-url için mongoose un plugin metodunu kullanıyoruz.mongoose documentation da var;
CategorySchema.plugin(URLSlugs('name', {field: 'slug'}));

module.exports = mongoose.model('categories', CategorySchema);
