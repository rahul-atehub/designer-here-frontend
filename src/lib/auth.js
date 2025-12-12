import { cookies } from "next/headers";
import axios from "axios";
import { API } from "@/config"; // your backend routes

/**
 * Reads HttpOnly cookie on server and fetches user from backend.
 * Returns: user object OR null.
 */
export async function getUserFromServer() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value ?? null;

    // No cookie → guest
    if (!token) return null;

    // Call backend using server-side axios (no CORS issues)
    const res = await axios.get(API.PROFILE.ME, {
      headers: {
        Cookie: `token=${token}`,
      },
      withCredentials: true,
    });

    const data = res?.data?.data ?? res?.data ?? null;
    return {
      _id: data._id,
      username: data.username,
      email: data.email,
      role: data.role,
    };
  } catch (err) {
    return null; // invalid token, expired, backend error → guest
  }
}
