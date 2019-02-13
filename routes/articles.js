const express = require('express');
const router = express.Router();

//bring in Article models
let Article = require('../model/article');
//bring User model
let User = require('../model/user');


//把有格式的字轉成沒格式 <<h2p>>
var h2p = require('html2plaintext')

//新增文章的route
router.post('/add', function (req, res) {
    req.checkBody('title', 'Title is required').notEmpty();
    // req.checkBody('author', 'Author is required').notEmpty();
    req.checkBody('body', 'Body is required').notEmpty();

    //Get Error
    let errors = req.validationErrors();
    if (errors) {
        req.flash('danger', "文章標題與內容不得為空");
        res.redirect('/articles');
    } else {
        let article = new Article();
        article.title = req.body.title;
        article.author = req.user.name;
        article.author_id = req.user._id;
        article.body = req.body.body;

        article.save(function (err) {
            if (err) {
                console.log(err);
                return;
            } else {
                //flash第一個參數是type(css) 第二個參數是flash顯示的內容
                req.flash('success', 'Atricle Added');
                res.redirect('/articles');
            }
        });
        return;
    }

});

//刪除文章 route
router.delete('/:id', function (req, res) {
    if (!req.user._id) {
        res.status(500).send();
    }

    let query = {
        _id: req.params.id
    }

    Article.findById(req.params.id, function (err, article) {
        if (article.author_id != req.user._id) {
            res.status(500).send();
        } else {
            Article.remove(query, function (err) {
                if (err) {
                    console.log(err);
                }
                res.send('Success');
            })
        }
    })
});

//編輯文章 route
router.post('/edit/:id', function (req, res) {
    let article = {};
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    let query = {
        _id: req.params.id
    }


    Article.update(query, article, function (err) {
        if (err) {
            console.log(err);
            return;
        } else {
            //flash第一個參數是type(css) 第二個參數是flash顯示的內容
            req.flash('success', "Article Updated");
            res.redirect('/');
        }

    });

    return;
});

//顯示一篇文章的route
router.get('/:id', ensureAuthenticated, function (req, res) {
    Article.findById(req.params.id, function (err, article) {
        User.findById(article.author_id, function (err, user) {

            if (err) {
                console.log(err);
            } else {

                res.render('article', {
                    article: article,
                    author: user.name
                })
            }
        });
    });
});

//顯示新增文章表格的 Route 但暫時不用
router.get('/add', ensureAuthenticated, function (req, res) {
    res.render('add_article', {
        title: 'Add Article'
    });
});

//顯示編輯文章表格的 Route
router.get('/edit/:id', ensureAuthenticated, function (req, res) {
    Article.findById(req.params.id, function (err, article) {
        if (err) {
            console.log(err);
        } else {
            if (article.author_id != req.user._id) {
                req.flash('danger', 'Not Authorized');
                res.redirect('/');
            } else {
                res.render('edit_article', {
                    title: "Edit Article",
                    article: article
                })
            }
        }
    });
});


//顯示所有文章的route
router.get('/', ensureAuthenticated, function (req, res) {
    Article.find({}, function (err, articles) {
        //對每一篇文章的內容進行消除格式
        for (let i = 0; i < articles.length; i++) {
            articles[i].body = h2p(articles[i].body);
        }
        if (err) {
            console.log(err);
        } else {
            res.render('articles', {
                title: '討論區',
                articles: articles
            });
        }

    });
});

//Access Control
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('danger', 'Please Login');
        res.redirect('/users/login');
    }
}

module.exports = router;