'use client';

import { useState } from 'react';
import { useCommentStore } from '@/stores/useCommentStore';
import { FormEvent } from 'react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
//  --- ShadCN ---
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { createCommentInput } from '@/types';

const NewCommentForm = ({ parentId, isReplying, setShowNested }) => {
  const addComment = useCommentStore((state) => state.addComment);
  const [text, setText] = useState('');
  const user = useCurrentUser();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newComment: createCommentInput = {
      text: text,
      author: {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
      },
      parentId: parentId,
    };

    addComment(newComment);

    if (isReplying) {
      setShowNested(true);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      // className='w-fit border-2'
    >
      <Textarea
        onChange={(e) => setText(e.target.value)}
        placeholder='Start typing your comment here...'></Textarea>
      <Button type='submit'>Post</Button>
    </form>
  );
};

export { NewCommentForm };
