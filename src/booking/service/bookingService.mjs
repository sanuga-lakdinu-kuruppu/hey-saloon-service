import { Client } from "../../client/model/clientModel.mjs";
import { RETURN_CODES } from "../../common/error/returnCodes.mjs";
import { generateUniqueId } from "../../common/utility/commonUtility.mjs";
import { Stylist } from "../../stylist/model/stylistModel.mjs";
import { Booking } from "../model/bookingModel.mjs";
import { Connection } from "../../common/connection/connectionModel.mjs";
import AWS from "aws-sdk";

const apiGatewayManagementApi = new AWS.ApiGatewayManagementApi({
  endpoint: "https://io6nqs6reh.execute-api.ap-southeast-1.amazonaws.com/prod",
});

export const updateBookingStatus = async (bookingId, status) => {
  const booking = await Booking.findOne({ bookingId: bookingId })
    .populate("client")
    .populate("stylist");
  if (!booking) return { res: RETURN_CODES.SERVER_ERROR };

  booking.status = status;
  await booking.save();

  if (status !== "CANCELLED") {
    try {
      await sendNotification(booking);
    } catch (error) {
      console.log(`error occured ${error}`);
    }
  }
  return { res: RETURN_CODES.SUCCESS, updatedBooking: booking };
};

const sendNotification = async (booking) => {
  const foundConnection = await Connection.findOne({
    clientId: booking.client.clientId,
  });

  if (!foundConnection) {
    return;
  }

  const passBooking = {
    bookingId: booking.bookingId,
    bookingTime: booking.createdAt,
    status: booking.status,
    servicesSelected: booking.servicesSelected,
    queuedAt: booking.queuedAt,
    serviceWillTake: booking.serviceWillTake,
    estimatedStarting: booking.estimatedStarting,
    serviceTotal: booking.serviceTotal,
    stylist: {
      stylistId: booking.stylist.stylistId,
      firstName: booking.client?.name.firstName,
      lastName: booking.client?.name.lastName,
      saloonName: booking.stylist?.saloonName,
      location: booking.stylist?.location,
      totalReviewed: booking.stylist?.totalReviewed,
      currentRating: booking.stylist?.currentRating,
      profileUrl: booking.stylist?.client?.profileUrl || "",
    },
    client: booking.client,
  };

  const message = {
    type: booking.status,
    booking: passBooking,
  };

  const params = {
    ConnectionId: foundConnection.connectionId,
    Data: JSON.stringify(message),
  };

  await apiGatewayManagementApi.postToConnection(params).promise();
};

export const getAllBookings = async (clientId, status = "QUEUED") => {
  const foundClient = await Client.findOne({ clientId: clientId });
  if (!foundClient) return { res: RETURN_CODES.SERVER_ERROR };

  const bookings = await Booking.find({
    client: foundClient._id,
    status,
  })
    .populate({
      path: "stylist",
      populate: {
        path: "client",
        model: "Client",
      },
    })
    .populate("client");

  const formattedBookings = bookings.map((booking) => {
    const stylist = booking.stylist;
    const stylistClient = stylist?.client;

    return {
      bookingId: booking.bookingId,
      bookingTime: booking.createdAt,
      status: booking.status,
      servicesSelected: booking.servicesSelected,
      queuedAt: booking.queuedAt,
      serviceWillTake: booking.serviceWillTake,
      estimatedStarting: booking.estimatedStarting,
      serviceTotal: booking.serviceTotal,
      stylist: {
        stylistId: stylist?.stylistId,
        firstName: stylistClient?.name?.firstName || "",
        lastName: stylistClient?.name?.lastName || "",
        saloonName: stylist?.saloonName,
        location: stylist?.location,
        totalReviewed: stylist?.totalReviewed,
        currentRating: stylist?.currentRating,
        profileUrl: stylistClient?.profileUrl || "",
      },
      client: booking.client,
    };
  });

  return { res: RETURN_CODES.SUCCESS, bookings: formattedBookings };
};

export const createBooking = async (data) => {
  const foundStylist = await Stylist.findOne({
    stylistId: data.stylistId,
  }).populate({
    path: "client",
    select: "clientId name profileUrl contact favouriteStylists",
  });
  if (!foundStylist) return { res: RETURN_CODES.SERVER_ERROR };

  const foundClient = await Client.findOne({ clientId: data.clientId });
  if (!foundClient) return { res: RETURN_CODES.SERVER_ERROR };

  if (!data.servicesSelected || data.servicesSelected.length === 0)
    return { res: RETURN_CODES.SERVER_ERROR };

  const servicesSelected = data.servicesSelected;
  const stylistServices = foundStylist.services;

  let totalCost = 0;
  let totalTime = 0;
  let estimatedStarting;
  const selectedServicesDetails = [];

  servicesSelected.forEach((selectedId) => {
    const service = stylistServices.find((s) => s.serviceId === selectedId);
    if (service) {
      totalCost += service.serviceCost || 0;
      totalTime += service.serviceWillTake || 0;
      selectedServicesDetails.push(service);
    }
  });

  const queuedAt = foundStylist.totalQueued ? foundStylist.totalQueued + 1 : 1;
  if (queuedAt === 0) {
    estimatedStarting = new Date();
  } else {
    estimatedStarting = foundStylist.queueWillEnd
      ? foundStylist.queueWillEnd
      : new Date();
  }

  const newBooking = {
    bookingId: generateUniqueId(),
    stylist: foundStylist._id,
    client: foundClient._id,
    status: "QUEUED",
    servicesSelected: selectedServicesDetails,
    queuedAt: queuedAt,
    serviceWillTake: totalTime,
    estimatedStarting: estimatedStarting,
    serviceTotal: totalCost,
  };

  const savingBooking = new Booking(newBooking);
  const savedBooking = await savingBooking.save();

  const queueWillEnd = new Date(
    estimatedStarting.getTime() + totalTime * 60000
  );

  foundStylist.totalQueued = queuedAt;
  foundStylist.queueWillEnd = queueWillEnd;
  await foundStylist.save();

  return {
    res: RETURN_CODES.SUCCESS,
    booking: {
      bookingId: savedBooking.bookingId,
      bookingTime: savedBooking.createdAt,
      status: savedBooking.status,
      servicesSelected: savedBooking.servicesSelected,
      queuedAt: savedBooking.queuedAt,
      serviceWillTake: savedBooking.serviceWillTake,
      estimatedStarting: savedBooking.estimatedStarting,
      serviceTotal: savedBooking.serviceTotal,
      stylist: {
        stylistId: foundStylist.stylistId,
        firstName: foundStylist.client?.name.firstName,
        lastName: foundStylist.client?.name.lastName,
        saloonName: foundStylist.saloonName,
        location: foundStylist.location,
        totalReviewed: foundStylist.totalReviewed,
        currentRating: foundStylist.currentRating,
        profileUrl: foundStylist.client?.profileUrl || "",
      },
      client: foundClient,
    },
  };
};
