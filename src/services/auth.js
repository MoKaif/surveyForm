import { Account } from "appwrite";
import client from "./appwrite";

const account = new Account(client);

export const login = (email, password) =>
  account.createEmailPasswordSession(email, password);

export const signup = (email, password) => {
  // Generate a unique user ID (Appwrite v8+ requires this)
  const userId = "user_" + Math.random().toString(36).slice(2);
  return account.create(userId, email, password);
};

export const logout = () => account.deleteSession("current");

export const getCurrentUser = () => account.get();
