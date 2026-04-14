import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const BlogSchema = new mongoose.Schema({ author: mongoose.Schema.Types.ObjectId }, { strict: false });
const UserSchema = new mongoose.Schema({}, { strict: false });

const Blog = mongoose.model('Blog', BlogSchema);
const User = mongoose.model('User', UserSchema);

async function repair() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const firstUser = await User.findOne();
        if (!firstUser) {
            console.log('No users found to assign as author');
            process.exit(0);
        }

        const result = await Blog.updateMany(
            { $or: [{ author: { $exists: false } }, { author: null }] },
            { $set: { author: firstUser._id } }
        );

        console.log(`Repaired ${result.modifiedCount} blogs. Assigned to user: ${firstUser._id}`);
        process.exit(0);
    } catch (err) {
        console.error('Repair failed:', err);
        process.exit(1);
    }
}

repair();
