import jwt from "jsonwebtoken";
import db from "../utils/db.connect.js";

export const userRegistration = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
    // Query to check if the username already exists
    const query = "SELECT * FROM user1 WHERE user = ?";
    const [results] = await db.promise().execute(query, [username]);

    if (results.length > 0) {
      return res.status(400).json({ message: "Username already taken" });
    }

    // Insert the new user into the database without hashing the password
    const insertQuery = "INSERT INTO user1 (user, password) VALUES (?, ?)";
    await db.promise().execute(insertQuery, [username, password]);

    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const userLogin = async (req, res) => {
  const { username, password } = req.body;

  // Ensure both username and password are provided
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
    // SQL query to fetch the user by username
    const query = "SELECT * FROM user1 WHERE user = ?";
    const [rows] = await db.promise().query(query, [username]);

    // Check if the user exists
    if (!rows || rows.length === 0) {
      console.log("No user found with this username");
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // User exists, get the user object from the first row
    const user = rows[0];
    console.log("User fetched from DB:", user.password); // Log the stored password

    // Check if the user.password exists and is a valid string
    if (!user.password || typeof user.password !== "string") {
      console.log("No valid password found for the user in the database");
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Log the entered password to compare with the stored password
    console.log("Entered password:", password);

    // Directly compare the entered password with the stored one (no hashing)
    if (user.password !== password) {
      console.log("Password does not match");
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.user },
      process.env.JWT_SECRET || "demo",
      { expiresIn: "1h" }
    );
    console.log(user);

    return res.json({
      message: "Login successful",
      token,
      user,
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const userGet = async (req, res) => {
  // 1. Get the token from the Authorization header
  const token = req.body.token; // Extract token from "Bearer token"

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // 2. Verify the token and decode it
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "demo");
    console.log(decoded);

    // 3. Retrieve the user from the database using the user id from the token
    const query = "SELECT * FROM user1 WHERE user = ?";
    const [rows] = await db.promise().query(query, [decoded.username]);

    // 4. Check if user exists
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // 5. Return user data in the response
    const user = rows[0]; // Assuming rows is an array of users, we take the first one
    return res.status(200).json({ user });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllUser = (req, res) => {
  const query = "SELECT * FROM user1"; // Replace 'users' with your table name

  // Execute the query to fetch all users
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Database query failed" });
    }
    res.json(results); // Send the results as a JSON response
  });
};

export const massageStore = (req, res) => {
  const { sender, receiver, isRead, msg } = req.body;

  // Check if required fields are provided
  if (!sender || !receiver || !msg) {
    return res
      .status(400)
      .json({ error: "Sender, receiver, and message are required" });
  }

  // SQL query to insert the message
  const query = `
    INSERT INTO usermsg (sender, receiver, isread, msg)
    VALUES (?, ?, ?, ?)
  `;

  // Execute the query
  db.execute(query, [sender, receiver, isRead || 0, msg], (err, results) => {
    if (err) {
      console.error("Error inserting message:", err);
      return res.status(500).json({ error: "Failed to send message" });
    }

    console.log("Message inserted:", results);
    return res
      .status(200)
      .json({ message: "Message sent successfully", data: results });
  });
};
export const getMessages = (req, res) => {
  const { senderid, receiverId } = req.body; // Ensure these values are from the request body

  // Input validation
  if (!senderid || !receiverId) {
    return res
      .status(400)
      .json({ error: "Both senderid and receiverId are required" });
  }

  // Corrected SQL query: get messages where sender and receiver match
  const query = `
    SELECT * FROM usermsg 
    WHERE (sender = ? AND receiver = ?) 
    OR (sender = ? AND receiver = ?)
  `;

  db.query(
    query,
    [senderid, receiverId, receiverId, senderid],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: "Database query failed" });
      }
      res.json(result); // Send the result back as JSON
    }
  );
};
export const uploadFile = async (req, res) => {
  try {
    const file = req.file; // The file uploaded by Multer
    const { sender, receiver, isRead } = req.body; // Extract the sender, receiver, and isRead status from the body

    // Validate required fields
    if (!sender || !receiver || !isRead) {
      return res
        .status(400)
        .send({ message: "Missing required fields", status: false });
    }

    if (!file) {
      return res
        .status(400)
        .send({ message: "No file uploaded", status: false });
    }

    // File path after Multer has processed the file
    const filePath = file.path; // This is the relative path of the file stored on the server

    // Prepare the SQL query to insert data into the database
    const query =
      "INSERT INTO usermsg (sender, receiver, isread, file) VALUES (?, ?, ?, ?)";

    // Execute the query with the provided values
    db.execute(
      query,
      [sender, receiver, isRead || 0, filePath],
      (err, result) => {
        if (err) {
          console.error(err);
          return res
            .status(500)
            .send({ message: "Error while uploading file", status: false });
        }
        console.log(result);

        // Send success response with file information
        return res.status(200).send({
          message: "File uploaded successfully!",
          file: {
            originalName: file.originalname,
            filePath: filePath, // Send the file path stored in the database
          },
        });
      }
    );
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Error uploading file",
      error: error.message,
    });
  }
};

// Function to get the last message for a specific user
export const printLastMessage = (req, res) => {
  // Assuming the user_id is passed as a query parameter (e.g., /messages?user_id=1)
  const sender = req.body.sender;
  const receiver = req.body.receiver;

  if (!sender || !receiver) {
    return res.status(400).json({ error: "user_id is required" });
  }

  // Query to fetch the last message for the specified user
  const query = `SELECT \`id\`, \`sender\`, \`receiver\`, \`isread\`, \`msg\`, \`created_at\`, \`file\`
                 FROM \`usermsg\`
                 WHERE \`sender\` = ? OR \`receiver\` = ?
                 ORDER BY \`created_at\` DESC
                 LIMIT 1`;

  db.query(query, [sender, receiver], (err, results) => {
    if (err) {
      console.error("Error fetching last message:", err);
      return res
        .status(500)
        .json({ error: "An error occurred while fetching the last message" });
    }

    // If there is no message
    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "No messages found for this user" });
    }

    // Send the last message as the response
    const lastMessage = results[0];
    res.status(200).json({
      id: lastMessage.id,
      sender: lastMessage.sender,
      receiver: lastMessage.receiver,
      isread: lastMessage.isread,
      msg: lastMessage.msg,
      created_at: lastMessage.created_at,
      file: lastMessage.file,
    });
  });
};
