import { Stylist } from "./stylistModel.mjs";

export const getFavoriteStylists = async (user) => {
  console.log(user);
  console.log(user.favouriteStylists);
  const foundStylists = await Stylist.find({
    stylistId: { $in: user.favouriteStylists },
  });
  return foundStylists;
};
