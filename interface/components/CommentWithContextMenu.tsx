import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';

import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useCommentStore } from '@/stores/useCommentStore';
import { CommentBlock } from './CommentBlock';
import { useState } from 'react';
import { Comment } from '@/types';

const CommentWithContextMenu = ({ comment }: { comment: Comment }) => {
  const user = useCurrentUser();
  const deleteComment = useCommentStore((state) => state.deleteComment);

  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);

  const interactions = {
    isEditing,
    setIsEditing,
    isReplying,
    setIsReplying,
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        {/* <MoreHorizontalIcon /> */}
        <CommentBlock
          comment={comment}
          interactions={interactions}
        />
      </ContextMenuTrigger>
      <ContextMenuContent>
        {comment.author.id === user.id && (
          <ContextMenuItem onSelect={() => setIsEditing(true)}>
            Edit
          </ContextMenuItem>
        )}
        <ContextMenuItem onSelect={() => setIsReplying(true)}>
          Reply
        </ContextMenuItem>
        {comment.author.id === user.id && (
          <ContextMenuItem onSelect={() => deleteComment(comment.id)}>
            Delete
          </ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
};

export { CommentWithContextMenu };
