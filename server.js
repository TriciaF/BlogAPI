'use strict';

const express = require('express');
// we'll use morgan to log the HTTP layer
const morgan = require('morgan');
// we'll use body-parser's json() method to 
// parse JSON data sent in requests to this app
const bodyParser = require('body-parser');

// we import the BlogPosts model, which we'll
// interact with in our GET endpoint
const { BlogPosts } = require('./');


const jsonParser = bodyParser.json();
const app = express();

// log the http layer
app.use(morgan('common'));

// we're going to add some items to BlogPosts
// so there's some data to look at. Note that 
// normally you wouldn't do this. Usually your
// server will simply expose the state of the
// underlying database.
BlogPosts.create('Evaluating Ideas', 'Brainstorming is fun! In the early days of a new project, there are tons of ideas flying around, and those ideas spark discussions that spark more ideas. Maybe this new section of the site will have live-chat, and a video tour, and we’ll add voting to the comments.  It can be pretty hairy to narrow down the list of potential features. If the ideas were developed a while ago (which is usually the case in my projects—brainstorming tends to happen before outside consultants are hired), people are often very attached to an idea that they love and don’t want to give up.', 'Eileen Webb', 'September 21, 2015');


// when the root of this route is called with GET, return
// all current BlogPosts items by calling `BlogPosts.get()`
app.get('/blog-posts', (req, res) => {
  res.json(BlogPosts.get());
});

// when the root of this route is called with GET, return


app.post('/blog-posts', jsonParser, (req, res) => {
  const title = req.body.title;
  const content = req.body.content;
  const author = req.body.author;
  const date = req.body.publishDate;
  let item = BlogPosts.create(title, content, author, date);
  console.log(item);
  res.status(201).json(item);
});


app.delete('/blog-posts/:id', (req, res) => {
  BlogPosts.delete(req.params.id);
  console.log('Deleting blog-posts item = ' + req.params.id);
  res.status(204).end();
});


app.put('/blog-posts/:id', (req, res) => {
  console.log('app.put: Updating shopping list item ' + req.params.id);

  if (req.params.id !== req.body.id) {
    const message = 'IDs do not match';
    console.log(message);
    return res.status(400).send(message);
  }
  BlogPosts.update({ id: req.params.id, name: req.body.name, budget: req.body.budget });
  res.status(204).end();
});



app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});