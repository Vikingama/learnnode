// 文章操作相关
const marked = require("marked");
const Post = require("../lib/mongo").Post;
const CommentModel = require("./comments");

// 给 post 添加留言数 commentsCount
Post.plugin("addCommentsCount", {
    afterFind(posts) {
        return Promise.all(
            posts.map(function(post) {
                return CommentModel.getCommentsCount(post._id).then(function(
                    commentsCount
                ) {
                    post.commentsCount = commentsCount;
                    return post;
                });
            })
        );
    },
    afterFindOne(post) {
        if (post) {
            return CommentModel.getCommentsCount(post._id).then(function(
                commentsCount
            ) {
                post.commentsCount = commentsCount;
                return post;
            });
        }

        return post;
    }
});
// 将 post 的 content 从 md 转换成 html
Post.plugin("contentToHtml", {
    afterFind(posts) {
        return posts.map(function(post) {
            post.content = marked(post.content);
            return post;
        });
    },
    afterFindOne(post) {
        if (post) {
            post.content = marked(post.content);
        }
        return post;
    }
});

module.exports = {
    // 创建一篇文章
    create(post) {
        return Post.create(post).exec();
    },
    // 通过文章 id 获取一篇文章
    getPostById(postId) {
        return Post.findOne({ _id: postId })
            .populate({
                path: "author",
                model: "User"
            })
            .addCreatedAt()
            .addCommentsCount()
            .contentToHtml()
            .exec();
    },
    // 按照创建时间降序获取所有用户文章或者某个特定用户的所有文章
    getPosts(author) {
        const query = {};

        if (author) {
            query.author = author;
        }

        return Post.find(query)
            .populate({
                path: "author",
                model: "User"
            })
            .sort({ _id: -1 })
            .addCreatedAt()
            .addCommentsCount()
            .contentToHtml()
            .exec();
    },
    // 给文章的 pv 加一
    incPV(postId) {
        return Post.update(
            {
                _id: postId
            },
            {
                $inc: { pv: 1 }
            }
        ).exec();
    },
    // 通过 postId 获取文章原生内容
    getRawPostById(postId) {
        return Post.findOne({ _id: postId })
            .populate({
                path: "author",
                model: "User"
            })
            .exec();
    },
    // 通过 postId 更新文章
    updatePostById(postId, data) {
        return Post.update({ _id: postId }, { $set: data }).exec();
    },
    // 通过 postId 删除文章
    delPostById(postId) {
        return Post.deleteOne({ _id: postId })
            .exec()
            .then(function(res) {
                // 文章删除后，删除文章下的所有留言
                if (res.result.ok && res.result.n > 0) {
                    return CommentModel.delCommentsByPostId(postId);
                }
            });
    }
};
