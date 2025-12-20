'use client';
import { useState, useEffect } from 'react';
import { useCommentStore } from '@/stores/useCommentStore';
import { CommentBlock } from './CommentBlock';
import { shallow } from 'zustand/shallow';

const CommentsList = () => {
  const loadComments = useCommentStore((state) => state.loadComments);
  const comments = useCommentStore((state) => state.comments);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const topLevelComments = comments.filter((c) => !c.parentId);

  return (
    <div>
      {topLevelComments.map((c) => (
        <CommentBlock
          key={c.id}
          comment={c}
        />
      ))}
    </div>
  );
};

export { CommentsList };
