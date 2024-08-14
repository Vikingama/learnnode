const express = require("express");
const PostModel = require("../models/posts");
const CommentModel = require("../models/comments");
const checkLogin = require("../middlewares/check").checkLogin;
const router = express.Router();

// GET /posts?author=xxx
router.get("/", function(req, res, next) {
    const author = req.query.author;
    // 主页与用户页通过 url 中的 author 参数区分
    PostModel.getPosts(author)
        .then(function(posts) {
            res.render("posts", {
                posts
            });
        })
        .catch(next);
});
// GET /posts/create
router.get("/create", checkLogin, function(req, res) {
    res.render("create");
});
// GET /posts/:postId
router.get("/:postId", function(req, res, next) {
    const postId = req.params.postId;

    Promise.all([
        // 获取文章信息
        PostModel.getPostById(postId),
        // 获取文章所有留言
        CommentModel.getComments(postId),
        // pv 加一
        PostModel.incPV(postId)
    ])
        .then(function(result) {
            const post = result[0];
            const comments = result[1];

            if (!post) {
                throw new Error("该文章不存在");
            }

            res.render("post", {
                post,
                comments
            });
        })
        .catch(next);
});
// GET /posts/:postId/edit
router.get("/:postId/edit", checkLogin, function(req, res, next) {
    const postId = req.params.postId;
    const author = req.session.user._id;

    PostModel.getRawPostById(postId)
        .then(function(post) {
            if (!post) {
                throw new Error("该文章不存在");
            }
            if (author.toString() !== post.author._id.toString()) {
                throw new Error("权限不足");
            }

            res.render("edit", { post });
        })
        .catch(next);
});
// GET /posts/:postId/remove
router.get("/:postId/remove", checkLogin, function(req, res, next) {
    const postId = req.params.postId;
    const author = req.session.user._id;

    PostModel.getRawPostById(postId)
        .then(function(post) {
            if (!post) {
                throw new Error("该文章不存在");
            }
            if (author.toString() !== post.author._id.toString()) {
                throw new Error("权限不足");
            }

            PostModel.delPostById(postId)
                .then(function() {
                    req.flash("success", "文章删除成功");
                    res.redirect("/posts");
                })
                .catch(next);
        })
        .catch(next);
});
// POST /posts/create
router.post("/create", checkLogin, function(req, res, next) {
    let author = req.session.user._id;
    let title = req.fields.title;
    let content = req.fields.content;

    title = title && title.trim().length !== 0 ? title : "";
    content = content && content.trim().length !== 0 ? content : "";

    try {
        if (!title.length) {
            throw new Error("请填写标题");
        } else if (!content.length) {
            throw new Error("请填写内容");
        }
    } catch (err) {
        req.flash("error", err.message);
        return res.redirect("back");
    }

    let post = {
        author,
        title,
        content
    };

    PostModel.create(post)
        .then(function(result) {
            post = result.ops[0];
            req.flash("success", "发表成功");
            // 发表成功后跳转到文章页
            res.redirect(`/posts/${post._id}`);
        })
        .catch(next);
});
// POST /posts/:postId/edit
router.post("/:postId/edit", checkLogin, function(req, res, next) {
    let postId = req.params.postId;
    let author = req.session.user._id;
    let title = req.fields.title;
    let content = req.fields.content;

    title = title && title.trim().length !== 0 ? title : "";
    content = content && content.trim().length !== 0 ? content : "";

    try {
        if (!title.length) {
            throw new Error("请填写标题");
        } else if (!content.length) {
            throw new Error("请填写内容");
        }
    } catch (err) {
        req.flash("error", err.message);
        return res.redirect("back");
    }

    PostModel.getRawPostById(postId)
        .then(function(post) {
            if (!post) {
                throw new Error("文章不存在");
            }
            if (post.author._id.toString() !== author.toString()) {
                throw new Error("没有权限");
            }
            PostModel.updatePostById(postId, { title, content })
                .then(function() {
                    req.flash("success", "文章编辑成功");
                    // 编辑成功后跳转到上一页
                    res.redirect(`/posts/${postId}`);
                })
                .catch(next);
        })
        .catch(next);
});

module.exports = router;
