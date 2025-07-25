import api from './api';

export const postService = {
  // Get all posts
  getAllPosts: async () => {
    try {
      const response = await api.get('/posts');
      return response.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error.response?.data || error.message;
    }
  },

  // Get a single post by ID
  getPostById: async (id) => {
    try {
      const response = await api.get(`/posts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching post ${id}:`, error);
      throw error.response?.data || error.message;
    }
  },

  // Create a new post
  createPost: async (postData) => {
    try {
      const response = await api.post('/posts', { post: postData });
      return response.data;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error.response?.data || error.message;
    }
  },

  // Update an existing post
  updatePost: async (id, postData) => {
    try {
      const response = await api.patch(`/posts/${id}`, { post: postData });
      return response.data;
    } catch (error) {
      console.error(`Error updating post ${id}:`, error);
      throw error.response?.data || error.message;
    }
  },

  // Delete a post
  deletePost: async (id) => {
    try {
      await api.delete(`/posts/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting post ${id}:`, error);
      throw error.response?.data || error.message;
    }
  },

  // Get current user's posts
  getMyPosts: async () => {
    try {
      const response = await api.get('/my_posts');
      return response.data;
    } catch (error) {
      console.error('Error fetching user\'s posts:', error);
      throw error.response?.data || error.message;
    }
  }
};

export default postService;
