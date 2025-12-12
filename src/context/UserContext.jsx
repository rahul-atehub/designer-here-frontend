"use client";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import axios from "axios";
import { API } from "@/config";

const UserContext = createContext(null);
export function UserProvider({ children, serverUser = undefined }) {
  // serverUser === undefined -> no server info (client-only), keep loading true until fetch
  // serverUser === null -> server confirmed "not logged in" (no flash)
  const [user, setUserInternal] = useState(
    serverUser === undefined ? null : serverUser
  );

  const [loading, setLoading] = useState(
    serverUser === undefined ? true : false
  );

  const [error, setError] = useState(null);
  // short grace window to avoid long "checking session" flicker
  const GRACE_MS = 700; // tune (500-800ms)

  const [gracePassed, setGracePassed] = useState(serverUser !== undefined);

  // sequence guard to ignore stale fetchProfile responses
  const fetchSeq = useRef(0);

  // wrapped setter — logs stack trace so we can see who called setUser(...)
  const setUser = (next) => {
    try {
      console.groupCollapsed("[UserProvider] setUser CALLED with:", next);
      console.trace();
      console.groupEnd();
    } catch (e) {
      // ignore console errors in older browsers
      console.log("[UserProvider] setUser CALLED (trace failed)", next);
    }
    setUserInternal(next);
  };

  const fetchProfile = async () => {
    const seq = ++fetchSeq.current;
    console.log("[UserProvider] fetchProfile START seq=", seq, { serverUser });

    try {
      setLoading(true);

      const res = await axios.get(API.PROFILE.ME, {
        withCredentials: true,
      });

      console.log("[UserProvider] axios.get RESPONSE", res.status);

      // ignore if a later fetch was started
      if (seq !== fetchSeq.current) {
        console.log(
          "[UserProvider] Ignoring stale fetchProfile response seq",
          seq
        );
        return;
      }

      const data = res?.data?.data ?? res?.data ?? null;
      // use wrapped setter so trace is emitted
      setUser(data);

      setError(null);
    } catch (err) {
      // ignore if a later fetch was started
      if (seq !== fetchSeq.current) {
        console.log(
          "[UserProvider] Ignoring stale fetchProfile error seq",
          seq
        );
        return;
      }

      // Log the error details for debugging
      const status = err?.response?.status ?? null;
      console.error(
        "[UserProvider] fetchProfile ERROR",
        status,
        err?.message ?? err
      );
      setError({
        message: err?.message ?? "Unknown error",
        status,
        data: err?.response?.data ?? null,
      });

      // Only clear the user for authentication errors (401 / 403).
      if (status === 401 || status === 403) {
        setUser(null);
      }
    } finally {
      if (seq === fetchSeq.current) setLoading(false);
      console.log("[UserProvider] fetchProfile DONE seq", seq, { loading });
    }
  };

  useEffect(() => {
    // If SSR provided the user, do NOT fetch again immediately
    if (serverUser !== undefined) return;

    // Client-only: Fetch user on first mount
    fetchProfile();
  }, [serverUser]);

  // manage grace window: if serverUser provided or loading finished, mark gracePassed true
  useEffect(() => {
    if (serverUser !== undefined) {
      setGracePassed(true);
      return;
    }
    if (!loading) {
      setGracePassed(true);
      return;
    }
    setGracePassed(false);
    const t = setTimeout(() => setGracePassed(true), GRACE_MS);
    return () => clearTimeout(t);
  }, [loading, serverUser]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "logout") {
        try {
          console.groupCollapsed("[UserProvider] storage logout event", e);
          console.trace();
          console.groupEnd();
        } catch (traceErr) {
          console.log("[UserProvider] storage logout event", e);
        }
        setUser(null);
        setLoading(false);
      }
    };
    window.addEventListener("storage", onStorage);

    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const logout = async () => {
    try {
      // 1) Call backend to clear HttpOnly cookie
      await axios.post(API.AUTH.LOGOUT, {}, { withCredentials: true });

      // 2) Clear client-side stored tokens (if any)
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.clear();

      // 3) Remove global axios Authorization header (if you ever set it)
      if (axios.defaults.headers?.common?.Authorization) {
        delete axios.defaults.headers.common["Authorization"];
      }

      // 4) Reset React state
      setUser(null);
      setLoading(false); // <- ensure consumers know auth check finished

      // 5) Tell other tabs user logged out (with trace)
      try {
        console.groupCollapsed("[UserProvider] writing logout marker");
        console.trace();
        console.groupEnd();
        localStorage.setItem("logout", Date.now().toString());
      } catch (e) {
        /* ignore storage errors */
      }
    } catch (err) {
      console.error("Logout failed:", err);

      // Best effort cleanup
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.clear();
      if (axios.defaults.headers?.common?.Authorization) {
        delete axios.defaults.headers.common["Authorization"];
      }
      setUser(null);
      setLoading(false); // <- also ensure loading false on error
      try {
        console.groupCollapsed(
          "[UserProvider] writing logout marker (error branch)"
        );
        console.trace();
        console.groupEnd();
        localStorage.setItem("logout", Date.now().toString());
      } catch (e) {
        /* ignore storage errors */
      }
    }
  };

  // Memoize value to avoid unnecessary re-renders of consumers

  const value = useMemo(() => {
    return {
      user,
      loading,
      error,
      setUser,
      refetchProfile: fetchProfile,
      logout,
      gracePassed,
      hasServerUser: serverUser !== undefined,
    };
  }, [user, loading, error, serverUser, gracePassed]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  return useContext(UserContext);
}
