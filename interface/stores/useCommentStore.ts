// zustand utility
import { create } from 'zustand';
// types
import { Comment, createCommentInput } from '@/types';
// custom API
import { CommentStorage } from '@/services/commentStorage';

interface CommentStore {
  comments: Comment[];

  loadComments: () => void;
  addComment: (input: createCommentInput) => void;
  updateComment: (id: string, updates: Partial<Comment>) => void;
  deleteComment: (id: string, deleteReplies?: boolean) => void;
  loadCommentThread: (rootId: string) => Comment[];
  toggleUpvote: (id: string, userId: string) => void;
}

export const useCommentStore = create<CommentStore>((set, get) => ({
  //   the thing that will be accessed by the client
  comments: [],

  loadComments: () => {
    set({ comments: CommentStorage.getAllComments() });
  },

  addComment: (input) => {
    const newComment = CommentStorage.postComment(input);
    set((state) => ({ comments: [...state.comments, newComment] }));
  },

  updateComment: (id, updates) => {
    const updatedComment = CommentStorage.updateCommment(id, updates);
    if (updatedComment) {
      set({ comments: CommentStorage.getAllComments() });
    }
  },

  deleteComment: (id, deleteReplies) => {
    const deletedComment = CommentStorage.deleteComment(id, deleteReplies);

    if (deletedComment) {
      set({ comments: CommentStorage.getAllComments() });
    }
  },

  loadCommentThread: (rootId) => {
    return get().comments.filter((c) => c.parentId === rootId);
  },

  toggleUpvote: (id, userId) => {
    const toggledComment = CommentStorage.toggleUpvote(id, userId);
    if (toggledComment) {
      set({ comments: CommentStorage.getAllComments() });
    }
  },
}));
