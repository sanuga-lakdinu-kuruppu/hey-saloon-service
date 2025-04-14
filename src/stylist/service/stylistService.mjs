import { OtpVerification } from "../../otpVerification/model/otpVerificationModel.mjs";
import { RETURN_CODES } from "../../common/error/returnCodes.mjs";
import {
  generateUniqueId,
  generateOTP,
  hashString,
  sendEmail,
} from "../../common/utility/commonUtility.mjs";
import { TempStylist } from "../model/tempStylistModel.mjs";
import { getEmailForLoginOtp } from "../../common/templates/emailTemplate.mjs";
import { Client } from "../../client/model/clientModel.mjs";
import { Stylist } from "../model/stylistModel.mjs";

export const updateStylistServices = async (stylistId, services) => {
  const updatedServices = services.map((service) => {
    return {
      serviceId: generateUniqueId(),
      serviceName: service.serviceName,
      serviceCost: service.serviceCost,
      serviceWillTake: service.serviceWillTake,
    };
  });
  const newData = {
    services: updatedServices,
  };

  let updatedStylist = await Stylist.findOneAndUpdate(
    { stylistId: stylistId },
    newData,
    { new: true, runValidators: true }
  );
  updatedStylist = await getStylistById(stylistId);
  return { res: RETURN_CODES.SUCCESS, stylist: updatedStylist };
};

export const updateStylistById = async (stylistId, data) => {
  let newData = {};
  if (data.saloonName) newData.saloonName = data.saloonName;
  if (data.startTime) newData.startTime = data.startTime;
  if (data.endTime) newData.endTime = data.endTime;
  if (data.thumbnailUrl) newData.thumbnailUrl = data.thumbnailUrl;
  if (data.address) {
    newData.address = {};
    if (data.address.no) newData.address.no = data.address.no;
    if (data.address.address1) newData.address.address1 = data.address.address1;
    if (data.address.address2) newData.address.address2 = data.address.address2;
    if (data.address.address3) newData.address.address3 = data.address.address3;
  }
  if (data.location) {
    const coordinates = [];

    if (data.location.log) coordinates[0] = data.location.log;
    if (data.location.lat) coordinates[1] = data.location.lat;

    newData.location = {
      type: "Point",
      coordinates: coordinates,
    };
  }

  let updatedStylist = await Stylist.findOneAndUpdate(
    { stylistId: stylistId },
    newData,
    { new: true, runValidators: true }
  );

  updatedStylist = await getStylistById(stylistId);
  return { res: RETURN_CODES.SUCCESS, stylist: updatedStylist };
};

export const getStylistById = async (stylistId) => {
  const stylist = await Stylist.findOne({ stylistId: stylistId })
    .select(
      "stylistId createdAt updatedAt saloonName contact profileUrl startTime endTime location services thumbnailUrl totalQueued queueWillEnd totalReviewed currentRating -_id"
    )
    .populate({
      path: "client",
      select: "clientId name profileUrl favouriteStylists -_id",
    });
  return stylist;
};

export const createStylist = async (data) => {
  const firstName = data.firstName;
  const lastName = data.lastName;
  const saloonName = data.saloonName;

  if (data.registrationType === "EMAIL_REGISTRATION") {
    const email = data.email;
    let currentClient = await Client.findOne({
      "contact.email.email": email,
    }).populate("user");

    if (currentClient && currentClient.user.role === "STYLIST") {
      return { res: RETURN_CODES.STYLIST_ALREADY_REGISTERED };
    }

    const requestCount = await OtpVerification.countDocuments({
      email: email,
      type: "STYLIST_REGISTRATION",
    });

    if (requestCount >= 3) {
      return { res: RETURN_CODES.TOO_MANY_REQUESTS };
    }

    //temporary stylsit creation
    const newTempStylist = {
      tempStylistId: generateUniqueId(),
      firstName: firstName,
      lastName: lastName,
      saloonName: saloonName,
      email: email,
    };

    const savingTempStylist = new TempStylist(newTempStylist);
    const savedTempStylist = await savingTempStylist.save();

    //temporary otp creation
    const otp = generateOTP();
    const hashedOtp = await hashString(String(otp));

    const newOtpVerificationObj = {
      verificationId: generateUniqueId(),
      type: "STYLIST_REGISTRATION",
      email: email,
      otp: hashedOtp,
      status: "NOT_VERIFIED",
    };

    const savingOtp = new OtpVerification(newOtpVerificationObj);
    const savedOtp = await savingOtp.save();

    //email sending
    const subject = "OTP Verification | Hey Saloon";
    const emailBody = getEmailForLoginOtp(otp, email, subject);
    await sendEmail(email, subject, emailBody);

    if (savedOtp) {
      return { res: RETURN_CODES.SUCCESS };
    } else {
      return { res: RETURN_CODES.SERVER_ERROR };
    }
  } else if (data.registrationType === "MOBILE_REGISTRATION") {
    //need to develop the mobile registration
  }
};
