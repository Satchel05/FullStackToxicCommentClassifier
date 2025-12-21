'use client';
import { CommentsList } from '@/components/CommentsList';
import { NewCommentForm } from '@/components/NewCommentForm';

export default function Playground() {
  return (
    <>
      <NewCommentForm parentId={null} />
      <CommentsList />
    </>
  );
}
