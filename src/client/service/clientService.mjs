import { Client } from "../model/clientModel.mjs";
import { RETURN_CODES } from "../../common/error/returnCodes.mjs";

export const updateWithFavouriteStylists = async (clientId, isLiked, data) => {
  const updateQuery = isLiked
    ? { $addToSet: { favouriteStylists: data.stylistId } }
    : { $pull: { favouriteStylists: data.stylistId } };

  let updatedClient = await Client.findOneAndUpdate({ clientId }, updateQuery, {
    new: true,
  });
  updatedClient = await getClientById(clientId);
  return { res: RETURN_CODES.SUCCESS, client: updatedClient };
};

export const updateClientById = async (clientId, data) => {
  let newData = {};
  if (data.firstName || data.lastName) {
    newData.name = {};
    if (data.firstName) newData.name.firstName = data.firstName;
    if (data.lastName) newData.name.lastName = data.lastName;
  }

  let updatedClient = await Client.findOneAndUpdate(
    { clientId: clientId },
    newData,
    { new: true, runValidators: true }
  );

  updatedClient = await getClientById(clientId);
  return { res: RETURN_CODES.SUCCESS, client: updatedClient };
};

export const getClientById = async (clientId) => {
  const client = await Client.findOne({ clientId: clientId }).select(
    "clientId createdAt updatedAt name profileUrl favouriteStylists -_id"
  );
  return client;
};
