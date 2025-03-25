import { User } from "./userModel.mjs";

export const verificationMiddleware = async (request, response, next) => {
  console.log(request);
  const token = request.headers["authorization"];
  console.log(token);
  if (!token) return response.status(401).json({ error: "Not authorized" });

  const foundUser = await User.findOne({ session: token });
  if (!foundUser) return response.status(401).json({ error: "Not authorized" });
  request.user = foundUser;
  next();
};
