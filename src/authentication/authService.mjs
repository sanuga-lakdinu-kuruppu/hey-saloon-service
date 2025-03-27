import { Otp } from "./otpModel.mjs";
import { v4 as uuidv4 } from "uuid";
import { User } from "../user/userModel.mjs";
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
  if (data.type == "EMAIL_LOGIN") {
    const foundOtps = await Otp.find({
      email: data.email,
    })
      .sort({ createdAt: -1 })
      .limit(1)
      .exec();

    if (!foundOtps || foundOtps.length == 0)
      return {
        res: "1112",
      };

    const foundOtp = foundOtps[0];

    if (foundOtp.status === "VERIFIED") {
      return {
        res: "1113",
      };
    }

    if (foundOtp.otp !== String(data.otp)) {
      return {
        res: "1114",
      };
    }

    const newData = {
      status: "VERIFIED",
    };
    await Otp.findByIdAndUpdate(foundOtp._id, newData, {
      new: true,
      runValidators: true,
    });

    const session = uuidv4();
    const foundUser = await User.findOne({ email: data.email });
    if (!foundUser) {
      const user = {
        userId: generateShortUuid(),
        session: [session],
        role: "client",
        imageUrl:
          "https://i.pinimg.com/736x/f5/29/e2/f529e277826ba8aa2ad3dadc84eb8071.jpg",
        email: data.email,
        isEmailVerified: true,
      };

      const newUser = new User(user);
      await newUser.save();
      return {
        res: "0000",
        session: session,
        role: user.role,
      };
    } else {
      await User.findByIdAndUpdate(
        foundUser._id,
        { $push: { session: session } },
        {
          new: true,
          runValidators: true,
        }
      );
      return {
        res: "0000",
        session: session,
        role: foundUser.role,
      };
    }
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

export const generateShortUuid = () => {
  return Math.floor(10000000 + Math.random() * 90000000);
};

export const generateOtp = () => {
  return Math.floor(1000 + Math.random() * 9000);
};
