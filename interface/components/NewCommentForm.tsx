'use client';

import { useState } from 'react';
import { useCommentStore } from '@/stores/useCommentStore';
import { FormEvent } from 'react';
//  --- ShadCN ---
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { createCommentInput } from '@/types';

const NewCommentForm = () => {
  const addComment = useCommentStore((state) => state.addComment);
  const [text, setText] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newComment: createCommentInput = {
      text: text,
      author: {
        id: '999',
        name: 'Me',
        avatar: '@/profilePictures/badger.avif',
      },
      parentId: null,
    };

    addComment(newComment);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Textarea
        onChange={(e) => setText(e.target.value)}
        placeholder='Start typing your comment here...'></Textarea>
      <Button type='submit'>Post</Button>
    </form>
  );
};

export { NewCommentForm };
