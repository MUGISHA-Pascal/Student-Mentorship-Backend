import express from 'express';
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  findBlogByTitleOrDescription,
} from '../controllers/blogController.js'
import { uploadImage } from '../services/aws-s3.js';

export const blogRouter = express.Router();
// Handles the POST for a blog
blogRouter.post('/create-blog', uploadImage('blog').single('image'), createBlog);
// Handles the GET for all blogs
blogRouter.get('/get-blogs', getAllBlogs);
// Handles the GET for a spiecific blog given a valid ID
blogRouter.get('/get-blog/:id', getBlogById);
// Handles the GET for a matching blogs using the keywords.
blogRouter.get('/search-blogs', findBlogByTitleOrDescription);