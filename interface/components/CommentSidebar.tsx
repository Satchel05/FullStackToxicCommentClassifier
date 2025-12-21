import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from '@/components/ui/sidebar';

import { CommentsList } from './CommentsList';

const CommentsSidebar = () => {
  return (
    <Sidebar
      side='right'
      className='w-150 '>
      <SidebarHeader />
      <SidebarContent>
        <CommentsList />
        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
};

export { CommentsSidebar };
