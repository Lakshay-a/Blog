const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer')
const fs = require('fs');

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/');
//     },
//     filename: (req, file, cb) => {
//         cb(null,file.originalname);
//     }
// });
const uploadMiddleware = multer({ dest: 'uploads/', limits: { fieldSize: 25 * 1024 * 1024 } })
// const uploadMiddleware = multer({ storage});


const salt = bcrypt.genSalt(10);
const secret = "maikyonbataoon";

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

mongoose.connect('mongodb+srv://blog:blog123@cluster0.enaahfy.mongodb.net/?retryWrites=true&w=majority')

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const newUser = await User.create({
            username,
            password: await bcrypt.hash(password, parseInt(salt)),
        });
        res.json(newUser);
    } catch (e) {
        console.log(e);
        res.status(400).json({ e: e.message });
    }
});

app.post('/login', async (req, res) => {    //lakshay lakshay 
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: "No account with this email has been registered." });
    // res.json(user);
    const isMatch = await bcrypt.compare(password, user.password);
    // res.json({isMatch});
    if (isMatch) {
        jwt.sign({ username, id: user._id }, secret, {}, (err, token) => {
            if (err) throw err;
            res.cookie('token', token).json({
                id: user._id,
                username
            })
        })
    } else {
        res.status(400).json("wrong credentials")
    }
})

app.get('/profile', (req, res) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            // Token is empty or not provided
            res.json(null)
            return;
        }
        jwt.verify(token, secret, {}, (err, info) => {
            if (err) throw err;
            res.json(info);
        });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }

});

app.post('/logout', (req, res) => {
    res.cookie('token', '').json('ok');
})

app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
    const { originalname, path } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath);

    const { token } = req.cookies;
    if (!token) {
        // Token is empty or not provided
        res.json(null)
        return;
    }
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
        const { title, summary, content } = req.body;
        const post = await Post.create({
            title,
            summary,
            content,
            cover: newPath,
            author: info.id
        })
        res.json(post);
    });

})

app.get('/post', async (req, res) => {
    const posts = await Post.find()
        .populate('author', ['username'])
        .sort({ createdAt: -1 })
        .limit(20);
    res.json(posts);
})

app.get('/post/:id', async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id).populate('author', ['username']);
    res.json(post);

})

app.put('/post/:id', uploadMiddleware.single('file'), async (req, res) => {
    let newPath = null;
    if (req.file) {
        const { originalname, path } = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
    }
    const { token } = req.cookies;
    if (!token) {
        // Token is empty or not provided
        res.json(null)
        return;
    }
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
        const { title, summary, content } = req.body;
        const { id } = req.params;
        const post = await Post.findById(id);
        const isAuthor = JSON.stringify(post.author) === JSON.stringify(info.id);
        if (!isAuthor) {
            return res.status(400).json({ msg: 'You are not the author of this post' })
        }
        await post.updateOne({ title, summary, content, cover: newPath ? newPath : post.cover }, { new: true, runValidators: true })
        res.json(post);
    });
})

app.delete('/post/:id', async (req, res) => {
    const { token } = req.cookies;
    if (!token) {
        // Token is empty or not provided
        res.json(null)
        return;
    }
    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) throw err;
        const { id } = req.params;
        const post = await Post.findById(id);
        const isAuthor = JSON.stringify(post.author) === JSON.stringify(info.id);
        if (!isAuthor) {
            return res.status(400).json({ msg: 'You are not the author of this post' })
        }
        await post.deleteOne();
        res.json({ msg: 'Post deleted successfully' });
    })
})

app.listen(3001, () => {
    console.log('server running on port 3001');
})
