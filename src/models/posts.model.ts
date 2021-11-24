import {Comment} from "./comments.model";

export type Post = {
  id: number,
  title: string,
  content: string,
  numComments?: number,
  deleted?: boolean,
  created?: string,
  updated?: string
}

export type PostData = {
  title: string,
  content: string,
}

import data from "../db/data.json";

export class PostsModel {
  public static async getAllPosts(): Promise<Post[]> {
    return new Promise((resolve, reject) => {
      let result = data.posts.map(post => {
        let numComments = data.comments.filter(comment => comment.postID === post.id).length
        return {
          ...post,
          numComments: numComments
        }
      })
      resolve(result)
    });
  }

  public static async getPost(postID: number): Promise<Post> {
    return new Promise((resolve, reject) => resolve(data.posts.find(post => post.id === postID)));
  }
}