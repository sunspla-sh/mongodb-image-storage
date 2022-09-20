const mongoose = require('mongoose');
const User = require('./models/User.model');

const multer = require('multer');
const upload = multer()

mongoose.connect('mongodb://localhost/imageStorageExample')
  .then(x => console.log('mongoose connected to ', x.connections[0].name))
  .catch(err => console.log('mongoose error while connecting ', err));

const express = require('express');

const app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res, next) => {
  res.render('index.hbs');
});

app.post('/my-image', upload.single('myImage'), (req, res,next) => {

  console.log('the image file: ', req.file)
  console.log('the body: ', req.body)

  User.create({
    email: req.body.myEmail,
    image: req.file.buffer
  })
    .then(savedUser => {
      const savedUserWithBase64Image = {
        email: savedUser.email,
        image: savedUser.image.toString('base64')
      };
      res.render('data.hbs', savedUserWithBase64Image)
    })
    .catch(err => {
      console.log('err while creating user ', err);
      res.send('error while creating user');
    })

});

app.get('/users', (req, res, next) => {
  User.find()
    .then(usersArray => {
      const usersArrayWithBase64Image = usersArray.map(element => {
        return {
          email: element.email,
          image: element.image.toString('base64')
        }
      })
      res.render('users.hbs', { usersArrayWithBase64Image });
    });
})

app.listen(3000, () => {
  console.log('yo server is listening on port 3000 dawg')
})