import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { postService } from '../services/postService';
import { commentService } from '../services/commentService';
import { useAuth } from '../context/AuthContext';

const PostDetail = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentError, setCommentError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        setLoading(true);
        const [postData, commentsData] = await Promise.all([
          postService.getPostById(id),
          commentService.getAllComments()
        ]);
        
        setPost(postData);
        setComments(commentsData.filter(comment => comment.post_id === parseInt(id)));
      } catch (err) {
        setError('Failed to load post. Please try again later.');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndComments();
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      setCommentError('Comment cannot be empty');
      return;
    }

    try {
      setIsSubmitting(true);
      const comment = await commentService.createComment({
        body: newComment,
        post_id: id
      });
      
      setComments([...comments, comment]);
      setNewComment('');
      setCommentError('');
    } catch (err) {
      setCommentError('Failed to add comment. Please try again.');
      console.error('Error adding comment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await commentService.deleteComment(commentId);
        setComments(comments.filter(comment => comment.id !== commentId));
      } catch (err) {
        console.error('Error deleting comment:', err);
        alert('Failed to delete comment. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger mt-4">{error}</div>;
  }

  if (!post) {
    return <div className="alert alert-warning mt-4">Post not found</div>;
  }

  return (
    <div className="container mt-4">
      <Link to="/" className="btn btn-outline-secondary mb-4">
        &larr; Back to Posts
      </Link>
      
      <article className="card mb-4">
        <div className="card-body">
          <h1 className="card-title">{post.title}</h1>
          <p className="text-muted">
            By {post.user?.name || 'Unknown'} • {new Date(post.created_at).toLocaleDateString()}
          </p>
          <div className="card-text" style={{ whiteSpace: 'pre-line' }}>
            {post.body}
          </div>
          
          {currentUser?.id === post.user_id && (
            <div className="mt-3">
              <Link to={`/edit-post/${post.id}`} className="btn btn-outline-primary btn-sm me-2">
                Edit Post
              </Link>
            </div>
          )}
        </div>
      </article>

      <section className="mt-5">
        <h3>Comments ({comments.length})</h3>
        
        {currentUser ? (
          <form onSubmit={handleAddComment} className="mb-4">
            <div className="mb-3">
              <label htmlFor="comment" className="form-label">Add a comment</label>
              <textarea
                className="form-control"
                id="comment"
                rows="3"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                disabled={isSubmitting}
              ></textarea>
              {commentError && <div className="text-danger small mt-1">{commentError}</div>}
            </div>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </button>
          </form>
        ) : (
          <div className="alert alert-info">
            <Link to="/login">Log in</Link> to leave a comment.
          </div>
        )}
        
        <div className="list-group">
          {comments.length === 0 ? (
            <div className="text-muted">No comments yet. Be the first to comment!</div>
          ) : (
            comments.map(comment => (
              <div key={comment.id} className="list-group-item">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="mb-1">{comment.user?.name || 'Anonymous'}</h6>
                    <p className="mb-1">{comment.body}</p>
                    <small className="text-muted">
                      {new Date(comment.created_at).toLocaleString()}
                    </small>
                  </div>
                  {currentUser?.id === comment.user_id && (
                    <button 
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default PostDetail;
