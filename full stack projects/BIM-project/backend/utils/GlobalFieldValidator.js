export const validateRequiredFields = (fields, req, res) => {
  for (const field of fields) {
    // Convert value to string and then check if it is empty
    const fieldValue = String(req.body[field]).trim();

    // Check if the field is empty after trimming
    if (!fieldValue) {
      return res.status(400).json({
        success: false,
        message: `${field} is required`,
      });
    }
  }
  return null; // Return null if validation passes
};
