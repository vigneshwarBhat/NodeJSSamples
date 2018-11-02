var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var Book = require('../Model/book.js');
var router = new express.Router();
router.route('/').get(passport.authenticate('jwt', { session: false }),function (req, res) {
    Book.find({}, function (err, books) {
        res.json(books)
    })
})
.post(passport.authenticate('jwt', { session: false }), function (req, res) {
    var token = getToken(req.headers);
    if (token) {
        var book = new Book(req.body);
        book.save();
        res.status(201).send(book)
    }
});

router.route('/:bookId')
.get(passport.authenticate('jwt', { session: false }), function (req, res) {
    Book.findById(req.params.bookId, function (err, book) {
        if (!book) {
            res.status(500).send('No book found with bookid');
        }
        if (err) {
            res.status(500).send(err);
        }
        res.send(book1);
    })
})
.delete(passport.authenticate('jwt', { session: false }), function (req, res) {
    Book.findById(req.params.bookId, function (err, book) {
        if (!book) {
            res.status(500).send('No book found with bookid');
        }
        if (err) {
            res.status(500).send(err);
        }
        book.remove(function (err) {
            if (err) {
                res.status(500).send(err);
            }
            else {
                res.status(204).send('deleted');
            }
        })

    })
})
.patch(passport.authenticate('jwt', { session: false }), function (req, res) {
    if (req.body._id) {
        delete req.body._id;
    }
    Book.findById(req.params.bookId, function (err, book) {
        if (!book) {
            res.status(500).send('No book found with bookid');
        }
        if (err) {
            res.status(500).send(err);
        }
        for (var b in req.body) {
            book[b] = req.body[b];
        }
        book.save();
        res.json(book);
    })

})
.put(passport.authenticate('jwt', { session: false }), function (req, res) {
    Book.findById(req.params.bookId, function (err, book) {
        if (!book) {
            res.status(500).send('No book found with bookid');
        }
        if (err) {
            res.status(500).send('No book found with bookid');
        }
        book.title = req.body.title;
        book.author = req.body.author;
        book.save();
        res.json(book);
    })
});

getToken = function (headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};
module.exports = router;

