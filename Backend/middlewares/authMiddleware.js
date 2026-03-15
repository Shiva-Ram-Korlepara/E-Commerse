import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
    const tokenFromBody = req.body?.token;
    const tokenFromQuery = req.query?.token;
    const authHeader = req.headers?.authorization;
    const tokenFromHeader = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

    const token = tokenFromBody || tokenFromQuery || tokenFromHeader;

    if (!token) {
        return res.status(401).json({ message: 'Access Denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        req.role = decoded.role;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};