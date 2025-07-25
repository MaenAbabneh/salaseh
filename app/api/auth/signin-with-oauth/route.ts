import { handleError } from "@/lib/handler/error";
import { ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { SigninWithOauthSchema } from "@/lib/validatoin";
import { APIErrorResponse } from "@/types/global";
import User from "@/database/user.model";
import mongoose from "mongoose";
import slugify from "slugify";
import Account from "@/database/account.model";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { provider, providerAccountId, user } = await request.json();

  await dbConnect();

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const validatedData = SigninWithOauthSchema.safeParse({
      provider,
      providerAccountId,
      user,
    });
    if (!validatedData.success)
      throw new ValidationError(validatedData.error.flatten().fieldErrors);

    const { email, username, name, image } = user;

    const slugfiyusername = slugify(username, {
      lower: true,
      strict: true,
      trim: true,
    });

    let existingUser = await User.findOne({ email }).session(session);

    if (!existingUser) {
      [existingUser] = await User.create(
        [
          {
            name,
            username: slugfiyusername,
            email,
            image,
          },
        ],
        { session }
      );
    } else {
      const updatedData: { name?: string; image?: string } = {};

      if (existingUser.name !== name) updatedData.name = name;
      if (existingUser.image !== image) updatedData.image = image;

      if (Object.keys(updatedData).length > 0) {
        await User.updateOne(
          { _id: existingUser._id },
          { $set: updatedData }
        ).session(session);
      }
    }

    const existingAccount = await Account.findOne({
      provider,
      providerAccountId,
      userId: existingUser._id,
    }).session(session);

    if (!existingAccount) {
      await Account.create(
        [
          {
            provider,
            providerAccountId,
            userId: existingUser._id,
            name,
            image,
          },
        ],
        { session }
      );
    }

    await session.commitTransaction();

    return NextResponse.json({
      success: true,
    });
  } catch (error: unknown) {
    await session.abortTransaction();
    return handleError(error, "api") as APIErrorResponse;
  } finally {
    await session.endSession();
  }
}
