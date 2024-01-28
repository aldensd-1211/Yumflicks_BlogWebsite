import express from "express";
import bodyParser from "body-parser";
import path from 'path';
import multer from 'multer';

const app = express();

const port = 3000;

app.set('view engine', 'ejs');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

let posts = [];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/post_images'); // Save uploaded images in the public/images directory
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `image-${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

app.post('/submit-recipe', upload.single('image'), (req, res) => {
  const { name, description, category } = req.body;
  const imageUrl = req.file ? `/post_images/${req.file.filename}` : null; // Save image URL
  const post = { name, description, category, imageUrl };
  posts.push(post);
  res.redirect('/');
});

app.get('/',(req,res) => {
    res.render("index.ejs", {posts});
});


app.get('/explore-latest',(req,res) => {
  res.render("partials/latest.ejs", {posts});
});

app.get('/categories',(req,res) => {
  res.render("partials/all-categories.ejs");
});

// app.get('/random-recipe',(req,res) => {
//   res.render("partials/random.ejs", {posts});
// });

app.get('/random-recipe', (req, res) => {
  // Copy the original posts array to avoid modifying the original array
  const shuffledPosts = [...posts];

  // Shuffle the copied array randomly
  for (let i = shuffledPosts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledPosts[i], shuffledPosts[j]] = [shuffledPosts[j], shuffledPosts[i]];
  }

  res.render("partials/random.ejs", { posts: shuffledPosts });
});



// app.get('/blog/:index', (req, res) => {
//   const index = req.params.index;
//   const post = posts[index];
//   res.render('partials/blog-details.ejs', { post });
// });


app.get('/blog/:index', (req, res) => {
  const index = req.params.index;
  const post = posts[index];
  // console.log(posts);
  res.render('partials/blog-details.ejs', { posts, post });
});


  
app.get('/edit/:index', (req, res) => {
  const index = req.params.index;
  const post = posts[index];
  res.render('partials/editpost.ejs', { index, post });
});



app.get('/category/:category?', (req, res) => {
  const { category } = req.params;
  const filteredPosts = category ? posts.filter(post => post.category === category) : posts;
  res.render('partials/category-blogs.ejs', { category, filteredPosts});
});


  app.post('/update/:index', upload.single('image'), (req, res) => {
    const index = req.params.index;
    const { name, description, category } = req.body;
    const imageUrl = req.file ? `/post_images/${req.file.filename}` : null; // Save image URL
    posts[index] = { name, description, category, imageUrl };
    res.redirect('/');
  });

  // app.get('/delete/:id', (req, res) => {
  //   const postId = req.params.id;
  //   posts.splice(postId, 1);
  //   res.redirect('/');
  // });

  app.get('/delete/:index', (req, res) => {
    const index = req.params.index;
    posts.splice(index, 1);
    res.redirect('/');
  });


app.get('/submit',(req,res) => {
    res.render("partials/submit-recipe.ejs")
});

app.get('/about',(req,res) => {
    res.render("partials/about.ejs")
});

app.get('/contact',(req,res) => {
    res.render("partials/contact.ejs")
});

app.listen(port,() => {
    console.log(`Listening at port ${port}`);
});