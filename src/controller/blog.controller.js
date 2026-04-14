import Blog from "../model/blog.model.js";
export const createBlog = async (req, res) => {
    try {
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
            author: req.user ? req.user.id : undefined
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
        const blog = await Blog.find({
            $or: [
                {
                    title: { $regex: query, $options: "i" }
                },
                {
                    description: { $regex: query, $options: "i" }
                }
            ]
        });

        return res.status(200).json({
            success: true,
            message: "Blog search successfully",
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