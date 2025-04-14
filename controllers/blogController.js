import { PrismaClient } from "@prisma/client";
import slugify from 'slugify';
import fs from 'fs';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { nanoid } from 'nanoid';
import { uploadToS3 } from '../services/aws-s3.js';
const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



export const createBlog = async (req, res) => {
  const { title, description, category } = req.body;
  const userId = req.userId;

  if (!title || !description || !userId || !category) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (title.length > 255) {
    return res.status(400).json({ error: 'Title must be less than 255 characters' });
  }

  try {
    // Generate a unique slug
    let slug = slugify(title, { lower: true, strict: true });

    const existingSlug = await prisma.blog.findUnique({
      where: { slug },
    });

    if (existingSlug) {
      slug = `${slug}-${Date.now()}`;
    }

    let imageUrl = null;

    if (req.file) {
      // upload to S3 and get the URL
      imageUrl = await uploadToS3(req.file, 'blog');
    }

    // Create the blog with the linked user
    const post = await prisma.blog.create({
      data: {
        title,
        description,
        category,
        userId: userId,
        image: imageUrl,
        slug,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    });

    res.status(201).json({
      message: 'Blog created successfully',
      blog: post,
    });
  } catch (error) {
    console.log("Error creating ", error)
    console.error('Error during blog creation', error);
    res.status(500).json({ error: error.message });
  }
};


export const getAllBlogs = async (req, res) => {
  try {
    const {
      sortBy = 'dateCreated',  // Default sort field
      order = 'asc',           // Default order
      page = 1,                // Default page
      limit = 10,              // Default limit per page
    } = req.query;

    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    // Fetch blogs with pagination
    const blogs = await prisma.blog.findMany({
      orderBy: {
        [sortBy]: order.toLowerCase(), // Prisma expects 'asc' or 'desc'
      },
      skip,
      take: limitNumber,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    });

    // Count total blogs
    const totalCount = await prisma.blog.count();

    const totalPages = Math.ceil(totalCount / limitNumber);

    res.status(200).json({
      message: 'Blogs retrieved successfully!',
      data: blogs,
      pagination: {
        totalItems: totalCount,
        totalPages,
        currentPage: pageNumber,
        perPage: limitNumber,
      },
    });

  } catch (error) {
    console.error('Error fetching blogs:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// export const getBlogById = async (req, res) => {
//   const blogId = req.params.id;

//   if (!blogId) {
//     return res.status(400).json({ message: 'Must include a blog id' });
//   }

//   try {
//     const fetchedBlog = await prisma.blog.findUnique({
//       where: { id: blogId },
//       include: {
//         user: {
//           select: {
//             id: true,
//             firstName: true,
//             lastName: true,
//             role: true,
//           },
//         },
//       },
//     });

//     if (!fetchedBlog) {
//       return res.status(404).json({ message: `Blog with ID ${blogId} not found` });
//     }

//     res.status(200).json({ message: 'Blog retrieved successfully!', data: fetchedBlog });

//   } catch (error) {
//     console.error('Error while fetching a blog by id', error.message);
//     res.status(500).json({ error: error.message });
//   }
// };

export const getBlogBySlug = async (req, res) => {
  const blogSlug = req.params.slug;

  if (!blogSlug) {
    return res.status(400).json({ message: 'Must include a blog slug' });
  }

  try {
    const fetchedBlog = await prisma.blog.findUnique({
      where: { slug: blogSlug }, // 🔥 use slug instead of id
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    });

    if (!fetchedBlog) {
      return res.status(404).json({ message: `Blog with slug "${blogSlug}" not found` });
    }

    res.status(200).json({ message: 'Blog retrieved successfully!', data: fetchedBlog });

  } catch (error) {
    console.error('Error while fetching a blog by slug', error.message);
    res.status(500).json({ error: error.message });
  }
};



export const findBlogByTitleOrDescription = async (req, res) => {
  const { keyword } = req.query;

  if (!keyword) {
    return res.status(400).json({ error: 'Missing query parameter: keyword' });
  }

  try {
    const foundPosts = await prisma.blog.findMany({
      where: {
        OR: [
          { title: { contains: keyword, mode: 'insensitive' } },
          { description: { contains: keyword, mode: 'insensitive' } },
        ],
      },
      orderBy: { dateCreated: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    });

    if (foundPosts.length === 0) {
      return res.status(404).json({ error: 'No posts found matching your search query' });
    }

    res.status(200).json({ message: 'Success', data: foundPosts });

  } catch (error) {
    console.error('Error fetching blogs by title or description', error.message);
    res.status(500).json({ error: error.message });
  }
};


export const editBlog = async (req, res) => {
  const blogId = req.params.id;
  const { title, description, category } = req.body;

  if (!blogId) {
    return res.status(400).json({ message: 'Blog ID is required.' });
  }

  try {
    const existingBlog = await prisma.blog.findUnique({
      where: { id: blogId },
    });

    if (!existingBlog) {
      return res.status(404).json({ message: `Blog with ID ${blogId} not found.` });
    }

    let slug = existingBlog.slug;

    if (title) {
      slug = slugify(title, { lower: true, strict: true });

      const existingSlug = await prisma.blog.findUnique({
        where: { slug },
      });

      if (existingSlug && existingSlug.id !== blogId) {
        slug = `${slug}-${nanoid(5)}`;
      }
    } else {
      slug = `${slug}-${nanoid(5)}`; // No title, just append timestamp
    }

    let imageUrl = existingBlog.image;

    if (req.file) {
      if (existingBlog.image) {
        const oldImagePath = path.join(__dirname, '..', 'blogs', path.basename(existingBlog.image));
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      // Upload the new image
      const newImageUrl = await uploadToS3(req.file, 'blog');
      imageUrl = newImageUrl;
    }

    const updatedBlog = await prisma.blog.update({
      where: { id: blogId },
      data: {
        slug,
        ...(title && { title }),
        ...(description && { description }),
        ...(category && { category }),
        image: imageUrl,
      },
    });

    res.status(200).json({ message: 'Blog updated successfully.', data: updatedBlog });

  } catch (error) {
    console.error('Error updating blog:', error.message);
    res.status(500).json({ error: error.message });
  }
};

export const deleteBlog = async (req, res) => {
  const blogId = req.params.id;

  if (!blogId) {
    return res.status(400).json({ message: 'Blog ID is required.' });
  }

  try {
    const existingBlog = await prisma.blog.findUnique({
      where: { id: blogId },
      include: {
        user: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!existingBlog) {
      return res.status(404).json({ message: `Blog with ID ${blogId} not found.` });
    }

    // Only allow blog owner or admin
    if (existingBlog.user.id !== req.userId && req.userRole !== 'ADMIN') {
      return res.status(403).json({ message: 'Access denied. You can only delete your own blog or be an admin.' });
    }

    // Delete image from server if exists
    if (existingBlog.image) {
      const imagePath = path.join(__dirname, '..', 'blogs', existingBlog.image);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error('Failed to delete image:', err.message);
          // Don't throw error here, just log it and continue deleting blog
        }
      });
    }

    await prisma.blog.delete({
      where: { id: blogId },
    });

    res.status(200).json({ message: 'Blog and associated image deleted successfully.' });

  } catch (error) {
    console.error('Error deleting blog:', error.message);
    res.status(500).json({ error: error.message });
  }
};

