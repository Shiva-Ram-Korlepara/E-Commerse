export const roleAuth = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.userId)
      return res.status(401).json({ message: "Unauthorized. Please log in." });

    if (!allowedRoles.includes(req.role))
      return res.status(403).json({ message: "Access denied for your role." });

    next();
  };
};