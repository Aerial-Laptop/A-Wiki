const https = require('https');
const fs = require('fs');
const matter = require('gray-matter');
var colors = require('colors');
var colors = require('colors/safe');
const rateLimit = require('express-rate-limit');

const accessLimit = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: process.env.accessLimit,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many access requests created from this IP, please try again after 5 minutes!',
})

app.get("/:article", accessLimit, (req, res) => {

    // read the markdown file
    if (req.params.article == "icon.png" || req.params.article == "favicon.ico") {
            res.sendFile(`${req.params.article}`, { root: "./static/" }, (err) => {if (err) {console.log(err);}})
        } else {
        if (fs.existsSync(`./articles/${req.params.article}.md`)) {
            file = matter.read('./articles/' + req.params.article + '.md');
            // use markdown-it to convert content to HTML
            var md = require("markdown-it")();
            let content = file.content;
            var result = md.render(content);

            res.render("article", {
                    post: result,
                    title: file.data.title,
                    description: file.data.description,
            });
        } else {
            res.redirect("/");
        }
}
});

app.get("/", accessLimit, (req, res) => {
    const posts = fs.readdirSync('./articles/').filter(file => file.endsWith('.md'));
    res.render("home", {
            posts: posts
    });
});