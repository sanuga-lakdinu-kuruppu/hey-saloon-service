import {
  compareHash,
  generateAccessToken,
  generateRefreshToken,
  generateUniqueId,
} from "../../common/utility/commonUtility.mjs";
import { OtpVerification } from "../model/otpVerificationModel.mjs";
import { RETURN_CODES } from "../../common/error/returnCodes.mjs";
import { Client } from "../../client/model/clientModel.mjs";
import { User } from "../../user/model/userModel.mjs";
import { TempStylist } from "../../stylist/model/tempStylistModel.mjs";
import { Stylist } from "../../stylist/model/stylistModel.mjs";

export const verifyStylistRegistration = async (data) => {
  if (data.registrationType === "EMAIL_REGISTRATION") {
    const email = data.email;
    const otp = data.otp;
    const otpRecord = await OtpVerification.find({
      type: "STYLIST_REGISTRATION",
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

    const tempStylists = await TempStylist.find({
      email: email,
    })
      .sort({ createdAt: -1 })
      .limit(1)
      .exec();
    const tempStylist = tempStylists[0];

    let currentClient = await Client.findOne({
      "contact.email.email": email,
    }).populate("user");

    let thisClient;
    let thisStylist;
    let thisUser;

    if (currentClient && currentClient.user.role === "CLIENT") {
      //existing client need to be a stylist

      const roleUpdate = {
        role: "STYLIST",
      };
      thisUser = await User.findByIdAndUpdate(
        currentClient.user._id,
        roleUpdate,
        {
          new: true,
          runValidators: true,
        }
      );
      thisClient = currentClient;

      const newStylist = {
        stylistId: generateUniqueId(),
        saloonName: tempStylist.saloonName,
        client: thisClient._id,
        location: {
          type: "Point",
          coordinates: [0, 0],
        },
        thumbnailUrl: process.env.DEFAULT_THUMBNAIL_URL,
        isOpen: false,
      };

      const savingStylist = new Stylist(newStylist);
      thisStylist = await savingStylist.save();
    } else {
      //new stylist
      const newUser = {
        userId: generateUniqueId(),
        role: "STYLIST",
        firstLogin: new Date(),
        lastLogin: new Date(),
        loginCount: 1,
        isDisabled: false,
        isDeleted: false,
      };

      const savingUser = new User(newUser);
      thisUser = await savingUser.save();

      //new client creation
      const newClient = {
        clientId: generateUniqueId(),
        user: thisUser._id,
        name: {
          firstName: tempStylist.firstName,
          lastName: tempStylist.lastName,
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
      thisClient = await savingClient.save();

      const newStylist = {
        stylistId: generateUniqueId(),
        saloonName: tempStylist.saloonName,
        client: thisClient._id,
        location: {
          type: "Point",
          coordinates: [0, 0],
        },
        thumbnailUrl: process.env.DEFAULT_THUMBNAIL_URL,
        isOpen: false,
      };

      const savingStylist = new Stylist(newStylist);
      thisStylist = await savingStylist.save();
    }

    const { accessToken, refreshToken } = getTokens(
      thisClient.clientId,
      thisStylist.stylistId,
      thisUser.role
    );

    return {
      res: RETURN_CODES.SUCCESS,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  } else if (data.registrationType === "MOBILE_REGISTRATION") {
  }
};

export const verifyRegularAuth = async (data) => {
  if (data.loginType === "EMAIL_LOGIN") {
    return await verifyEmailOtp(data);
  } else if (data.loginType === "MOBILE_LOGIN") {
    //need to handle the mobile login
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
      const existingStylist = await Stylist.findOne({
        client: currentClient._id,
      });
      thisStylistId = existingStylist.stylistId;
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
    currentUser.role,
    currentClient.name.firstName,
    currentClient.name.lastName,
    currentClient.profileUrl
  );

  return {
    res: RETURN_CODES.SUCCESS,
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
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
