export const BASE_URL =
  process.env.NODE_ENV === "development" ? "http://localhost:5001" : "";
export const AUTH_URL = "/api/auth";
export const USERS_URL = "/api/users";
export const LISTS_URL = "/api/listings";
export const UPLOADS_URL = "/api/uploads";
