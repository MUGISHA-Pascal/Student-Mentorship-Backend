import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getUser = async (req, res) => {
  try {
    const { userId } = req;
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });
    return res.status(200).json({ message: "user retrieved successfully", user })
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });

  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();

    return res
      .status(200)
      .json({
        message: "users retrieved successfully",
        users
      });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.delete({
      where: {
        id: id
      }
    });
    return res
      .status(200)
      .json({
        message: "user deleted successfully"
      });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

// // Get any table id from userId related to

// export const getEntityFromToken = async (req, res) => {
//   const token = req.headers['authorization']; // Assuming token is sent in the Authorization header

//   // if (!token) {
//   //     return res.status(400).json({ message: 'Authorization token is missing' });
//   // }

//   const { table } = req.query; // Extract table and field as query parameters

//   if (!table) {
//       return res.status(400).json({ message: 'Table name is required' });
//   }

//   try {
//       // Inline decoding logic
//       let decodedToken;
//       try {
//           // decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Replace 'your-secret-key' with your actual secret
//           decodedToken = jwtDecode(token);
//       } catch (error) {
//           console.error('Error decoding token:', error);
//           return res.status(400).json({ message: 'Invalid token' });
// }

//       if (!decodedToken || !decodedToken.id) {
//           return res.status(400).json({ message: 'Invalid token structure' });
//       }

//       const userId = decodedToken.id;

//       // Dynamically query the specified table
//       let result;
//       switch (table) {
//           case 'coach':
//               result = await prisma.coach.findUnique({
//                   where: { userId },
//                   // select: { [field]: true },
//               });
//               break;

//           case 'student':
//               result = await prisma.student.findUnique({
//                   where: { userId },
//                   // select: { [field]: true },
//               });
//               break;

//           // Add more cases for other tables as needed
//           default:
//               return res.status(400).json({ message: `Unsupported table: ${table}` });
//       }

//       if (!result) {
//           return res.status(404).json({ message: `${table} not found for this user` });
//       }

//       res.json(result);
//   } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Error retrieving data' });
//   }
// };

export const getEntityFromToken = async (req, res) => {
  const { table } = req.query; // Extract table name as a query parameter

  if (!table) {
      return res.status(400).json({ message: 'Table name is required' });
  }

  const userId = req.userId; // Retrieved from the middleware

  try {
      let result;

      // Dynamically query the specified table
      switch (table) {
          case 'coach':
              result = await prisma.coach.findUnique({
                  where: { userId },
              });
              break;

          case 'student':
              result = await prisma.student.findUnique({
                  where: { userId },
              });
              break;

          default:
              return res.status(400).json({ message: `Unsupported table: ${table}` });
      }

      if (!result) {
          return res.status(404).json({ message: `${table} not found for this user` });
      }

      res.json(result);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error retrieving data' });
  }
};
