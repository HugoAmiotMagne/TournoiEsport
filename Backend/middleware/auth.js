const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({ message: "Token manquant." });
    }

    const parts = req.headers.authorization.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({ message: "Format du token invalide." });
    }

    const token = parts[1];

    // Si le token correspond au token admin de l'env, on lui donne tous les droits
    if (token === process.env.ADMIN_TOKEN) {
      req.user = { id: "ADMIN", role: "admin" };
      return next();
    }

    // Sinon on vérifie le token normal
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decodedToken.userId };
    next();

  } catch (error) {
    res.status(401).json({ message: "Token invalide ou expiré.", error: error.message });
  }
};