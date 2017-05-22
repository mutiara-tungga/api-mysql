var bookshelf = require('./bookshelf');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var _ = require('underscore');
var PORT = 3000;

app.use(bodyParser.json());

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
    var queryParams = req.query;
    console.log(typeof queryParams.page);
    
    new Users()
        .fetchAll()
        .then(function (users) {
            res.send(users.toJSON());
        }).catch(function (error) {
            console.log(error);
            res.send('error');
        });
    


});

//show by user id
app.get('/user/:id', function (req, res) {
    var id_user = parseInt(req.params.id, 10);

    new Users()
        .where({
            user_id: id_user
        }).fetch()
        .then(function (user) {
            res.send(user.toJSON());
        }).catch(function (error) {
            console.log(error);
            res.send('Error');
        });
});

//create user
app.post('/user', function (req, res) {
    var user = _.pick(req.body, 'nama', 'password');

    //cek apa user dan password sesuai yang di harapkan
    if (!_.isString(user.nama) || !_.isString(user.password) || user.nama.trim().length === 0 || user.password.trim().length === 0) {
        return res.status(400).send();
    }

    //jika sesuai akan masuk di bawah ini
    new Users(user)
        .save()
        .then(function (model) {
            res.send(model.toJSON());
        }).catch(function (error) {
            console.log(error);
        });
});

//update user
app.put('/user/:id', function (req, res) {
    var id_user = parseInt(req.params.id, 10);

    var body = _.pick(req.body, 'nama', 'password');
    var validAtrributes = {};

    if (body.hasOwnProperty('nama') && _.isString(body.nama)) {
        validAtrributes.nama = body.nama;
    } else {
        return res.status(400).send();
    }

    if (body.hasOwnProperty('password') && _.isString(body.password)) {
        validAtrributes.password = body.password;
    } else {
        return res.status(400).send();
    }

    new Users()
        .where({
            user_id: id_user
        }).save(
        validAtrributes,
        { patch: true } //hanya atribut yang ada di method save yang disimpan
        ).then(function (model) {
            console.log("berhasil update");
            res.send(model.toJSON());
        }).catch(function (error) {
            console.log(error);
            res.send('Error');
        });
});

//delete User
app.delete('/user/:id', function (req, res) {
    var id_user = req.params.id;

    new Users()
        .where({
            user_id: id_user
        }).destroy()
        .then(function (model) {
            res.send(model.toJSON());
        }).catch(function (error) {
            console.log(error);
            res.send("error");
        });
})

app.listen(PORT, function () {
    console.log('Express port : ' + PORT);
});