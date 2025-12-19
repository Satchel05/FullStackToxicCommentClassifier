'use client';

import CommentBlock from '@/components/CommentBlock';
import NewCommentForm from '@/components/NewCommentForm';
import { Separator } from '@/components/ui/separator';
import { ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Command } from 'lucide-react';
import { Search } from 'lucide-react';
import ComboBox from '@/components/ComboBox';
import { useEffect, useState } from 'react';

import { Comment } from '@/types';

const SORT_OPTIONS = ['Ascending', 'Descending'];

const STATIC_COMMENTS = [
  {
    id: 0,
    comment: "Excuse me, everyone. I'm gonna go meditate for half an hour.",
    toxicityPrediction: false,
    timestamp: new Date('2025-12-17T10:00:00'),
    author: 'Kristofferson Silverfox',
    profileImgPath: '/profilePictures/kristofferson.jpg',
  },
  {
    id: 1,
    comment:
      "I think I have this thing where I need everybody to think I'm the greatest, the quote-unquote Fantastic Mr. Fox. Great. It's actually slightly quicker, anyway. Fox throws his apple core away over his shoulder and dances a quick circle around Mrs. Fox, wrapping his arm around her waist extravagantly and making her laugh as they start off down the scenic route. ",
    toxicityPrediction: false,
    timestamp: new Date('2025-12-17T09:30:00'),
    author: 'Mr. Fox',
    profileImgPath: '/profilePictures/mrfox.jpg',
  },
  {
    id: 3,
    comment:
      "He gets a bandit hat? ... Where's MY bandit hat? Why didn't I get shot at? It's because you... you think I'm no good at anything!",
    toxicityPrediction: false,
    timestamp: new Date('2025-12-17T09:00:00'),
    author: 'Ash',
    profileImgPath: '/profilePictures/ash.jpg',
  },
];

export default function CommentBlockTest() {
  const [open, setOpen] = useState(false);
  const [comboBoxValue, setComboBoxValue] = useState('Ascending');
  const [comments, setComments] = useState<Comment[]>(STATIC_COMMENTS);

  useEffect(() => {
    const retrievedItems = localStorage.getItem('comments');
    if (retrievedItems) {
      const parsed = JSON.parse(retrievedItems);
      const userComments: Comment[] = parsed.map((c: Comment) => ({
        ...c,
        timestamp: new Date(c.timestamp), // Convert string back to Date
      }));
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setComments([...userComments, ...STATIC_COMMENTS]);
    }
  }, []);

  // helper function for comment form
  const addComment = (comment: Comment) => {
    setComments([comment, ...comments]);

    const userComments = localStorage.getItem('comments');
    const userCommentsArray = userComments ? JSON.parse(userComments) : [];
    localStorage.setItem(
      'comments',
      JSON.stringify([comment, ...userCommentsArray])
    );
  };

  return (
    <div className='flex flex-col items-center min-h-screen'>
      <div className='flex flex-col items-start justify-center min-h-screen p-8'>
        <div className='flex flex-col w-full max-w-3xl gap-8'>
          <NewCommentForm addComment={addComment} />
          <Separator />
          <div className='flex flex-row justify-between items-center'>
            <div className='flex flex-row gap-3 items-center justifiy-center'>
              <h2 className='text-[22px] font-bold tracking-tight'>Comments</h2>

              <div className='bg-gray-100 border border-gray-200 h-6 w-6 text-black rounded text-center'>
                {comments.length}
              </div>
            </div>
            <div className='flex flex-row gap-2 justify-between items-center'>
              <Button
                variant='outline'
                className='flex flex-row justify-start bg-gray-100 border-1 border-gray-200 w-60'>
                <Search className='h-4 w-4 text-gray-400' />
                <p>
                  <span className='text-gray-400'>Search Comments</span>
                </p>
                <span className='flex flex-row justify-start items-center'>
                  <Command className='h-4 w-4 text-gray-700' />
                  <span className='text-gray-700'>K</span>
                </span>
              </Button>

              <ComboBox
                open={open}
                setOpen={setOpen}
                value={comboBoxValue}
                setValue={setComboBoxValue}
                items={SORT_OPTIONS}
              />
            </div>
          </div>
        </div>
        <div>
          <div className='w-full max-w-3xl'>
            {/* map over list of items that is conditionally rendered based on the value from the comboBox */}
            {(comboBoxValue === 'Descending'
              ? [...comments].reverse()
              : comments
            ).map((comment, index) => {
              return (
                <div
                  key={`${comment.id}-${comboBoxValue}`}
                  style={{
                    animation: 'fadeInUp 300ms ease-out',
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: 'backwards',
                  }}>
                  <CommentBlock {...comment} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
