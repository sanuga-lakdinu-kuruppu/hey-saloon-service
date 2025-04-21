import { RETURN_CODES } from "../../common/error/returnCodes.mjs";
import {
  compareHash,
  generateAccessToken,
  generateOTP,
  generateRefreshToken,
  generateUniqueId,
  hashString,
  sendEmail,
  verifyRefreshToken,
} from "../../common/utility/commonUtility.mjs";
import { OtpVerification } from "../../otpVerification/model/otpVerificationModel.mjs";
import { Client } from "../../client/model/clientModel.mjs";
import { User } from "../../user/model/userModel.mjs";
import { getEmailForLoginOtp } from "../../common/templates/emailTemplate.mjs";

export const login = async (data) => {
  if (data.loginType === "EMAIL_LOGIN") {
    const email = data.email;

    const requestCount = await OtpVerification.countDocuments({
      email: email,
      type: "REGULAR_AUTH",
    });

    if (requestCount >= 3) {
      return { res: RETURN_CODES.TOO_MANY_REQUESTS };
    }

    const otp = generateOTP();
    const hashedOtp = await hashString(String(otp));

    const newOtpVerificationObj = {
      verificationId: generateUniqueId(),
      type: "REGULAR_AUTH",
      email: email,
      otp: hashedOtp,
      status: "NOT_VERIFIED",
    };

    const savingOtp = new OtpVerification(newOtpVerificationObj);
    const savedOtp = await savingOtp.save();

    const subject = "OTP Verification | Hey Saloon";
    const emailBody = getEmailForLoginOtp(otp, email, subject);
    await sendEmail(email, subject, emailBody);

    if (savedOtp) {
      return { res: RETURN_CODES.SUCCESS };
    } else {
      return { res: RETURN_CODES.SERVER_ERROR };
    }
  } else if (data.loginType === "MOBILE_LOGIN") {
    //need to handle the mobile login
  }
};

export const getNewAccessToken = async (token) => {
  try {
    const payload = verifyRefreshToken(token);

    const { accessToken, refreshToken } = getTokens(
      payload.clientId,
      payload.stylistId,
      payload.role,
      payload.firstName,
      payload.lastName,
      payload.imageUrl
    );
    return {
      res: RETURN_CODES.SUCCESS,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  } catch (error) {
    return { res: RETURN_CODES.UNAUTHORIED };
  }
};

export const getTokens = (
  clientId,
  stylistId,
  role,
  firstName,
  lastName,
  imageUrl
) => {
  const accessToken = generateAccessToken(
    clientId,
    stylistId,
    role,
    firstName,
    lastName,
    imageUrl
  );
  const refreshToken = generateRefreshToken(
    clientId,
    stylistId,
    role,
    firstName,
    lastName,
    imageUrl
  );
  return { accessToken, refreshToken };
};
