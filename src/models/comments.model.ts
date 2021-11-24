import {
  ApplicationError,
  COMMENT_ALREADY_DELETED,
  COMMENT_NOT_FOUND
} from "../ApplicationError";

export type Comment = {
  id: number,
  postID: number,
  name?: string,
  message: string,
  deleted?: boolean,
  created?: string,
  updated?: string
}

export type CommentData = {
  postID: number,
  name?: string,
  message: string,
}

import data from "../db/data.json";

export class CommentsModel {
  public static async getCommentsForPost(postID: number): Promise<Comment[]> {
    return new Promise((resolve, reject) => resolve(data.comments.filter(comment => comment.postID === postID)));
  }

  public static async addComment(newComment: CommentData): Promise<Comment> {
    return new Promise((resolve, reject) =>{
      let lastID = data.comments.map(c => c.id).sort((a, b) => b - a)[0];
      let now = new Date().toISOString();

      let comment = {
        id: lastID + 1,
        postID: newComment.postID,
        name: newComment.name,
        message: newComment.message,
        deleted: false,
        created: now,
        updated: now
      };

      data.comments.push(comment);

      resolve(comment);
    });
  }

  public static async updateComment(commentID: number, newName?: string, newMessage?: string): Promise<Comment> {
    return new Promise((resolve, reject) => {
      let commentIndex = data.comments.findIndex(c => c.id === commentID);
      let now = new Date().toISOString();

      if (commentIndex < 0) {
        reject(ApplicationError.fromIError(COMMENT_NOT_FOUND))
      } else if (data.comments[commentIndex].deleted) {
        reject(ApplicationError.fromIError(COMMENT_ALREADY_DELETED))
      }

      let updatedComment = {
        id: commentID,
        postID: data.comments[commentIndex].postID,
        name: newName || data.comments[commentIndex].name,
        message: newMessage || data.comments[commentIndex].message,
        deleted: false,
        created: data.comments[commentIndex].created,
        updated: now
      };

      data.comments[commentIndex] = updatedComment;

      resolve(updatedComment);
    });
  }
}