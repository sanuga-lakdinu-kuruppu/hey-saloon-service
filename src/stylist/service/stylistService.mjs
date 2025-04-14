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
