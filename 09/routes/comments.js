const express = require("express");
const CommentModel = require("../models/comments");
const checkLogin = require("../middlewares/check").checkLogin;
const router = express.Router();

// POST /comments
router.post("/", checkLogin, function(req, res, next) {
    let author = req.session.user._id;
    let postId = req.fields.postId;
    let content = req.fields.content;

    content = content && content.trim().length !== 0 ? content : "";

    try {
        if (!content.length) {
            throw new Error("请填写留言内容");
        }
    } catch (err) {
        req.flash("error", err.message);
        return res.redirect("back");
    }

    const comment = {
        author,
        postId,
        content
    };

    CommentModel.create(comment)
        .then(function() {
            req.flash("success", "留言成功");
            // 留言成功后跳转到上一页
            res.redirect("back");
        })
        .catch(next);
});

// GET /comments/:commentId/remove
router.get("/:commentId/remove", checkLogin, function(req, res, next) {
    const author = req.session.user._id;
    const commentId = req.params.commentId;

    CommentModel.getCommentById(commentId)
        .then(function(comment) {
            if (!comment) {
                throw new Error("留言不存在");
            }
            if (comment.author.toString() !== author.toString()) {
                throw new Error("没有权限删除留言");
            }

            CommentModel.delCommentById(commentId)
                .then(function() {
                    req.flash("success", "删除留言成功");
                    // 删除成功后跳转到上一页
                    res.redirect("back");
                })
                .catch(next);
        })
        .catch(next);
});

module.exports = router;
