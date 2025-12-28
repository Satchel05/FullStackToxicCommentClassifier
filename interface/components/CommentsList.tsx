'use client';
import { useState, useEffect } from 'react';
import { useCommentStore } from '@/stores/useCommentStore';
import { CommentBlock } from './CommentBlock';
import { CommentWithContextMenu } from './CommentWithContextMenu';
import type { CommentBlockProps } from './CommentBlock';

const CommentsList = () => {
  const loadComments = useCommentStore((state) => state.loadComments);
  const comments = useCommentStore((state) => state.comments);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const topLevelComments = comments.filter((c) => !c.parentId);

  return (
    <>
      <div className='p-10flex flex-col items-center'>
        <div className='max-w-2xl'>
          {topLevelComments.map((c) => (
            <CommentWithContextMenu
              key={c.id}
              comment={c}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export { CommentsList };
