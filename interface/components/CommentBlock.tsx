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

const CommentBlock = ({ comment }: { comment: Comment }) => {
  const loadCommentThread = useCommentStore((state) => state.loadCommentThread);
  const updateComment = useCommentStore((state) => state.updateComment); // implement for text edit
  const toggleUpvote = useCommentStore((state) => state.toggleUpvote);
  const replies = loadCommentThread(comment.id);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{comment.author.name}</CardTitle>
          <CardDescription>{comment.timestamp}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>{comment.text}</p>
        </CardContent>
        <CardFooter>
          {comment.isEdited ? '(Edited)' : ''}
          {comment.reactions?.upvotes || 0}
          {comment.reactions?.downvotes || 0}

          <Button
            onClick={() => {
              // move away from hardcoded approach to a useUser store.
              toggleUpvote(comment.id, '999');
            }}>
            Upvote
          </Button>
          {/* <Button onClick={handleDownvote}>Downvote</Button> */}
        </CardFooter>
      </Card>

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
