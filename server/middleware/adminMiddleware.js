export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user ? req.user.role : 'guest'}' is not authorized to access this resource.`
      });
    }
    next();
  };
};

export const requireAdmin = authorize('admin', 'superadmin');
export const requireSuperadmin = authorize('superadmin');
