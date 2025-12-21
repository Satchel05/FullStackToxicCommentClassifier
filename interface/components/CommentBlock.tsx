import { Button } from '@/components/ui/button';
import { useCommentStore } from '@/stores/useCommentStore';
import { Comment } from '@/types';
import { CommentDropdown } from './CommentDropdown';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useState } from 'react';
import { NewCommentForm } from './NewCommentForm';
import { Textarea } from './ui/textarea';
import { ButtonGroup } from './ui/button-group';
import {
  IconArrowBigUpFilled,
  IconArrowBigDownFilled,
} from '@tabler/icons-react';
import { ArrowBigUp, ArrowBigDown, Triangle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
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
      <article className='py-3'>
        {/* Header: Avatar + Author + Timestamp */}
        <header className='mb-3'>
          <div className='flex items-center gap-x-4'>
            <Image
              alt='profile picture'
              height={100}
              width={100}
              src={user.avatar}
              className='h-9 w-9 rounded-full object-cover'
            />
            <div className='flex items-baseline gap-x-2'>
              <h3 className='text-base font-semibold leading-none text-foreground'>
                {comment.author.name}
              </h3>
              <time className='text-xs text-muted-foreground'>
                {formatDistanceToNow(new Date(comment.timestamp), {
                  addSuffix: true,
                })}
                <span> {comment.isEdited ? '(Edited)' : ''}</span>
              </time>
            </div>
          </div>
        </header>

        {/* Content: Comment text or edit form */}
        <div className='mb-3 text-foreground'>
          {isEditing ? (
            <form
              onSubmit={handleSubmit}
              className='space-y-2'>
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <div className='flex gap-2'>
                <Button
                  variant='outline'
                  onClick={() => {
                    setIsEditing(false);
                  }}>
                  Cancel
                </Button>
                <Button type='submit'>Post</Button>
              </div>
            </form>
          ) : (
            <p className='text-foreground leading-6'>{comment.text}</p>
          )}
        </div>

        {/* Footer: Voting + Actions */}
        <footer className='flex items-center'>
          <div className='inline-flex items-center gap-2 bg-gray-100 border border-gray-200 rounded-full px-3 py-1.5'>
            <button
              onClick={() => {
                toggleUpvote(comment.id, user.id);
              }}>
              <Triangle
                size={17}
                className='fill-primary text-primary'
              />
            </button>
            <span className='text-gray-700 text-sm font-medium tabular-nums'>
              {comment.reactions
                ? comment.reactions.upvotes - comment.reactions.downvotes
                : '0'}
            </span>
            <button
              onClick={() => {
                toggleDownvote(comment.id, user.id);
              }}>
              <Triangle
                size={17}
                rotate={90}
                className='rotate-180 fill-primary text-primary'
              />
            </button>
          </div>

          <CommentDropdown
            setIsEditing={setIsEditing}
            setIsReplying={setIsReplying}
            comment={comment}
          />
        </footer>
      </article>

      {isReplying && <NewCommentForm parentId={comment.id} />}

      {replies.length > 0 && (
        <div className='ml-14'>
          {/* <ThreadLine /> */}
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
