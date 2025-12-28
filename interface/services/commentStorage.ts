// Custom API to interact with localStorage since no DBMS is used

import { Comment, createCommentInput } from '@/types';
import { CommentThread } from '@/types';
const STORAGE_KEY = 'comments';

const SEED_DATA: Comment[] = [
  {
    id: '1',
    text: "This is a really insightful perspective on the topic. I hadn't considered the implications from that angle before.",
    author: {
      id: 'user_1',
      name: 'Mr. Badger',
      avatar: '/profilePictures/badger.avif',
    },
    timestamp: Date.now() - 3600000, // 1 hour ago
    parentId: null,
    reactions: {
      upvotes: 12,
      downvotes: 1,
      userUpvotes: ['user_5', 'user_6'],
      userDownvotes: [],
    },
    isEdited: false,
  },
  {
    id: '2',
    text: "I respectfully disagree. The data doesn't support that conclusion when you account for confounding variables.",
    author: {
      id: 'user_2',
      name: 'Ash',
      avatar: '/profilePictures/ash.jpg',
    },
    timestamp: Date.now() - 7200000, // 2 hours ago
    parentId: null,
    reactions: {
      upvotes: 8,
      downvotes: 3,
      userUpvotes: ['user_7'],
      userDownvotes: ['user_8'],
    },
    isEdited: true,
    editedAt: Date.now() - 3000000,
  },
  {
    id: '3',
    text: "Can you elaborate on what you mean by that? I'm curious to understand your reasoning better.",
    author: {
      id: 'user_3',
      name: 'Fantastic Mr. Fox',
      avatar: '/profilePictures/mrfox.jpg',
    },
    timestamp: Date.now() - 1800000, // 30 minutes ago
    parentId: '1',
    reactions: {
      upvotes: 5,
      downvotes: 0,
      userUpvotes: [],
      userDownvotes: [],
    },
    isEdited: false,
  },
  {
    id: '4',
    text: 'Has anyone tried implementing this in a production environment? Would love to hear about real-world experiences.',
    author: {
      id: 'user_4',
      name: 'Mrs. Fox',
      avatar: '/profilePictures/mrsfox.jpeg',
    },
    timestamp: Date.now() - 900000, // 15 minutes ago
    parentId: null,
    reactions: {
      upvotes: 15,
      downvotes: 0,
      userUpvotes: ['user_9', 'user_10'],
      userDownvotes: [],
    },
    isEdited: false,
  },
  {
    id: '5',
    text: "Actually yes! We rolled this out last quarter and saw a 40% improvement in performance. Happy to share more details if you're interested.",
    author: {
      id: 'user_5',
      name: 'Mr. Mole',
      avatar: '/profilePictures/mrmole.jpg',
    },
    timestamp: Date.now() - 300000, // 5 minutes ago
    parentId: '4',
    reactions: {
      upvotes: 23,
      downvotes: 1,
      userUpvotes: ['user_4', 'user_11'],
      userDownvotes: [],
    },
    isEdited: false,
  },
];

export class CommentStorage {
  static getAllComments(): Comment[] {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }

    localStorage.setItem('comments', JSON.stringify(SEED_DATA));
    return SEED_DATA;
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

  static toggleDownvote(id: string, userId: string): Comment | null {
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

    if (hasUpvoted) {
      return null;
    }

    if (hasDownvoted) {
      // undo upvote
      reactions.downvotes -= 1;
      reactions.userDownvotes = reactions.userDownvotes.filter(
        (u) => u !== userId
      );
    } else {
      // continue with upvote
      reactions.downvotes += 1;
      reactions.userDownvotes.push(userId);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return comment;
  }
}
