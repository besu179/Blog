import api from './api';

export const commentService = {
  // Get all comments
  getAllComments: async () => {
    try {
      const response = await api.get('/comments');
      return response.data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error.response?.data || error.message;
    }
  },

  // Get a single comment by ID
  getCommentById: async (id) => {
    try {
      const response = await api.get(`/comments/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching comment ${id}:`, error);
      throw error.response?.data || error.message;
    }
  },

  // Create a new comment
  createComment: async (commentData) => {
    try {
      const response = await api.post('/comments', { comment: commentData });
      return response.data;
    } catch (error) {
      console.error('Error creating comment:', error);
      throw error.response?.data || error.message;
    }
  },

  // Delete a comment
  deleteComment: async (id) => {
    try {
      await api.delete(`/comments/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting comment ${id}:`, error);
      throw error.response?.data || error.message;
    }
  }
};

export default commentService;
