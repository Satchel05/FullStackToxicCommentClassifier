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
import { ButtonGroup } from './ui/button-group';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';

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
      <Card className='border-none shadow-none bg-transparent'>
        <CardHeader>
          <div className='flex flex-row items-center text-lg gap-x-4'>
            <Image
              alt='profile picture'
              height={100}
              width={100}
              src={user.avatar}
              className='h-12 w-12 rounded-full object-cover'
            />
            <CardTitle>{comment.author.name}</CardTitle>
            <CardDescription>{comment.timestamp}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className='ml-15 text-base/6'>
          <div className='flex flex-row'>
            <ButtonGroup
              orientation='vertical'
              className='text-center font-semibold text-2xl flex flex-col py-0'>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => {
                  toggleUpvote(comment.id, user.id);
                }}>
                <ChevronUp className='h-8 w-8' />
              </Button>
              <span>
                {comment.reactions
                  ? comment.reactions.upvotes - comment.reactions.downvotes
                  : '0'}
              </span>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => {
                  toggleDownvote(comment.id, user.id);
                }}>
                <ChevronDown className='h-8 w-8' />
              </Button>
            </ButtonGroup>
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
          </div>
        </CardContent>
        <CardFooter>
          {comment.isEdited ? '(Edited)' : ''}

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
