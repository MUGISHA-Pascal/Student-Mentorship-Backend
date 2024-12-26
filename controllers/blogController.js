import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();




// ******************** I Muhammad Hasim my  My Contribution STARTS here ******************************
      /********* Blog API *********************
      *                                       *
      *                                       *
      *                                       *
      *****************************************/
      /* Everything from here until indicated is in the service of the
                        Blog API
      */
      
      
//****** POST createBlog*********** */
export const createBlog = async (req, res) => { 
  // For the endpoint ---> /create-blog
  const content = {title, description, writer, image} = req.body
  
  if (!title || !description || !writer) { 
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  if (title.length > 255) { 
    return res.status(400).jons({ error: 'Title must be less than 255 characters' });
  }
  try {
    const post = await prisma.blog.create({
      data: {
        title: title,
        description: description,
        writer: writer,
        image: image,
      }
    });
    res.status(201).json({ message: 'Success', data: post.id });
  } catch (error) { 
    console.error('Error during blog creation', error);
    res.status(500).json({ error: error.message });
  }
}
//****** POST createBlo ENDS hereg*********** */


//****** GET allAllBlogs*********** */
export const getAllBlogs = async (req, res) => {
  const { sortBy = 'dateCreated', order = 'asc', page = 1, limit = 10 } = req.query;
  try {
    const allBlogPosts = prisma.blog.findMany({
      where,
      orderBy: { [sortBy]: order },
      skip: (page - 1) * limit,
      take: parseInt(limit,  10),
      select:
        {
          id: true,
          title: true,
          description: true,
          image: true,
          dateCreated: true,
        }
    });
    if (!allBlogPosts) {
      return res.status(400).json({ error: 'could not fetch a single blog' });
    }
    const totalCount = await prisma.blog.count({ where });
    res.status(200).json({ message: 'success', data: allBlogPosts });
  } catch (error) { 
    console.error('Error when fetching all posts', error.message);
  }
}
//****** POST createBlog ENDS here*********** */


//****** GET getBlogById*********** */
export const getBlogById = async (req, res) => { 
  const blogId = req.params.id
  if (!blogId) { 
    return res.error(400).json({ message: 'Must include a blog id' });
  }
  try {
    const fetchedBlog = await prisma.blog.findMany({
      where: { id: blogId },
    });
    if (!fetchedBlog) { 
      res.status(404).json({message: `Error page with blog ID ${blogId} not found`})
    }
    res.status(200).json({ message: 'Success', data: fetchedBlog });
  } catch (error) { 
    console.error('Error while feching a blog by id', error.message);
    res.status(500).json({ error: error.message });
  }
}
//****** POST createBlog ENDS here*********** */


//****** GET findBlogByTitleOrDescription*********** */
export const findBlogByTitleOrDescription = async (req, res) => { 
  const { keyword } = req.query
  if (!keyword) { 
    return res.status(401).json({ error: 'Missing query parameter or message' });
  }
  try {
    const foundPosts = await prisma.blog.findMany({
      where: {
        OR: [
          title ? { title: { contains: keyword, mode: 'insensitive' } } : undefined,
          content ? { description: { contains: keyword, mode: 'insensitive' } } : undefined,
        ],
      },
      orderBy: { dateCreated: 'desc' },
    });
    if (foundPosts.length === 0) { 
      return res.status(404).json({ Error: 'Post not found that match your search query' });
    }
    res.status(200).json({ message: 'success', data: foundPosts });
  } catch (error) { 
    console.error('Error fetching blogs', error);
    res.status(500).json({error: error.message})
  }
}

// ******************** My Contribution ENDS here ******************************