// Custom API to interact with localStorage since no DBMS is used

import { Comment, createCommentInput } from '@/types';
import { CommentThread } from '@/types';
const STORAGE_KEY = 'comments';

export class CommentStorage {
  static getAllComments(): Comment[] {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  static postComment(input: createCommentInput): Comment {
    // in post comment
    const comment: Comment = {
      ...input,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      isEdited: false,
    };

    const all = this.getAllComments();
    // passed getAllComments()
    all.push(comment);
    // pushing to all

    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    // updating localStorage with new item
    return comment;
  }

  static updateCommment(id: string, updates: Partial<Comment>): Comment | null {
    const all = this.getAllComments();
    const comment = all.find((c) => c.id == id);

    if (!comment) return null;

    const isContentEdit = 'text' in updates;

    // edit comment in place since this is not React.
    Object.assign(comment, updates, {
      ...(isContentEdit && { isEdited: true, editedAt: Date.now() }),
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));

    return comment;
  }

  static deleteComment(id: string, deleteReplies = true): boolean {
    let all = this.getAllComments();
    const rootComment = all.find((c) => c.id === id);
    if (!rootComment) return false;

    if (deleteReplies) {
      all = all.filter((c) => c.id !== id && c.parentId !== rootComment.id);
    } else {
      all = all.filter((c) => c.id !== id);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));

    return true;
  }

  static toggleUpvote(id: string, userId: string): Comment | null {
    const all = this.getAllComments();
    const comment = all.find((c) => c.id === id);
    if (!comment) {
      return null;
    }

    if (!comment.reactions) {
      comment.reactions = {
        upvotes: 0,
        downvotes: 0,
        userDownvotes: [],
        userUpvotes: [],
      };
    }

    const { reactions } = comment;
    const hasUpvoted = reactions.userUpvotes.includes(userId);
    const hasDownvoted = reactions.userDownvotes.includes(userId);

    if (hasDownvoted) {
      return null;
    }

    if (hasUpvoted) {
      // undo upvote
      reactions.upvotes -= 1;
      reactions.userUpvotes = reactions.userUpvotes.filter((u) => u !== userId);
    } else {
      // continue with upvote
      reactions.upvotes += 1;
      reactions.userUpvotes.push(userId);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return comment;
  }
}
