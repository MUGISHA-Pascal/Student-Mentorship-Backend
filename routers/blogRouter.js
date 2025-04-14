import express from 'express';
import multer from 'multer';
import {
  createBlog,
  getAllBlogs,
  findBlogByTitleOrDescription,
  deleteBlog,
  editBlog,
  getBlogBySlug,
} from '../controllers/blogController.js'
import { verifyToken } from '../middleware/auth.js';

export const blogRouter = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});


// Handles the POST for a blog
blogRouter.post('/create-blog', verifyToken, upload.single('image'), createBlog);
// Handles the GET for all blogs
blogRouter.get('/get-blogs', getAllBlogs);
// Handles the GET for a spiecific blog given a valid ID
blogRouter.get('/get-blog/:slug', getBlogBySlug);
// Handles the GET for a matching blogs using the keywords.
blogRouter.get('/search-blogs', findBlogByTitleOrDescription);

blogRouter.put('/edit-blog/:id', verifyToken, upload.single('image'), editBlog);

blogRouter.delete('/delete-blog/:id',  verifyToken, deleteBlog);