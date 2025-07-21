"use server";

import action from "../handler/action";
import handleError from "../handler/error";
import { SignInSchema, SignUpSchema } from "../validtion";
import mongoose from "mongoose";
import User from "@/database/user.model";
import bcrypt from "bcryptjs";
import Account from "@/database/account.model";
import { signIn } from "@/auth";
import { NotFoundError } from "../http-error";
import { ActionResponse, ErrorResponse } from "@/types/globle";

export async function singUpWithCredentials(
  params: AuthCredentials
): Promise<ActionResponse> {
  const validatedRusult = await action({ params, schema: SignUpSchema });

  if (validatedRusult instanceof Error) {
    return handleError(validatedRusult) as ErrorResponse;
  }

  const { name, email, confirmPassword, password } = validatedRusult.params!;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingUser = await User.findOne({ email }).session(session);
    if (existingUser) throw new Error("User already exists");
   

    const hashedPassword = await bcrypt.hash(password, 12);

    const [newUser] = await User.create(
      [
        {
          name,
          email,
          confirmPassword,
          password: hashedPassword,
        },
      ],
      { session }
    );

    await Account.create(
      [
        {
          userId: newUser._id,
          name,
          provider: "credentials",
          providerAccountId: email,
          password: hashedPassword,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    try {
      await signIn("credentials", { email, password, redirect: false });
    } catch (signInError) {
      console.log(
        "User created successfully, but auto sign-in failed:",
        signInError
      );
    }

    return { success: true };
  } catch (error) {
    await session.abortTransaction();

    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

export async function singInWithCredentials(
  params: Pick<AuthCredentials, "email" | "password">
): Promise<ActionResponse> {
  const validatedRusult = await action({ params, schema: SignInSchema });

  if (validatedRusult instanceof Error) {
    return handleError(validatedRusult) as ErrorResponse;
  }

  const { email, password } = validatedRusult.params!;

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) throw new NotFoundError("User");

    const existingAccount = await Account.findOne({
      provider: "credentials",
      providerAccountId: email,
    });
    if (!existingAccount) throw new NotFoundError("Account");

    const passwordMatch = await bcrypt.compare(
      password,
      existingAccount.password!
    );

    if (!passwordMatch) throw new Error("Invalid password");

    await signIn("credentials", { email, password, redirect: false });

    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
