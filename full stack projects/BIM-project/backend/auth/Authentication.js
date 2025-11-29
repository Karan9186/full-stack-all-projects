import jwt from "jsonwebtoken"

export const Authentication=(req,res,next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Extract token from authorization header
  if (!token) return res.status(400).json({ isValid: false });

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ isValid: false });
    }
    res.json({ isValid: true });
  });
};
