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

    return "SUCCESS";
  }
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
