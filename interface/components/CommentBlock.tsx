import { Button } from '@/components/ui/button';
import { useCommentStore } from '@/stores/useCommentStore';
import { Comment } from '@/types';
import { CommentDropdown } from './CommentDropdown';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useState } from 'react';
import { NewCommentForm } from './NewCommentForm';
import { Textarea } from './ui/textarea';
import { ButtonGroup } from './ui/button-group';
import { IconHeart, IconHeartFilled } from '@tabler/icons-react';
import { IconChevronRight, IconChevronDown } from '@tabler/icons-react';
import { ArrowBigUp, ArrowBigDown, Triangle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import { CommentWithContextMenu } from './CommentWithContextMenu';
import { useEffect } from 'react';

type CommentBlockProps = {
  isEditing: boolean;
  setIsEditing: (v: boolean) => void;
  isReplying: boolean;
  setIsReplying: (v: boolean) => void;
};

const CommentBlock = ({
  comment,
  interactions,
}: {
  comment: Comment;
  interactions: CommentBlockProps;
}) => {
  const { isEditing, setIsEditing, isReplying, setIsReplying } = interactions;
  const loadCommentThread = useCommentStore((state) => state.loadCommentThread);
  const updateComment = useCommentStore((state) => state.updateComment); // implement for text edit
  const toggleUpvote = useCommentStore((state) => state.toggleUpvote);
  const toggleDownvote = useCommentStore((state) => state.toggleDownvote);
  const replies = loadCommentThread(comment.id);
  const user = useCurrentUser();
  const [text, setText] = useState(comment.text);
  const [showNested, setShowNested] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleSubmit = () => {
    updateComment(comment.id, { text: text });
    setIsEditing(false);
  };

  // useEffect(() => {
  //   loadCommentThread(comment.id).finally(() => {})
  // }, []);

  return (
    <div className='animate-in slide-in-from-top-2 fade-in duration-200'>
      <article className='py-3'>
        {/* Header: Avatar + Author + Timestamp */}
        <header className='mb-3'>
          <div className='flex items-center gap-x-3'>
            <Image
              alt='profile picture'
              height={100}
              width={100}
              src={comment.author.avatar || '/profilePictures/mrfox.jpg'}
              className='h-8 w-8 rounded-full object-cover'
            />
            <div className='flex items-baseline gap-x-3'>
              <h3 className='text-base font-semibold leading-none text-foreground'>
                {comment.author.name}
              </h3>
              <time className='text-xs text-muted-foreground font-medium'>
                {formatDistanceToNow(new Date(comment.timestamp), {
                  addSuffix: true,
                })}
                <span> {comment.isEdited ? '(Edited)' : ''}</span>
              </time>
            </div>

            {/* <div className='max-w-md bg-white rounded-xl border border-gray-200 p-4 space-y-3'> */}
            {/* <div className='inline-flex items-center gap-1'>
              <span className='text-gray-700 text-xs font-medium tabular-nums'>
                {comment.reactions
                  ? comment.reactions.upvotes - comment.reactions.downvotes
                  : '0'}
              </span>
              <IconHeart size={15} />
            </div> */}
          </div>
        </header>

        {/* Content: Comment text or edit form */}
        <div className='mb-3 text-foreground'>
          {isEditing ? (
            <form
              onSubmit={handleSubmit}
              className='space-y-2'>
              <Textarea
                className='text-foreground leading-6 border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 md:text-base resize-none'
                // className='text-foreground text-base leading-6 border-2 border-dashed p-0'
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
                <Button
                  type='submit'
                  className=''>
                  Post
                </Button>
              </div>
            </form>
          ) : (
            <p className='text-foreground leading-6'>{comment.text}</p>
          )}
        </div>

        {/* Footer: Voting + Actions */}
        <footer className='flex items-center'>
          {/* <CommentDropdown
            setIsEditing={setIsEditing}
            setIsReplying={setIsReplying}
            comment={comment}
          /> */}

          {replies.length > 0 && (
            <button
              onClick={() =>
                showNested ? setShowNested(false) : setShowNested(true)
              }>
              <span className='text-xs text-muted-foreground font-semibold'>
                {replies.length} replies
              </span>
            </button>
          )}
        </footer>
      </article>

      {isReplying && (
        <NewCommentForm
          parentId={comment.id}
          isReplying={isReplying}
          setShowNested={setShowNested}
        />
      )}

      {replies.length > 0 && showNested && (
        <div className='ml-14'>
          {/* <ThreadLine /> */}
          {replies.map((reply) => (
            <CommentWithContextMenu
              key={reply.id}
              comment={reply}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export { CommentBlock };
