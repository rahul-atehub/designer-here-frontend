class PostsManager {
  constructor() {
    this.likedPosts = new Set(); // start empty
    this.savedPosts = new Set();
    this.subscribers = new Set();
  }

  _loadFromStorage(key) {
    if (typeof window === "undefined") return []; // server-safe
    try {
      return JSON.parse(localStorage.getItem(key)) || [];
    } catch {
      return [];
    }
  }

  _saveToStorage(key, data) {
    if (typeof window === "undefined") return; // server-safe
    localStorage.setItem(key, JSON.stringify([...data]));
  }

  async syncWithBackend(userId) {
    try {
      const endpoint = process.env.NEXT_PUBLIC_USER_STATE_ENDPOINT.replace(
        "{userId}",
        userId
      );
      const res = await fetch(endpoint);
      const data = await res.json();

      this.likedPosts = new Set(data.likedPosts || []);
      this.savedPosts = new Set(data.savedPosts || []);

      this._saveToStorage("likedPosts", this.likedPosts);
      this._saveToStorage("savedPosts", this.savedPosts);

      this.notify();
      return data;
    } catch (err) {
      console.error("Failed to sync with backend:", err);
      return { likedPosts: [], savedPosts: [] };
    }
  }

  getLikedPosts() {
    if (this.likedPosts.size === 0) {
      this.likedPosts = new Set(this._loadFromStorage("likedPosts"));
    }
    return [...this.likedPosts];
  }

  getSavedPosts() {
    if (this.savedPosts.size === 0) {
      this.savedPosts = new Set(this._loadFromStorage("savedPosts"));
    }
    return [...this.savedPosts];
  }

  toggleLike(postId) {
    if (this.likedPosts.has(postId)) {
      this.likedPosts.delete(postId);
    } else {
      this.likedPosts.add(postId);
    }
    this._saveToStorage("likedPosts", this.likedPosts);
    this.notify();
  }

  toggleSave(postId) {
    if (this.savedPosts.has(postId)) {
      this.savedPosts.delete(postId);
    } else {
      this.savedPosts.add(postId);
    }
    this._saveToStorage("savedPosts", this.savedPosts);
    this.notify();
  }

  isLiked(postId) {
    return this.likedPosts.has(postId);
  }

  isSaved(postId) {
    return this.savedPosts.has(postId);
  }

  subscribe(callback) {
    this.subscribers.add(callback);
  }

  unsubscribe(callback) {
    this.subscribers.delete(callback);
  }

  notify() {
    this.subscribers.forEach((cb) => cb());
  }
}

const postsManager = new PostsManager();
export default postsManager;
