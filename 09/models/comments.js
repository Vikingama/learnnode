const marked = require("marked");
const Comment = require("../lib/mongo").Comment;

Comment.plugin("contentToHtml", {
    afterFind(comments) {
        return comments.map(function(comment) {
            comment.content = marked(comment.content);
            return comment;
        });
    }
});

module.exports = {
    // 创建一条留言
    create(comment) {
        return Comment.create(comment).exec();
    },
    // 通过留言 id 获取一个留言
    getCommentById(commentId) {
        return Comment.findOne({ _id: commentId }).exec();
    },
    // 通过留言 id 删除一个留言
    delCommentById(commentId) {
        return Comment.deleteOne({ _id: commentId }).exec();
    },
    // 通过文章 id 获取文章所有留言，并按创建时间升序
    getComments(postId) {
        return Comment.find({ postId })
            .populate({
                path: "author",
                model: "User"
            })
            .sort({ _id: -1 })
            .addCreatedAt()
            .contentToHtml()
            .exec();
    },
    // 通过文章 id 获取文章留言数量
    getCommentsCount(postId) {
        return Comment.count({ postId }).exec();
    },
    // 通过文章 id 删除该文章所有留言
    delCommentsByPostId(postId) {
        return Comment.deleteMany({ postId }).exec();
    }
};
