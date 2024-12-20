import express from 'express';

const app = express();
const port = 3000;

const posts = [];

// Class to create posts objects out of it
class Post {
    constructor(index, title, content) {
        this.index = index;
        this.title = title;
        this.content = content;
    };
};

// Function to create posts objects
const newPost = (title, content) => {
    let postIndex = posts.length;

    const post = new Post(postIndex, title, content);

    posts.push(post);
};


app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Home route
app.get('/', (req, res) => {
    res.render('index.ejs', { allPosts: posts });
});

// Create post route
app.get('/create-post', (req, res) => {
    res.render('create-post.ejs');
});

// View any post
app.get('/post/:index', (req, res) => {
    const postIndex = parseInt(req.params.index);
    const post = posts.find(p => p.index === postIndex);

    if (post) {
        res.render('post.ejs', {
            index: postIndex, 
            title: post["title"],
            content: post["content"]
            });
    } else {
        res.status(404).send('Post no encontrado');
    };
});

// Save created post
app.post('/save-post', (req, res) => {
    const title = req.body["title"];
    const content = req.body["content"];

    newPost(title, content);

    res.redirect(302, `/post/${posts.length - 1}`);
});

// Route to edit a post
app.get('/edit-post/:index', (req, res) => {
    const postIndex = parseInt(req.params.index);
    const post = posts.find(p => p.index === postIndex);
    const postTitle = post["title"];
    const postContent = post["content"];

    res.render('edit-post.ejs', {
        index: postIndex,
        title: postTitle,
        content: postContent
    });
});

// Edit specific post
app.post('/edit-post/:index', (req, res) => {
    const newTitle = req.body["new-title"];
    const newContent = req.body["new-content"];

    const postIndex = parseInt(req.params.index);
    const post = posts.find(p => p.index === postIndex);

    if (post) {
        post["title"] = newTitle;
        post["content"] = newContent;
        res.redirect(302, `/post/${postIndex}`);
    } else {
        res.status(404).send('Post no encontrado');
    };
});

// Route to delete a post
app.delete('/delete-post/:index', (req, res) => {
    const postIndex = parseInt(req.params.index);

    if (isNaN(postIndex) || postIndex < 0 || postIndex >= posts.length) {
        return res.status(404).send('Post no encontrado');
    };

    posts.splice(postIndex, 1);

    res.status(200).json({message: "Post eliminado correctamente."});
});

// Sets the port for the server
app.listen(port, () => { console.log(`Server running on port ${port}`) });