import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useCommentStore } from '@/stores/useCommentStore';
import { Comment } from '@/types';
import { CommentDropdown } from './CommentDropdown';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useState } from 'react';
import { NewCommentForm } from './NewCommentForm';
import { Textarea } from './ui/textarea';

const CommentBlock = ({ comment }: { comment: Comment }) => {
  const loadCommentThread = useCommentStore((state) => state.loadCommentThread);
  const updateComment = useCommentStore((state) => state.updateComment); // implement for text edit
  const toggleUpvote = useCommentStore((state) => state.toggleUpvote);
  const toggleDownvote = useCommentStore((state) => state.toggleDownvote);
  const replies = loadCommentThread(comment.id);
  const user = useCurrentUser();
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [text, setText] = useState(comment.text);

  const handleSubmit = () => {
    updateComment(comment.id, { text: text });
    setIsEditing(false);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{comment.author.name}</CardTitle>
          <CardDescription>{comment.timestamp}</CardDescription>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}></Textarea>
              <Button
                onClick={() => {
                  setIsEditing(false);
                }}>
                Cancel
              </Button>
              <Button type='submit'>Post</Button>
            </form>
          ) : (
            <p>{comment.text}</p>
          )}
        </CardContent>
        <CardFooter>
          {comment.isEdited ? '(Edited)' : ''}
          {comment.reactions?.upvotes || 0}
          {comment.reactions?.downvotes || 0}
          <Button
            onClick={() => {
              toggleUpvote(comment.id, user.id);
            }}>
            Upvote
          </Button>
          <Button
            onClick={() => {
              toggleDownvote(comment.id, user.id);
            }}>
            Downvote
          </Button>
          <Button
            onClick={() => {
              setIsReplying(true);
            }}>
            Reply
          </Button>
          <CommentDropdown
            setIsEditing={setIsEditing}
            setIsReplying={setIsReplying}
            comment={comment}
          />
        </CardFooter>
      </Card>

      {isReplying && <NewCommentForm parentId={comment.id} />}

      {replies.length > 0 && (
        <div className='ml-8'>
          {replies.map((reply) => (
            <CommentBlock
              key={reply.id}
              comment={reply}
            />
          ))}
        </div>
      )}
    </>
  );
};

export { CommentBlock };
