// config.js

import { LogOut } from "lucide-react";

export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL; // backend base url
export const SOCKET_IO_URL = process.env.NEXT_PUBLIC_SOCKET_IO_URL; // backend socket url

export const API = {
  BASE_URL,
  SOCKET_IO_URL,

  AUTH: {
    LOGIN: `${BASE_URL}${process.env.NEXT_PUBLIC_AUTH_LOGIN_ENDPOINT}`,
    LOGOUT: `${BASE_URL}${process.env.NEXT_PUBLIC_AUTH_LOGOUT_ENDPOINT}`,
    SIGNUP: `${BASE_URL}${process.env.NEXT_PUBLIC_AUTH_SIGNUP_ENDPOINT}`,
    SEND_VERIFICATION: `${BASE_URL}${process.env.NEXT_PUBLIC_AUTH_SEND_VERIFICATION_ENDPOINT}`,
    VERIFY: `${BASE_URL}${process.env.NEXT_PUBLIC_AUTH_VERIFY_ENDPOINT}`,
  },

  USER: {
    PROFILE: `${BASE_URL}${process.env.NEXT_PUBLIC_USER_PROFILE_ENDPOINT}`,
    DELETE: `${BASE_URL}${process.env.NEXT_PUBLIC_USER_DELETE_ENDPOINT}`,
    CHANGE_PASSWORD: `${BASE_URL}${process.env.NEXT_PUBLIC_ADMIN_CHANGE_PASSWORD_ENDPOINT}`, // to change the password .
    DELETE_ACCOUNT: `${BASE_URL}${process.env.NEXT_PUBLIC_ADMIN_DELETE_ACCOUNT_ENDPOINT}`,
    DEACTIVATE_ACCOUNT: `${BASE_URL}${process.env.NEXT_PUBLIC_ADMIN_DEACTIVATE_ACCOUNT_ENDPOINT}`,
    STATE: `${BASE_URL}${process.env.NEXT_PUBLIC_USER_STATE_ENDPOINT}`, // this doesn't exist anywhere in the backend or env file.
  },

  ADMIN: {
    PROFILE: `${BASE_URL}${process.env.NEXT_PUBLIC_ADMIN_PROFILE_ENDPOINT}`, //to fecth admin profile and also update it.
    BLOCK_USER: `${BASE_URL}${process.env.NEXT_PUBLIC_ADMIN_BLOCK_USER_ENDPOINT}`,
    UNBLOCK_USER: `${BASE_URL}${process.env.NEXT_PUBLIC_ADMIN_UNBLOCK_USER_ENDPOINT}`,
    USERS: `${BASE_URL}${process.env.NEXT_PUBLIC_ADMIN_USERS_ENDPOINT}`, // to fetch all the users.
    // all the endpoints exist in the settings file and profile/admin page.
    //
  },

  PROFILE: {
    ME: `${BASE_URL}${process.env.NEXT_PUBLIC_PROFILE_ME_ENDPOINT}`, // get current user and role
  },
  PORTFOLIO: {
    LIST: `${BASE_URL}${process.env.NEXT_PUBLIC_PORTFOLIO_ENDPOINT}`, // fetch all portfolios
    UPLOAD: `${BASE_URL}${process.env.NEXT_PUBLIC_PORTFOLIO_ENDPOINT}/upload`, // create a new portfolio (POST)
    DELETE: (id) =>
      `${BASE_URL}${process.env.NEXT_PUBLIC_PORTFOLIO_ENDPOINT}/${id}`,
    UPDATE: (id) =>
      `${BASE_URL}${process.env.NEXT_PUBLIC_PORTFOLIO_ENDPOINT}/${id}/update`,
    TOGGLE_VISIBILITY: (id) =>
      `${BASE_URL}${process.env.NEXT_PUBLIC_PORTFOLIO_ENDPOINT}/${id}/visibility`,
    // delete and toggle visiblity are handled by the same file, but they're still written separately for clarity like this.
  },

  LIKES: {
    LIST: `${BASE_URL}${process.env.NEXT_PUBLIC_LIKED_LIST_ENDPOINT}`, // to fetch all the liked posts of a user.
    LIKE_POST: (postID) =>
      `${BASE_URL}${process.env.NEXT_PUBLIC_LIKED_ENDPOINT}/${postID}`, // for likes count on a post
    ADD_LIKE: `${BASE_URL}${process.env.NEXT_PUBLIC_LIKED_ENDPOINT}`, // to like/unlike a post, also chekcs if the user liked the post or not.
    // the list is for fetch all the liked posts of a user, and adn the rest are for count and like a post.
  },

  SAVED: {
    LIST: `${BASE_URL}${process.env.NEXT_PUBLIC_SAVED_USER_ENDPOINT}`, // to get all the saved posts of the user.
    SAVE_POST: `${BASE_URL}${process.env.NEXT_PUBLIC_SAVE_POST_ENDPOINT}`, // to save/unsave a post.
  },

  SEARCH: {
    SEARCH: `${BASE_URL}${process.env.NEXT_PUBLIC_SEARCH_ENDPOINT}`, //to post search queries to the db.
    RECENT: `${BASE_URL}${process.env.NEXT_PUBLIC_RECENT_SEARCH_ENDPOINT}`, // to fetch recent searches of the user.
    TRENDING: `${BASE_URL}${process.env.NEXT_PUBLIC_TRENDING_SEARCH_ENDPOINT}`, // to fetch trending searches.
  },

  CONTACT: `${BASE_URL}${process.env.NEXT_PUBLIC_CONTACT_ENDPOINT}`,
  EMAIL: `${BASE_URL}${process.env.NEXT_PUBLIC_CONTACT_EMAIL_ENDPOINT}`,

  CHAT: {
    MESSAGES: (chatID) =>
      `${BASE_URL}${process.env.NEXT_PUBLIC_MESSAGES_CHAT_ENDPOINT}/${chatID}`, // for fetch a chat, send a message, delete a message, can used in chat header.
    MESSAGES_ARCHIVE: (chatID) =>
      `${BASE_URL}${process.env.NEXT_PUBLIC_MESSAGES_CHAT_ENDPOINT}/${chatID}/archieve`, // for archieve/unarchieve a chat
    MESSAGES_BLOCK: (chatID) =>
      `${BASE_URL}${process.env.NEXT_PUBLIC_MESSAGES_CHAT_ENDPOINT}/${chatID}/block`, // for block/unblock a chat
    MESSAGES_ADMIN: `${BASE_URL}${process.env.NEXT_PUBLIC_MESSAGES_ADMIN_ENDPOINT}`, // Fetch admin dashboard data, chats, users, analytics
    MESSAGES_CHATS: `${BASE_URL}${process.env.NEXT_PUBLIC_MESSAGES_CHATS_ENDPOINT}`, // to fetch all chats and create a new one.[it'll be used for admin only.]
    MESSAGES_READ: (chatID) =>
      `${BASE_URL}${process.env.NEXT_PUBLIC_MESSAGES_READ_ENDPOINT}/${chatID}`, // to mark messages as read.[read only]
    MESSAGES_STATS: `${BASE_URL}${process.env.NEXT_PUBLIC_MESSAGES_STATS_ENDPOINT}`, // Get overall chat statistics. [don't know the use .]
    MESSAGES_USER_CHATS: (userID) =>
      `${BASE_URL}${process.env.NEXT_PUBLIC_USER_CHATS_ENDPOINT}/${userID}`, // to fetch his chat with admin.[debatable]
    MESSAGE_USERS_SEARCH: `${BASE_URL}${process.env.NEXT_PUBLIC_MESSAGES_USER_SEARCH_ENDPOINT}`, // to search user's inbox. [make it admin only.]
    MESSAGES_SEND: `${BASE_URL}${process.env.NEXT_PUBLIC_MESSAGES_SEND_ENDPOINT}`, // for sending messages through contact form or inbox.
  },
};

// make a api endpoint for searchbar.
