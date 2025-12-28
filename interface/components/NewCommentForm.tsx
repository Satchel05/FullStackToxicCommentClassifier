'use client';

import { useState } from 'react';
import { useCommentStore } from '@/stores/useCommentStore';
import { FormEvent } from 'react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
//  --- ShadCN ---
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { createCommentInput } from '@/types';
import { ToxicityModal } from './ToxicityModal';

const NewCommentForm = ({ parentId, isReplying, setShowNested }) => {
  const addComment = useCommentStore((state) => state.addComment);
  const [text, setText] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalInfo, setModalInfo] = useState({});
  const user = useCurrentUser();

  const checkToxicity = async (text: string) => {
    const res = await fetch('/api/check-toxicity', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: text }),
    });

    const predictions = await res.json();

    let maxScore = 0;
    let maxKey;
    for (const key in predictions) {
      if (predictions[key] >= 0.7) {
        if (predictions[key] > maxScore) {
          maxScore = predictions[key];
          maxKey = key;
        }
      }
    }

    if (maxScore) {
      return {
        score: maxScore,
        category: maxKey,
      };
    } else {
      return null;
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
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

    const isToxic = await checkToxicity(text);
    if (isToxic) {
      setModalInfo({
        score: isToxic.score,
        category: isToxic.category,
      });

      setShowModal(true);
      return;
    }

    addComment(newComment);

    if (isReplying) {
      setShowNested(true);
    }
  };

  const handleConfirmPost = async () => {
    setShowModal(false);
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
  };

  return (
    <div className='animate-in slide-in-from-top-2 fade-in duration-200 w-full mb-5'>
      <form
        onSubmit={handleSubmit}
        className=''>
        <div className='flex flex-col gap-2'>
          <Textarea
            onChange={(e) => setText(e.target.value)}
            placeholder='Start typing your comment here...'></Textarea>
          <Button
            className='w-25'
            type='submit'>
            Post
          </Button>
        </div>
      </form>
      <ToxicityModal
        {...modalInfo}
        open={showModal}
        setOpen={setShowModal}
        setShowModal={setShowModal}
        handleConfirmPost={handleConfirmPost}
      />
    </div>
  );
};

export { NewCommentForm };
