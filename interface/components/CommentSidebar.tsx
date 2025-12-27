'use client';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from '@/components/ui/sidebar';
import { Button } from './ui/button';

import { CommentsList } from './CommentsList';
import { NewCommentForm } from './NewCommentForm';
import { useState } from 'react';

const CommentsSidebar = () => {
  const [isWritingComment, setIsWritingComment] = useState(false);
  return (
    <Sidebar
      side='right'
      className='w-1/3 '>
      <SidebarHeader />
      <SidebarContent>
        <div className='flex justify-center'>
          <Button
            onClick={() =>
              isWritingComment
                ? setIsWritingComment(false)
                : setIsWritingComment(true)
            }
            variant='outline'
            className='w-9/10'>
            Leave a comment
          </Button>
        </div>
        {isWritingComment && <NewCommentForm parentId={null} />}
        <CommentsList />
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
};

export { CommentsSidebar };
