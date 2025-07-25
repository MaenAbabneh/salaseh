import { fetchHandler } from "./handler/fetch";
import { IUser } from "@/database/user.model";
import { IAccount } from "@/database/account.model";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

export const api = {
  auth: {
    oAuthSignIn: ({
      user,
      provider,
      providerAccountId,
    }: SignInWithOauthParams) =>
      fetchHandler(`${API_BASE_URL}/auth/signin-with-oauth`, {
        method: "POST",
        body: JSON.stringify({ user, provider, providerAccountId }),
      }),
    forgotPassword: ({ email }: { email: string }) =>
      fetchHandler(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        body: JSON.stringify({ email }),
      }),
    resetPassword: ({
      password,
      token,
      confirmPassword,
    }: {
      password: string;
      token: string;
      confirmPassword: string;
    }) =>
      fetchHandler(`${API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        body: JSON.stringify({ password, token, confirmPassword }),
      }),
  },

  users: {
    getAll: () => fetchHandler(`${API_BASE_URL}/users`),
    getById: (id: string) => fetchHandler(`${API_BASE_URL}/users/${id}`),
    getByEmail: (email: string) =>
      fetchHandler(`${API_BASE_URL}/users/email`, {
        method: "POST",
        body: JSON.stringify({ email }),
      }),
    create: (userData: Partial<IUser>) =>
      fetchHandler(`${API_BASE_URL}/users`, {
        method: "POST",
        body: JSON.stringify(userData),
      }),
    update: (id: string, userData: Partial<IUser>) =>
      fetchHandler(`${API_BASE_URL}/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(userData),
      }),
    delete: (id: string) =>
      fetchHandler(`${API_BASE_URL}/users/${id}`, {
        method: "DELETE",
      }),
  },

  account: {
    getAll: () => fetchHandler(`${API_BASE_URL}/accounts`),
    getById: (id: string) => fetchHandler(`${API_BASE_URL}/accounts/${id}`),
    getByProvider: (providerAccountId: string) =>
      fetchHandler(`${API_BASE_URL}/accounts/provider`, {
        method: "POST",
        body: JSON.stringify({ providerAccountId }),
      }),
    create: (accountData: Partial<IAccount>) =>
      fetchHandler(`${API_BASE_URL}/accounts`, {
        method: "POST",
        body: JSON.stringify(accountData),
      }),
    update: (id: string, accountData: Partial<IAccount>) =>
      fetchHandler(`${API_BASE_URL}/accounts/${id}`, {
        method: "PUT",
        body: JSON.stringify(accountData),
      }),
    delete: (id: string) =>
      fetchHandler(`${API_BASE_URL}/accounts/${id}`, {
        method: "DELETE",
      }),
  },
};
