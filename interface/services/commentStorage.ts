// Custom API to interact with localStorage since no DBMS is used

import { Comment, createCommentInput } from '@/types';
import { CommentThread } from '@/types';
const STORAGE_KEY = 'comments';

export class CommentStorage {
  static getAllComments(): Comment[] {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  static getCommentThread(parentId: string): CommentThread | null {
    const allComments = this.getAllComments();
    const rootComment: Comment | undefined = allComments.find(
      (c) => c.id === parentId
    );
    if (!rootComment) return null;

    const replies = allComments
      .filter((c) => c.parentId === parentId)
      .sort((a, b) => a.timestamp - b.timestamp);

    return { rootComment, replies };
  }

  static postComment(input: createCommentInput): Comment {
    const comment: Comment = {
      ...input,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      isEdited: false,
    };

    const all = this.getAllComments();
    all.push(comment);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return comment;
  }

  static updateCommment(id: string, updates: Partial<Comment>): Comment | null {
    const all = this.getAllComments();
    const comment = all.find((c) => c.id == id);

    if (!comment) return null;

    // edit comment in place since this is not React.
    Object.assign(comment, updates, {
      isEdited: true,
      editedAt: Date.now(),
    });

    return comment;
  }

  static deleteComment(id: string, deleteReplies = true): boolean {
    let all = this.getAllComments();
    const rootComment = all.find((c) => c.id === id);
    if (!rootComment) return null;

    if (deleteReplies) {
      all = all.filter((c) => c.parentId != rootComment.id);
    } else {
      all = all.filter((c) => c.id != id);
    }

    return true;
  }
}
