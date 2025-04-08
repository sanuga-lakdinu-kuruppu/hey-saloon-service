import { Stylist } from "./stylistModel.mjs";

export const getFavoriteStylists = async (user) => {
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

export const getBookingByStylistId = async (stylistId, userId) => {
  const stylist = await Stylist.findOne({ stylistId });

  if (!stylist) {
    return "1111";
  }

  const booking = stylist.bookings.find((b) => b.userId === userId);

  if (!booking) {
    return "1111";
  }

  return booking;
};

export const gettopRatedStylists = async () => {
  const top = await Stylist.find({}).sort({ rating: -1 }).limit(5);
  return top;
};

export const getStylistById = async (id) => {
  const foundStylist = await Stylist.findOne({
    stylistId: Number(id),
  });
  return foundStylist;
};
