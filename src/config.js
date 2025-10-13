// ...existing code...
export const API = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  SOCKET_IO_URL: process.env.NEXT_PUBLIC_SOCKET_IO_URL,
  AUTH: {
    LOGIN: process.env.NEXT_PUBLIC_AUTH_LOGIN_ENDPOINT,
    SIGNUP: process.env.NEXT_PUBLIC_AUTH_SIGNUP_ENDPOINT,
    SEND_VERIFICATION: process.env.NEXT_PUBLIC_AUTH_SEND_VERIFICATION_ENDPOINT,
    VERIFY: process.env.NEXT_PUBLIC_AUTH_VERIFY_ENDPOINT,
  },
  USER: {
    PROFILE: process.env.NEXT_PUBLIC_USER_PROFILE_ENDPOINT,
    DELETE: process.env.NEXT_PUBLIC_USER_DELETE_ENDPOINT,
    CHANGE_PASSWORD: process.env.NEXT_PUBLIC_ADMIN_CHANGE_PASSWORD_ENDPOINT, // to change the password .
    DELETE_ACCOUNT: process.env.NEXT_PUBLIC_ADMIN_DELETE_ACCOUNT_ENDPOINT,
    DEACTIVATE_ACCOUNT:
      process.env.NEXT_PUBLIC_ADMIN_DEACTIVATE_ACCOUNT_ENDPOINT,
    STATE: process.env.NEXT_PUBLIC_USER_STATE_ENDPOINT, // this doesn't exist anywhere in the backend or env file.
  },
  ADMIN: {
    PROFILE: process.env.NEXT_PUBLIC_ADMIN_PROFILE_ENDPOINT, //to fecth admin profile and also update it.
    BLOCK_USER: process.env.NEXT_PUBLIC_ADMIN_BLOCK_USER_ENDPOINT,
    UNBLOCK_USER: process.env.NEXT_PUBLIC_ADMIN_UNBLOCK_USER_ENDPOINT,
    USERS: process.env.NEXT_PUBLIC_ADMIN_USERS_ENDPOINT, // to fetch all the users.
    // all the endpoints exist in the settings file and profile/admin page.
    //
  },

  PROFILE: {
    ME: process.env.NEXT_PUBLIC_PROFILE_ME_ENDPOINT, // get current user and role
  },

  PORTFOLIO: {
    UPLOAD: process.env.NEXT_PUBLIC_PORTFOLIO_UPLOAD_ENDPOINT,
    LIST: process.env.NEXT_PUBLIC_PORTFOLIO_LIST_ENDPOINT,
    DELETE: process.env.NEXT_PUBLIC_PORTFOLIO_DELETE_ENDPOINT,
    TOGGLE_VISIBILITY: process.env.NEXT_PUBLIC_PORTFOLIO_VISIBILITY_ENDPOINT,
    // there's no edit api here.
  },
  LIKES: {
    LIST: process.env.NEXT_PUBLIC_LIKED_LIST_ENDPOINT, // to fetch all the liked posts of a user.
    LIKE_POST: (postID) =>
      `${process.env.NEXT_PUBLIC_LIKED_ENDPOINT}/${postID}`, // for likes count on a post
    ADD_LIKE: process.env.NEXT_PUBLIC_LIKED_ENDPOINT, // to like/unlike a post, also chekcs if the user liked the post or not.
    // the list is for fetch all the liked posts of a user, and adn the rest are for count and like a post.
  },
  SAVED: {
    LIST: process.env.NEXT_PUBLIC_SAVED_USER_ENDPOINT, // to get all the saved posts of the user.
    SAVE_POST: process.env.NEXT_PUBLIC_SAVE_POST_ENDPOINT, // to save/unsave a post.
  },
  SEARCH: {
    SEARCH: process.env.NEXT_PUBLIC_SEARCH_ENDPOINT, //to post search queries to the db.
    RECENT: process.env.NEXT_PUBLICK_RECENT_SEARCH_ENDPOINT, // to fetch recent searches of the user.
    TRENDING: process.env.NEXT_PUBLIC_TRENDING_SEARCH_ENDPOINT, // to fetch trending searches.
  },

  CONTACT: process.env.NEXT_PUBLIC_CONTACT_ENDPOINT,
  EMAIL: process.env.NEXT_PUBLIC_CONTACT_EMAIL_ENDPOINT,
  CHAT: {
    MESSAGES: (chatID) =>
      `${process.env.NEXT_PUBLIC_MESSAGES_CHAT_ENDPOINT}/${chatID}`, // for fetch a chat, send a message, delete a message, can used in chat header.
    MESSAGES_ARCHIVE: (chatID) =>
      `${process.env.NEXT_PUBLIC_MESSAGES_CHAT_ENDPOINT}/${chatID}/archieve`, // for archieve/unarchieve a chat
    MESSAGES_BLOCK: (chatID) =>
      `${process.env.NEXT_PUBLIC_MESSAGES_CHAT_ENDPOINT}/${chatID}/block`, // for block/unblock a chat
    MESSAGES_ADMIN: process.env.NEXT_PUBLIC_MESSAGES_ADMIN_ENDPOINT, // Fetch admin dashboard data, chats, users, analytics
    MESSAGES_CHATS: process.env.NEXT_PUBLIC_MESSAGES_CHATS_ENDPOINT, // to fetch all chats and create a new one.[it'll be used for admin only.]
    MESSAGES_READ: (chatID) =>
      `${process.env.NEXT_PUBLIC_MESSAGES_READ_ENDPOINT}/${chatID}`, // to mark messages as read.[read only]
    MESSAGES_STATS: process.env.NEXT_PUBLIC_MESSAGES_STATS_ENDPOINT, // Get overall chat statistics. [don't know the use .]
    MESSAGES_USER_CHATS: (userID) =>
      `${process.env.NEXT_PUBLIC_USER_CHATS_ENDPOINT}/${userID}`, // to fetch his chat with admin.[debatable]
    MESSAGE_USERS_SEARCH: process.env.NEXT_PUBLIC_MESSAGES_USER_SEARCH_ENDPOINT, // to search user's inbox. [make it admin only.]
  },
};

// make a api endpoint for searchbar.
