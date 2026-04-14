import Comment from "../model/comment.model.js";
import Blog from "../model/blog.model.js";

export const addComment = async (req, res) => {
    try {
        const userId = req.user.id;
        const blogId = req.params.id;
        const { text } = req.body;

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" })
        }

        const comment = await Comment.create({
            text,
            blog: blogId,
            user: userId
        })
        return res.status(201).json({
            message: "Comment added successfully",
            comment
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
};

export const getComments = async (req, res) => {
    try {
        const blogId = req.params.id;
        const comments = await Comment.find({ blog: blogId })
            .populate("user", "userName profilePicture")
            .sort({ createdAt: -1 })

        return res.status(200).json({
            message: "Comments fetched successfully",
            comments
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
};

export const deleteComment = async (req, res) => {
    try {
        const userId = req.user.id;
        const commentId = req.params.id;

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found"
            })
        };
        if (comment.user.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this comment"
            })
        }
        await comment.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Comment deleted successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const replyComment = async (req, res) => {

    try {
        const userId = req.user.id;
        const commentId = req.params.id;
        const { text } = req.body;

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found"
            })
        };
        const reply = await Comment.create({
            text,
            blog: comment.blog,
            user: userId,
            parentComment: commentId
        });

        return res.status(200).json({
            success: true,
            message: "Reply Added",
            reply
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const toggleCommentLike = async (req, res) => {
    try {
        const userId = req.user.id;
        const commentId = req.params.id;

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found"

            })
        }
        const isliked = comment.likes.includes(userId);
        if (isliked) {
            comment.likes.pull(userId);
        } else {
            comment.likes.push(userId)
        }
        await comment.save();
        return res.status(200).json({
            success: true,
            message: isliked ? "Comment unliked successfully" : "Comment liked successfully",
            comment
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const getCommentsWithPagination = async (req, res) => {
    try {
        const blogId = req.params.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;

        const skip = (page - 1) * limit;
        const comments = await Comment.find({
            blog: blogId,
            parentComment: null
        })
            .populate("user", "userName profilePicture")
            .sort({ createdAt: - 1 })
            .skip(skip)
            .limit(limit);

        const totalComments = await Comment.countDocuments({
            blog: blogId,
            parentComment: null
        });
        const totalPages = Math.ceil(totalComments / limit);
        return res.status(200).json({
            success: true,
            message: "Comments fetched successfully",
            comments,
            pagination: {
                page,
                limit,
                totalPages,
                totalComments
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
}
