/**
 * Authentication Middleware
 */
const admin = require('firebase-admin');

/**
 * Middleware to authenticate requests using Firebase ID tokens
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Token d\'authentification manquant',
        message: 'Veuillez fournir un token Bearer dans l\'en-tête Authorization'
      });
    }

    const idToken = authHeader.split('Bearer ')[1];

    if (!idToken) {
      return res.status(401).json({
        error: 'Token invalide',
        message: 'Le token Bearer est vide ou mal formaté'
      });
    }

    // Verify the token with Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // Add user information to request object
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      emailVerified: decodedToken.email_verified,
      displayName: decodedToken.name || null,
      photoURL: decodedToken.picture || null,
      // Add token metadata
      tokenIssuedAt: new Date(decodedToken.iat * 1000),
      tokenExpiresAt: new Date(decodedToken.exp * 1000)
    };

    next();

  } catch (error) {
    console.error('Authentication error:', error);

    // Handle specific Firebase errors
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({
        error: 'Token expiré',
        message: 'Votre session a expiré. Veuillez vous reconnecter.'
      });
    }

    if (error.code === 'auth/id-token-revoked') {
      return res.status(401).json({
        error: 'Token révoqué',
        message: 'Votre session a été révoquée. Veuillez vous reconnecter.'
      });
    }

    return res.status(401).json({
      error: 'Authentification échouée',
      message: 'Token d\'authentification invalide',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Optional authentication middleware (doesn't fail if no token)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const idToken = authHeader.split('Bearer ')[1];

      if (idToken) {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = {
          uid: decodedToken.uid,
          email: decodedToken.email,
          emailVerified: decodedToken.email_verified,
          displayName: decodedToken.name || null,
          photoURL: decodedToken.picture || null
        };
      }
    }

    next();

  } catch (error) {
    // For optional auth, we don't fail - just continue without user
    console.warn('Optional auth failed:', error.message);
    next();
  }
};

/**
 * Middleware to check if user has required role/permission
 * @param {string|string[]} permissions - Required permissions
 * @returns {Function} Middleware function
 */
const requirePermission = (permissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentification requise',
        message: 'Vous devez être connecté pour accéder à cette ressource'
      });
    }

    // Convert single permission to array
    const requiredPermissions = Array.isArray(permissions) ? permissions : [permissions];

    // Check if user has required permissions
    // This would typically check against a database or JWT claims
    const userPermissions = this.getUserPermissions(req.user.uid);

    const hasPermission = requiredPermissions.some(permission =>
      userPermissions.includes(permission)
    );

    if (!hasPermission) {
      return res.status(403).json({
        error: 'Permission insuffisante',
        message: 'Vous n\'avez pas les permissions nécessaires pour accéder à cette ressource'
      });
    }

    next();
  };
};

/**
 * Get user permissions (placeholder - would check database)
 * @param {string} userId - User ID
 * @returns {string[]} User permissions
 */
const getUserPermissions = (userId) => {
  // This would typically query a database or check JWT claims
  // For now, return basic permissions for all authenticated users
  return [
    'cv:create',
    'cv:read',
    'cv:update',
    'cv:delete',
    'payment:create',
    'payment:read',
    'download:create',
    'download:read'
  ];
};

module.exports = {
  authenticate,
  optionalAuth,
  requirePermission
};