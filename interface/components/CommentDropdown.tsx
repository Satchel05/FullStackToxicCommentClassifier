import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useCommentStore } from '@/stores/useCommentStore';
import { MoreHorizontalIcon } from 'lucide-react';

const CommentDropdown = ({ setIsEditing, setIsReplying, comment }) => {
  const user = useCurrentUser();
  const deleteComment = useCommentStore((state) => state.deleteComment);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreHorizontalIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {comment.author.id === user.id && (
          <DropdownMenuItem onSelect={() => setIsEditing(true)}>
            Edit
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onSelect={() => setIsReplying(true)}>
          Reply
        </DropdownMenuItem>
        {comment.author.id === user.id && (
          <DropdownMenuItem onSelect={() => deleteComment(comment.id)}>
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { CommentDropdown };
