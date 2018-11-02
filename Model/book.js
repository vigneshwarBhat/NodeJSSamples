var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bookModel = new Schema({
    title:  String ,
    author:String 
});
const Book=mongoose.model('Book', bookModel);
module.exports = Book;