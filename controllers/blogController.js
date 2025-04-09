import { PrismaClient } from "@prisma/client";
import slugify from 'slugify';

const prisma = new PrismaClient();


export const createBlog = async (req, res) => {
  const { title, description, writer, image } = req.body;

  if (!title || !description || !writer) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (title.length > 255) {
    return res.status(400).json({ error: 'Title must be less than 255 characters' });
  }

  try {
    // Generate a unique slug using slugify
    let slug = slugify(title, { lower: true, strict: true });

    // Ensure the slug is unique
    const existingSlug = await prisma.blog.findUnique({
      where: { slug },
    });

    if (existingSlug) {
      slug = `${slug}-${Date.now()}`; // Append timestamp if slug already exists
    }

    // Create blog post
    const post = await prisma.blog.create({
      data: {
        title,
        description,
        writer,
        image: req.file.location,
        slug, // Include generated slug
      },
    });

    res.status(201).json({ message: 'Blog created successfully', data: post.id });
  } catch (error) {
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
      select: {
        id: true,
        title: true,
        description: true,
        image: true,
        dateCreated: true,
      },
    });

    // Count total blogs
    const totalCount = await prisma.blog.count();

    const totalPages = Math.ceil(totalCount / limitNumber);

    res.status(200).json({
      message: 'Success',
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


export const getBlogById = async (req, res) => {
  const blogId = req.params.id;

  if (!blogId) {
    return res.status(400).json({ message: 'Must include a blog id' });
  }

  try {
    const fetchedBlog = await prisma.blog.findUnique({
      where: { id: blogId },
      select: {
        id: true,
        title: true,
        description: true,
        image: true,
        dateCreated: true,
        writer: true,
        slug: true,
      },
    });

    if (!fetchedBlog) {
      return res.status(404).json({ message: `Blog with ID ${blogId} not found` });
    }

    res.status(200).json({ message: 'Success', data: fetchedBlog });

  } catch (error) {
    console.error('Error while fetching a blog by id', error.message);
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
      select: {
        id: true,
        title: true,
        description: true,
        image: true,
        dateCreated: true,
        writer: true,
        slug: true,
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
  const { title, description, image, writer } = req.body;

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

    // Generate a new slug if the title changes
    let slug = slugify(title, { lower: true, strict: true });

    // Ensure the new slug is unique
    const existingSlug = await prisma.blog.findUnique({
      where: { slug },
    });

    if (existingSlug && existingSlug.id !== blogId) {
      slug = `${slug}-${Date.now()}`; // Append timestamp if slug already exists
    }

    const updatedBlog = await prisma.blog.update({
      where: { id: blogId },
      data: {
        title,
        description,
        image,
        writer,
        slug, // Include new or updated slug
      },
      select: {
        id: true,
        title: true,
        description: true,
        image: true,
        dateCreated: true,
        writer: true,
        slug: true,
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
    });

    if (!existingBlog) {
      return res.status(404).json({ message: `Blog with ID ${blogId} not found.` });
    }

    await prisma.blog.delete({
      where: { id: blogId },
    });

    res.status(200).json({ message: 'Blog deleted successfully.' });

  } catch (error) {
    console.error('Error deleting blog:', error.message);
    res.status(500).json({ error: error.message });
  }
};

