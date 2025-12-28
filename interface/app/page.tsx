'use client';
import { CommentsList } from '@/components/CommentsList';
import { NewCommentForm } from '@/components/NewCommentForm';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [isWritingComment, setIsWritingComment] = useState(false);
  return (
    <div className='flex flex-col justify-center items-center mt-20'>
      <div className='w-2xl flex flex-row justify-center m-7'>
        <Button
          onClick={() =>
            isWritingComment
              ? setIsWritingComment(false)
              : setIsWritingComment(true)
          }
          variant='outline'
          className='w-full bg-accent'>
          Leave a comment
        </Button>
      </div>
      <div className='w-2xl flex flex-row justify-center'>
        {isWritingComment && <NewCommentForm parentId={null} />}
      </div>
      <CommentsList />
    </div>
  );
}
