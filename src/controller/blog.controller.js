import Blog from "../model/blog.model.js";

export const createBlog = async (req, res) => {
    try {
        const userId = req.user.id;
        const { title, description } = req.body;
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Image is required"
            });
        }

        const image = req.file.path;

        const blog = await Blog.create({
            title,
            description,
            image,
            author: userId
        })
        return res.status(201).json({
            success: true,
            message: "Blog created successfully",
            blog
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

export const toggleLikeBlog = async (req, res) => {
    try {
        const userId = req.user.id;
        const blogId = req.params.id;

        const blog = await Blog.findById(blogId);

        if (!blog) {
            return res.status(404).json({
                message: "Blog not found"
            });
        }

        const isLiked = blog.likes.includes(userId);

        if (isLiked) {
            blog.likes.pull(userId);

            await blog.save();

            return res.status(200).json({
                success: true,
                message: "Blog unliked successfully",
                blog
            });
        } else {
            // 👍 LIKE
            blog.likes.push(userId);

            await blog.save();

            return res.status(200).json({
                success: true,
                message: "Blog liked successfully",
                blog
            });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const searchBlog = async (req, res) => {
    try {
        const query = req.query.q;
        const blogs = await Blog.find({
            $or: [
                {
                    title: { $regex: query, $options: "i" }
                },
                {
                    description: { $regex: query, $options: "i" }
                }
            ]
        }).populate("author", "userName profilePicture");

        return res.status(200).json({
            success: true,
            message: "Blog search successfully",
            blogs
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

export const getTrendingBlogs = async (req, res) => {
    try {
        const blogs = await Blog.aggregate([
            {
                $addFields: {
                    likesCount: {
                        $size: { $ifNull: ["$likes", []] }
                    }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "author",
                    foreignField: "_id",
                    as: "author"
                }
            },
            {
                $unwind: {
                    path: "$author",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    "author.password": 0,
                    "author.email": 0
                }
            },
            {
                $sort: { likesCount: -1, createdAt: -1 }
            },
            {
                $limit: 10
            }
        ]);

        return res.status(200).json({
            success: true,
            blogs
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message
        });
    }
};

export const getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate("author", "userName profilePicture bio");
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }
        return res.status(200).json({
            success: true,
            blog
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const getRecentBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({})
            .populate("author", "userName profilePicture")
            .sort({ createdAt: -1 })
            .limit(10);

        return res.status(200).json({
            success: true,
            blogs
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}