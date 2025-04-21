import { RETURN_CODES } from "../../common/error/returnCodes.mjs";
import { generateUniqueId } from "../../common/utility/commonUtility.mjs";
import { Stylist } from "../../stylist/model/stylistModel.mjs";
import { Portfolio } from "../model/portfolioModel.mjs";

export const createPortfolio = async (data) => {
  const foundStylist = await Stylist.findOne({ stylistId: data.stylistId });
  if (!foundStylist) return { res: RETURN_CODES.SERVER_ERROR };

  const newPortfolio = {
    portfolioId: generateUniqueId(),
    imageUrl: data.imageUrl,
    stylist: foundStylist._id,
    name: data.name,
    likes: [],
  };

  const savingPortfolio = new Portfolio(newPortfolio);
  const savedPortfolio = await savingPortfolio.save();

  return {
    res: RETURN_CODES.SUCCESS,
    portfolio: {
      portfolioId: savedPortfolio.portfolioId,
      imageUrl: savedPortfolio.imageUrl,
      name: savedPortfolio.name,
      likes: savedPortfolio.likes.length,
    },
  };
};

export const getAllPortfolios = async (stylistId, clientId) => {
  const foundStylist = await Stylist.findOne({ stylistId: stylistId });
  if (!foundStylist) return { res: RETURN_CODES.SUCCESS, portfolios: [] };

  const foundPortfolios = await Portfolio.find({
    stylist: foundStylist._id,
  }).select("portfolioId createdAt updatedAt name imageUrl likes -_id");

  const result = foundPortfolios.map((portfolio) => {
    const isClientLiked = clientId
      ? portfolio.likes?.includes(clientId)
      : false;

    return {
      portfolioId: portfolio.portfolioId,
      createdAt: portfolio.createdAt,
      updatedAt: portfolio.updatedAt,
      name: portfolio.name,
      imageUrl: portfolio.imageUrl,
      likes: portfolio.likes.length,
      isClientLiked: isClientLiked,
    };
  });

  return { res: RETURN_CODES.SUCCESS, portfolios: result };
};

export const updateLikes = async (isLiked, data, portfolioId) => {
  const updateQuery = isLiked
    ? { $addToSet: { likes: data.clientId } }
    : { $pull: { likes: data.clientId } };

  let upatedPortfolio = await Portfolio.findOneAndUpdate(
    { portfolioId },
    updateQuery,
    {
      new: true,
    }
  );
  return {
    res: RETURN_CODES.SUCCESS,
    portfolio: {
      portfolioId: upatedPortfolio.portfolioId,
      imageUrl: upatedPortfolio.imageUrl,
      name: upatedPortfolio.name,
      likes: upatedPortfolio.likes.length,
    },
  };
};
