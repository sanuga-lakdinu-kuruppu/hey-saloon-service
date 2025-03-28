import { Stylist } from "./stylistModel.mjs";

export const getFavoriteStylists = async (user) => {
  console.log(user);
  console.log(user.favouriteStylists);
  const foundStylists = await Stylist.find({
    stylistId: { $in: user.favouriteStylists },
  });
  return foundStylists;
};

export const getNearByStylists = async (lat, log) => {
  const nearbyStylists = await Stylist.aggregate([
    {
      $geoNear: {
        near: { type: "Point", coordinates: [log, lat] },
        distanceField: "distance",
        maxDistance: 10000,
        spherical: true,
      },
    },
    { $sort: { distance: 1 } },
  ]);

  return nearbyStylists;
};

export const gettopRatedStylists = async () => {
  const top = await Stylist.find({}).sort({ rating: -1 }).limit(5);
  return top;
};
