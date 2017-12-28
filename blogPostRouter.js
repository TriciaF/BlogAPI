'use strict';

const express = require('express');
// we'll use morgan to log the HTTP layer
const router = express.Router();

// we'll use body-parser's json() method to 
// parse JSON data sent in requests to this app
const bodyParser = require('body-parser');

// we import the BlogPosts model, which we'll
// interact with in our GET endpoint
const { BlogPosts } = require('./models');


const jsonParser = bodyParser.json();


// we're going to add some items to BlogPosts
// so there's some data to look at. Note that 
// normally you wouldn't do this. Usually your
// server will simply expose the state of the
// underlying database.
BlogPosts.create('Evaluating Ideas', 'Brainstorming is fun! In the early days of a new project, there are tons of ideas flying around, and those ideas spark discussions that spark more ideas. Maybe this new section of the site will have live-chat, and a video tour, and we’ll add voting to the comments.  It can be pretty hairy to narrow down the list of potential features. If the ideas were developed a while ago (which is usually the case in my projects—brainstorming tends to happen before outside consultants are hired), people are often very attached to an idea that they love and don’t want to give up.', 'Eileen Webb');


// when the root of this route is called with GET, return
// all current BlogPosts items by calling `BlogPosts.get()`
router.get('/', (req, res) => {
  res.json(BlogPosts.get());
});

// when the root of this route is called with GET, return


router.post('/', jsonParser, (req, res) => {
  console.log('Entered app.post');
  const title = req.body.title;
  const content = req.body.content;
  const author = req.body.author;
  let item = BlogPosts.create(title, content, author);
  console.log(item);
  res.status(201).json(item);
});


router.delete('/:id', (req, res) => {
  BlogPosts.delete(req.params.id);
  console.log('Deleting blog-posts item = ' + req.params.id);
  res.status(204).end();
});


router.put('/:id', (req, res) => {
  console.log('app.put: Updating Blog post item ' + req.params.id);

  if (req.params.id !== req.body.id) {
    const message = 'IDs do not match';
    console.log(message);
    return res.status(400).send(message);
  }
  BlogPosts.update({ id: req.params.id, title: req.body.title, content: req.body.content, author: req.body.author, publishDate: req.body.publishDate });
  res.status(204).end();
});

module.exports = router;