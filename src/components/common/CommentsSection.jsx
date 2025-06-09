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

const CommentsSection = ({ itemId, itemType, color = '#667eea' }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(true); // Always show comments section
  const [loading, setLoading] = useState(false);
  const [showAddComment, setShowAddComment] = useState(false);
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
        <Comment sx={{ color, fontSize: 28 }} />
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
          Comments
        </Typography>
        {comments.length > 0 && (
          <Chip
            label={comments.length}
            size="small"
            sx={{
              bgcolor: `${color}15`,
              color: color,
              fontWeight: 'bold',
              minWidth: 32
            }}
          />
        )}
      </Box>

      {/* Add Comment Section */}
      <Card sx={{ mb: 3, border: `1px solid ${color}20`, borderRadius: 3, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
        <CardContent sx={{ pb: 2 }}>
          {!showAddComment ? (
            <Button
              variant="contained"
              startIcon={<Comment />}
              onClick={() => {
                if (canAddComments()) {
                  setShowAddComment(true);
                } else {
                  showTelegramAlert('You must be using the Telegram app to add comments');
                }
              }}
              sx={{
                background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 'bold',
                px: 3,
                py: 1,
                '&:hover': {
                  background: `linear-gradient(135deg, ${color}dd 0%, ${color}bb 100%)`,
                  transform: 'translateY(-1px)',
                  boxShadow: `0 4px 12px ${color}40`
                }
              }}
            >
              Write a comment
            </Button>
          ) : (
              <Box>
                {!canAddComments() && (
                  <Alert
                    severity="info"
                    icon={<Telegram />}
                    sx={{ mb: 2 }}
                  >
                    You must be using the Telegram app to add comments
                  </Alert>
                )}

                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Share your thoughts..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  disabled={!canAddComments() || loading}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: color,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: color,
                      }
                    }
                  }}
                />
                
                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setShowAddComment(false);
                      setNewComment('');
                    }}
                    disabled={loading}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      borderColor: '#ccc',
                      color: '#666',
                      '&:hover': {
                        borderColor: '#999',
                        backgroundColor: '#f5f5f5'
                      }
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Send />}
                    onClick={handleAddComment}
                    disabled={!newComment.trim() || !canAddComments() || loading}
                    sx={{
                      background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 'bold',
                      '&:hover': {
                        background: `linear-gradient(135deg, ${color}dd 0%, ${color}bb 100%)`,
                        transform: 'translateY(-1px)',
                        boxShadow: `0 4px 12px ${color}40`
                      }
                    }}
                  >
                    {loading ? 'Posting...' : 'Post Comment'}
                  </Button>
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Comments List */}
        {comments.length > 0 ? (
          <Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {displayedComments.map((comment) => (
                <Card
                  key={comment.id}
                  sx={{
                    border: '1px solid #f0f0f0',
                    borderRadius: 3,
                    boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      boxShadow: '0 2px 16px rgba(0,0,0,0.1)',
                      transform: 'translateY(-1px)'
                    }
                  }}
                >
                  <CardContent sx={{ pb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Avatar
                        src={comment.userPhotoUrl}
                        sx={{
                          width: 44,
                          height: 44,
                          bgcolor: color,
                          border: `2px solid ${color}20`
                        }}
                      >
                        {!comment.userPhotoUrl && <Person />}
                      </Avatar>

                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                            {getUserDisplayName(comment)}
                          </Typography>
                          {comment.username && (
                            <Chip
                              label={`@${comment.username}`}
                              size="small"
                              sx={{
                                bgcolor: `${color}15`,
                                color: color,
                                fontSize: '0.7rem',
                                height: 20,
                                fontWeight: 'bold'
                              }}
                            />
                          )}
                          <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                            {formatDate(comment.createdAt)}
                          </Typography>
                        </Box>

                        <Typography
                          variant="body2"
                          sx={{
                            lineHeight: 1.6,
                            color: '#444',
                            fontSize: '0.95rem'
                          }}
                        >
                          {comment.text}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>

            {/* See More Button */}
            {hasMoreComments && !showAllComments && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Button
                  variant="outlined"
                  onClick={() => setShowAllComments(true)}
                  sx={{
                    borderColor: color,
                    color: color,
                    borderRadius: 3,
                    px: 4,
                    py: 1,
                    textTransform: 'none',
                    fontWeight: 'bold',
                    fontSize: '0.95rem',
                    '&:hover': {
                      borderColor: color,
                      backgroundColor: `${color}08`,
                      transform: 'translateY(-1px)',
                      boxShadow: `0 4px 12px ${color}30`
                    }
                  }}
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
                  sx={{
                    color: '#666',
                    textTransform: 'none',
                    fontWeight: 'bold',
                    '&:hover': {
                      backgroundColor: '#f5f5f5'
                    }
                  }}
                >
                  Show less
                </Button>
              </Box>
            )}
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 6, bgcolor: '#fafafa', borderRadius: 3 }}>
            <Comment sx={{ fontSize: 48, color: '#ddd', mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#999', mb: 1 }}>
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
