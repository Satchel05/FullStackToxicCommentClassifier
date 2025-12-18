'use client';

import { FormEvent, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Bold, Italic, Link, Image as ImageIcon } from 'lucide-react';
import CommentDialogue from './CommentDialogue';
import { Comment } from '@/types';

export default function NewCommentForm({ addComment }) {
  const [newCommentText, setNewCommentText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const response: Response = await fetch(`/api/check-toxicity`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newCommentText }),
    });

    const data = await response.json();

    const toxic = Object.values(data).some((score) => score > 0.85);

    if (toxic) {
      setIsOpen(true);
      // handle DB posting (localStorage)
    } else {
      try {
        const newComment: Comment = {
          id: Date.now() + Math.floor(Math.random() * 1000),
          comment: newCommentText.trim(),
          toxicityPrediction: toxic,
          timestamp: new Date(),
          author: 'You',
          profileImgPath: '/profilePictures/badger.avif',
        };

        addComment(newComment);
      } catch (err) {
        console.log(err);
      }
      setIsSubmitted(true);
      console.log(toxic);
    }
  }

  return (
    <>
      <div className='border rounded-lg overflow-hidden bg-card'>
        <Textarea
          placeholder='Add a comment...'
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
          className='min-h-[140px] resize-none border-0 focus-visible:ring-0 rounded-none p-4 text-base leading-relaxed text-gray-800 placeholder:text-gray-400'
        />

        <div className='flex items-center justify-between px-4 py-2 border-t bg-muted/50'>
          {/* Text editing toolbar */}
          <div className='flex gap-1'>
            <Button
              variant='ghost'
              size='icon'
              className='h-8 w-8'>
              <Bold className='h-4 w-4' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              className='h-8 w-8'>
              <Italic className='h-4 w-4' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              className='h-8 w-8'>
              <Link className='h-4 w-4' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              className='h-8 w-8'>
              <ImageIcon className='h-4 w-4' />
            </Button>
          </div>

          {/* Submit button */}
          <form onSubmit={handleSubmit}>
            <Button
              variant='outline'
              size='sm'
              onClick={handleSubmit}>
              Post Comment
            </Button>
          </form>
        </div>
      </div>
      <CommentDialogue
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        setIsSubmitted={setIsSubmitted}
      />
    </>
  );
}
