'use client';
import { FormEvent, useState } from 'react';
import CommentBlock from '@/components/CommentBlock';
import CommentDialogue from '@/components/CommentDialogue';

export default function AddComment() {
  const [isToxic, setIsToxic] = useState(false);
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const response: Response = await fetch(`/api/check-toxicity`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: comment }),
    });
    const data = await response.json();

    console.log(data);
    const toxic = Object.values(data).some((score) => score > 0.85);
    setIsToxic(toxic); // establish toxicity of comment.

    if (toxic) {
      setIsOpen(true);
      // handle DB posting (localStorage)
    } else {
      setIsSubmitted(true);
      console.log(toxic);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          name='comment'></input>
        <button type='submit'>Post</button>
      </form>

      <CommentDialogue
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        setIsSubmitted={setIsSubmitted}
      />

      {isSubmitted && (
        <CommentBlock
          toxicityPrediction={isToxic}
          comment={comment}
        />
      )}
    </>
  );
}
