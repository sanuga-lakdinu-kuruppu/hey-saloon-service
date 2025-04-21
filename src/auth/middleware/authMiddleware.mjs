import { Client } from "../../client/model/clientModel.mjs";
import jwt from "jsonwebtoken";

export const protectRoute = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      const header = req.headers.authorization;

      if (!header || !header.startsWith("Bearer ")) {
        return res
          .status(401)
          .json({ message: "Need the authentication token" });
      }

      const token = header.split(" ")[1];
      const payload = jwt.verify(token, process.env.JWT_SECRET);

      const client = await Client.findOne({
        clientId: payload.clientId,
      }).populate("user");

      if (!client) {
        return res.status(401).json({ message: "User not found" });
      }

      if (client.user.isDisabled) {
        return res.status(401).json({ message: "Access temporary disabled" });
      }

      if (client.user.isDeleted) {
        return res.status(401).json({ message: "User deleted" });
      }

      if (allowedRoles.length > 0 && !allowedRoles.includes(client.user.role)) {
        return res.status(401).json({
          message:
            "Access Denied: your role does not have permission to do this",
        });
      }

      req.clientId = client.clientId;
      req.userId = client.user.userId;
      if (client.user.role === "STYLIST") req.stylistId = payload.stylistId;
      next();
    } catch (err) {
      return res.status(498).json({ message: "Invalid or expired token" });
    }
  };
};
