import express from "express";
import { Secret, verify } from "jsonwebtoken";
import { createAccessToken, sendRefreshToken } from "../utils/auth";
import { User } from "../entities/User";
import { UserAuthPayload } from "../types/UserAuthPayload";

const router = express.Router();

// Router get refresh token
router.get("/", async (req, res) => {
  const refreshToken = req.cookies[process.env.REFRESH_TOKEN_COOKIE as string]
  if (!refreshToken) {
    return res.sendStatus(401).json({ success: false, accessToken: "Something went w4rong" });
  }

  try {
    const decodedUser = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as Secret) as UserAuthPayload
    const existUser = await User.findOne({ where: { id: decodedUser.userId } })

    // token version from params !== decoded user token -> unauthen
    if (!existUser || existUser.tokenVersion !== decodedUser.tokenVersion) {
      // check token version in the frontend and server
      return res.sendStatus(401).json({ success: false, accessToken: null });
    }

    sendRefreshToken(res, existUser);

    return res.json({
      success: true, 
      accessToken: createAccessToken('accessToken', existUser)
    });

  } catch (error) {
    console.log('INTERNAL SERVER ERROR', error);
    return res.json({ success: false, message: "Something went wrong", accessToken: null });
  }

});

export default router;
