import { User } from "../user/userModel.mjs";

export const verificationMiddleware = async (request, response, next) => {
  const token = request.headers["authorization"];
  if (!token) return response.status(401).json({ error: "Not authorized" });

  const foundUser = await User.findOne({ session: token });
  if (!foundUser) return response.status(401).json({ error: "Not authorized" });
  request.user = foundUser;
  next();
};
