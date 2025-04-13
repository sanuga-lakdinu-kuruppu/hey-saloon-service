import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AWS from "aws-sdk";
const ses = new AWS.SES();

export const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000);
};

export const generateUniqueId = () => {
  return uuidv4();
};

export const hashString = async (string) => {
  const saltRounds = 10;
  const hashedValue = await bcrypt.hash(string, saltRounds);
  console.log(`${string} 's hashed value =====>>> ${hashedValue}`);
  return hashedValue;
};

export const compareHash = async (string1, string2) => {
  return await bcrypt.compare(string1, string2);
};

export const generateAccessToken = (clientId, stylistId, role) => {
  const payload = { clientId: clientId, stylistId: stylistId, role: role };
  const expireTime = process.env.ACCESS_TOKEN_EXPIRES_IN;
  const secret = process.env.JWT_SECRET;
  return generateToken(expireTime, payload, secret);
};

export const generateRefreshToken = (clientId, stylistId, role) => {
  const payload = { clientId: clientId, stylistId: stylistId, role: role };
  const expireTime = process.env.REFRESH_TOKEN_EXPIRES_IN;
  const secret = process.env.JWT_REFRESH_SECRET;
  return generateToken(expireTime, payload, secret);
};

export const generateToken = (expireTime, payload, secret) => {
  const token = jwt.sign(payload, secret, {
    expiresIn: expireTime,
  });
  return token;
};

export const sendEmail = async (to, subject, body) => {
  const params = {
    Source: process.env.FROM_EMAIL,
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Subject: {
        Data: subject,
      },
      Body: {
        Html: {
          Data: body,
        },
      },
    },
  };

  await ses.sendEmail(params).promise();
};
