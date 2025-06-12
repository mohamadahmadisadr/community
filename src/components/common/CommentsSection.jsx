import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  Avatar,
  Chip,
  Divider,
  IconButton,
  Collapse,
  Alert
} from '@mui/material';
import {
  Comment,
  Send,
  ExpandMore,
  ExpandLess,
  Person,
  Telegram
} from '@mui/icons-material';
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { isTelegramWebApp, getTelegramUser, showTelegramAlert } from '../../utils/telegramUtils';

const CommentsSection = ({ itemId, itemType }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(true); // Always show comments section
  const [loading, setLoading] = useState(false);

  const [showAllComments, setShowAllComments] = useState(false);

  const INITIAL_COMMENTS_COUNT = 3; // Show first 3 comments initially

  // Check if user can add comments (only in Telegram)
  const canAddComments = () => {
    return isTelegramWebApp();
  };

  // Get current user data (only from Telegram)
  const getCurrentUser = () => {
    if (isTelegramWebApp()) {
      return getTelegramUser();
    }
    return null;
  };

  // Load comments
  useEffect(() => {
    const commentsRef = collection(db, 'comments');
    const q = query(
      commentsRef,
      where('itemId', '==', itemId),
      where('itemType', '==', itemType),
      where('status', '==', 'approved'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setComments(commentsData);
    });

    return () => unsubscribe();
  }, [itemId, itemType]);

  // Add comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const currentUser = getCurrentUser();
    if (!currentUser) {
      showTelegramAlert('You must be using the Telegram app to add comments');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'comments'), {
        itemId,
        itemType,
        text: newComment.trim(),
        userId: currentUser.id,
        userFirstName: currentUser.firstName,
        userLastName: currentUser.lastName,
        username: currentUser.username,
        userPhotoUrl: currentUser.photoUrl,
        createdAt: serverTimestamp(),
        status: 'approved' // Auto-approve for now, can add moderation later
      });
      setNewComment('');
      setShowAddComment(false);
      showTelegramAlert('Comment added successfully!');
    } catch (error) {
      showTelegramAlert('Failed to add comment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getUserDisplayName = (comment) => {
    if (comment.userFirstName || comment.userLastName) {
      return `${comment.userFirstName || ''} ${comment.userLastName || ''}`.trim();
    }
    return comment.username || 'Anonymous User';
  };

  // Get comments to display based on showAllComments state
  const displayedComments = showAllComments ? comments : comments.slice(0, INITIAL_COMMENTS_COUNT);
  const hasMoreComments = comments.length > INITIAL_COMMENTS_COUNT;

  return (
    <Box sx={{ mt: 3 }}>
      {/* Comments Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <Comment sx={{ fontSize: 28 }} />
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Comments
        </Typography>
        {comments.length > 0 && (
          <Chip
            label={comments.length}
            size="small"
            color="primary"
          />
        )}
      </Box>

      {/* Add Comment Section */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          multiline
          rows={3}
          placeholder={canAddComments() ? "Share your thoughts..." : "You must be using the Telegram app to add comments"}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={!canAddComments() || loading}
          sx={{ mb: 2 }}
        />

        {canAddComments() && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              variant="contained"
              startIcon={<Send />}
              onClick={handleAddComment}
              disabled={!newComment.trim() || loading}
              sx={{ textTransform: 'none' }}
            >
              {loading ? 'Posting...' : 'Post Comment'}
            </Button>
          </Box>
        )}
      </Box>

        {/* Comments List */}
        {comments.length > 0 ? (
          <Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {displayedComments.map((comment) => (
                <Box
                  key={comment.id}
                  sx={{
                    p: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Avatar
                      src={comment.userPhotoUrl}
                      sx={{
                        width: 40,
                        height: 40
                      }}
                    >
                      {!comment.userPhotoUrl && <Person />}
                    </Avatar>

                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {getUserDisplayName(comment)}
                        </Typography>
                        {comment.username && (
                          <Chip
                            label={`@${comment.username}`}
                            size="small"
                            variant="outlined"
                            color="primary"
                            sx={{ fontSize: '0.7rem', height: 20 }}
                          />
                        )}
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                          {formatDate(comment.createdAt)}
                        </Typography>
                      </Box>

                      <Typography
                        variant="body2"
                        sx={{
                          lineHeight: 1.6
                        }}
                      >
                        {comment.text}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>

            {/* See More Button */}
            {hasMoreComments && !showAllComments && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Button
                  variant="outlined"
                  onClick={() => setShowAllComments(true)}
                  sx={{ textTransform: 'none' }}
                >
                  See {comments.length - INITIAL_COMMENTS_COUNT} more comments
                </Button>
              </Box>
            )}

            {/* Show Less Button */}
            {showAllComments && hasMoreComments && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Button
                  variant="text"
                  onClick={() => setShowAllComments(false)}
                  sx={{ textTransform: 'none' }}
                >
                  Show less
                </Button>
              </Box>
            )}
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Comment sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.secondary', mb: 1 }}>
              No comments yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Be the first to share your thoughts!
            </Typography>
          </Box>
        )}
    </Box>
  );
};

export default CommentsSection;
