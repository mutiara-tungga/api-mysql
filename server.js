var bookshelf = require('./bookshelf');
var express = require('express');
var app = express();
var PORT = 3000;

//mendefinisikan model user
var Users = bookshelf.Model.extend({
    tableName: 'user'
});

/*
- pagination di endpoint user (http://localhost:3000/user?page=1&limit=20)
- show detail user
- create user
- update user
- delete user
 */

//showAll user
app.get('/user', function (req, res) {
    var queryParams = req.query();

    //cek apakah ada query param page dan limit
    if (queryParams.hasOwnProperty('page') && queryParams.hasOwnProperty('limit')) {
        
    } else {
        new Users().fetchAll()
            .then(function (users) {
                console.log(typeof users);
                res.send(users.toJSON());
            }).catch(function (error) {
                console.log(error);
                res.send('error');
            });
    }


});

//show by user id
app.get('/user/:id', function (req, res) {
    var id_user = parseInt(req.params.id, 10);

    new Users().where({
        user_id: id_user
    }).fetch()
        .then(function (user) {
            res.send(user.toJSON());
        }).catch(function (error) {
            console.log(error);
            res.send('Error');
        });
});

app.listen(PORT, function () {
    console.log('Express port : ' + PORT);
});