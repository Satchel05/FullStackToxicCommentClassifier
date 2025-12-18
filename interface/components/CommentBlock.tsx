'use client';

import Image from 'next/image';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from './ui/button';
import { ChevronUp, ChevronDown, MessageCircle, Dot } from 'lucide-react';

import { Comment } from '@/types';

// use this util function for display
const getTimeSince = (timestamp: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - timestamp.getTime();
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  if (seconds < 60) {
    return 'just now';
  } else if (minutes < 60) {
    return rtf.format(-minutes, 'minute');
  } else if (hours < 24) {
    return rtf.format(-hours, 'hour');
  } else if (days < 7) {
    return rtf.format(-days, 'day');
  } else {
    // For dates 7+ days ago, show formatted date
    return timestamp.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year:
        timestamp.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  }
};

export default function CommentBlock({
  toxicityPrediction,
  comment,
  id,
  timestamp,
  author,
  profileImgPath,
}: Comment) {
  const [currTime, setCurrTime] = useState(new Date());

  // use to update time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrTime(new Date());
    }, 60000);

    // clean up interval
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className='gap-1 border-0 shadow-none bg-transparent '>
      <CardHeader className='pl-0 pr-6 flex flex-row items-center'>
        <div className='relative w-10 h-10 mr-3 shrink-0'>
          <Image
            alt='profile picture'
            src={profileImgPath}
            fill
            className='rounded-full object-cover'
          />
        </div>
        <CardTitle>{author}</CardTitle>
        <CardDescription>
          <div className='flex flex-row items-center'>
            <Dot />
            {getTimeSince(timestamp)}
          </div>
        </CardDescription>
      </CardHeader>
      <div className='pl-[37px] flex flex-col gap-5'>
        <CardContent>
          <p>{comment}</p>
        </CardContent>
        <CardFooter className='flex flex-row items-center gap-5'>
          <Button
            variant='ghost'
            className='flex flex-row items-center gap-1 h-8 rounded-full'>
            <ChevronUp className='h-5 w-5 text-gray-400' />
            <span className='text-black'>15</span>
            <ChevronDown className='h-5 w-5 text-gray-400' />
          </Button>

          <button className='flex flex-row items-center gap-2 group transition-all hover:text-blue-500'>
            <MessageCircle className='h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-all' />
            <span className='text-sm font-medium text-gray-400'>Reply</span>
          </button>
        </CardFooter>
      </div>
    </Card>
  );
}
