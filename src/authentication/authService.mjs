import { Otp } from "./otpModel.mjs";
import { getEmailForOtp } from "../template/otpEmailTemplate.mjs";
import AWS from "aws-sdk";
const ses = new AWS.SES();

export const handleAuthRequest = async (data) => {
  if (data.type == "EMAIL_LOGIN") {
    const otp = generateOtp();
    const to = data.email;

    const otpObj = {
      email: to,
      otp: otp,
      status: "NOT_VERIFIED",
    };

    const newOtp = new Otp(otpObj);
    await newOtp.save();

    const email = getEmailForOtp(otp, to);
    await sendOtpEmail(to, email);

    return "0000";
  }
};

export const verifyOtp = async (data) => {
  const foundOtps = await Otp.find({
    email: data.email,
  })
    .sort({ createdAt: -1 })
    .limit(1)
    .exec();

  if (!foundOtps || foundOtps.length == 0) return "1112";

  const foundOtp = foundOtps[0];

  if (foundOtp.status === "VERIFIED") {
    return "1113";
  }

  if (foundOtp.otp !== String(data.otp)) {
    return "1114";
  }

  const newData = {
    status: "VERIFIED",
  };
  await Otp.findByIdAndUpdate(foundOtp._id, newData, {
    new: true,
    runValidators: true,
  });

  return "0000";
};

const sendOtpEmail = async (to, body) => {
  const params = {
    Source: process.env.FROM_EMAIL,
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Subject: {
        Data: "OTP Verification | Hey Saloon",
      },
      Body: {
        Html: {
          Data: body,
        },
      },
    },
  };

  const res = await ses.sendEmail(params).promise();
};

export const generateOtp = () => {
  return Math.floor(1000 + Math.random() * 9000);
};
