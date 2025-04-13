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
import { OtpVerification } from "../model/otpVerificationModel.mjs";
import { Client } from "../../client/model/clientModel.mjs";
import { User } from "../../user/model/userModel.mjs";
import { getEmailForLoginOtp } from "../../common/templates/emailTemplate.mjs";

export const login = async (data) => {
  if (data.type === "EMAIL_LOGIN") {
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
  } else if (data.type === "MOBILE_LOGIN") {
    //need to handle the mobile login
  }
};

export const verify = async (data) => {
  if (data.type === "EMAIL_LOGIN") {
    return await verifyEmailOtp(data);
  } else if (data.type === "MOBILE_LOGIN") {
    //need to handle the mobile login
  }
};

export const getNewAccessToken = async (token) => {
  try {
    const payload = verifyRefreshToken(token);

    const { accessToken, refreshToken } = getTokens(
      payload.clientId,
      payload.stylistId,
      payload.role
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

export const verifyEmailOtp = async (data) => {
  const email = data.email;
  const otp = data.otp;
  const otpRecord = await OtpVerification.find({
    type: "REGULAR_AUTH",
    email: email,
  })
    .sort({ createdAt: -1 })
    .limit(1)
    .exec();

  if (!otpRecord || otpRecord.length == 0) {
    return { res: RETURN_CODES.OTP_EXPIRED };
  }

  const foundOtp = otpRecord[0];
  if (foundOtp.status === "VERIFIED") {
    return { res: RETURN_CODES.OTP_ALREADY_VERIFIED };
  }

  //otp verification
  const isMatched = await compareHash(String(otp), foundOtp.otp);
  if (!isMatched) {
    return { res: RETURN_CODES.OTP_INVALID };
  }

  //successful verifcation update status
  const statusUpdate = {
    status: "VERIFIED",
  };
  await OtpVerification.findByIdAndUpdate(foundOtp._id, statusUpdate, {
    new: true,
    runValidators: true,
  });

  let currentClient = await Client.findOne({
    "contact.email.email": email,
  }).populate("user");

  let thisStylistId;
  let currentUser;

  if (currentClient) {
    //existing user
    currentUser = currentClient.user;
    if (currentUser.isDisabled) {
      return { res: RETURN_CODES.USER_DISABLED };
    }

    if (currentUser.isDeleted) {
      return { res: RETURN_CODES.USER_DELETED };
    }

    const updatingData = {
      lastLogin: new Date(),
      loginCount: currentClient.user.loginCount + 1,
    };

    await User.findByIdAndUpdate(currentClient.user._id, updatingData, {
      new: true,
      runValidators: true,
    });

    if (currentClient.user.role === "STYLIST") {
      thisStylistId = 432;
    }
  } else {
    //new user creation
    const newUser = {
      userId: generateUniqueId(),
      role: "CLIENT",
      firstLogin: new Date(),
      lastLogin: new Date(),
      loginCount: 1,
      isDisabled: false,
      isDeleted: false,
    };

    const savingUser = new User(newUser);
    const savedUser = await savingUser.save();

    //new client creation
    const newClient = {
      clientId: generateUniqueId(),
      user: savedUser._id,
      name: {
        firstName: "",
        lastName: "",
      },
      contact: {
        email: {
          email: email,
          isVerified: true,
        },
      },
      profileUrl: process.env.DEFAULT_PROFILE_URL,
      favouriteStylists: [],
    };

    const savingClient = new Client(newClient);
    const savedClient = await savingClient.save();
    currentClient = savedClient;
    currentUser = savedUser;
  }

  const { accessToken, refreshToken } = getTokens(
    currentClient.clientId,
    thisStylistId,
    currentUser.role
  );

  return {
    res: RETURN_CODES.SUCCESS,
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
};

export const getTokens = (clientId, stylistId, role) => {
  const accessToken = generateAccessToken(clientId, stylistId, role);
  const refreshToken = generateRefreshToken(clientId, stylistId, role);
  return { accessToken, refreshToken };
};
