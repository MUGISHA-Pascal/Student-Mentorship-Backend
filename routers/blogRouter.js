import express from 'express';
import { 
  createBlog,
  getAllBlogs,
  getBlogById,
  findBlogByTitleOrDescription,
} from '../controllers/blogController.js'

export const blogRouter = express.Router();
      /********* Blog COntroller *********************
      *                                       *
      *                                       *
      *                                       *
      *****************************************/
      /* Everything from here until indicated is in the service of the
                        Blog Controller
      */


// Handles the POST for a blog
blogRouter.post('/create-blog', createBlog);
// Handles the GET for all blogs
blogRouter.get('/get-blogs', getAllBlogs);
// Handles the GET for a spiecific blog given a valid ID
blogRouter.get('/get-blog/:id', getBlogById);
// Handles the GET for a matching blogs using the keywords.
blogRouter.get('/search-blogs', findBlogByTitleOrDescription);