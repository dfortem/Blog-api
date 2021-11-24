import * as express from "express"
import { Request, Response } from "express"
import { IController, routerPath } from "../interfaces/IController.interface"
import { CommentsModel, CommentData, Comment } from "../models/comments.model";
import { Post, PostsModel } from "../models/posts.model";
import {
  ApplicationError,
  handleError,
  MISSING_COMMENT_ID,
  MISSING_POST_ID,
  MISSING_COMMENT_MESSAGE
} from "../ApplicationError";

class BlogController implements IController {
  public router = express.Router()

  constructor() {
    this.initRoutes()
  }

  public initRoutes() {
    this.router.get(routerPath("/v1/posts"), this.getAllPosts)
    this.router.get(routerPath("/v1/posts/:postID"), this.getPost)
    this.router.get(routerPath("/v1/comments/:postID"), this.getCommentsForPost)
    this.router.post(routerPath("/v1/comments"), this.addCommentForPost)
    this.router.put(routerPath("/v1/comments"), this.updateComment)
  }

  getAllPosts = async (req: Request, res: Response) => {
    PostsModel.getAllPosts()
      .then((posts: Post[]) => {
        res.send(posts);
      })
      .catch(err => handleError(err, res));
  }

  getPost = async (req: Request, res: Response) => {
    if(!req.params.postID) {
      handleError(ApplicationError.fromIError(MISSING_POST_ID), res)
    }

    PostsModel.getPost(+req.params.postID)
      .then((post: Post) => {
        res.send(post);
      })
      .catch(err => handleError(err, res));
  }

  getCommentsForPost = async (req: Request, res: Response) => {
    if(!req.params.postID) {
      handleError(ApplicationError.fromIError(MISSING_POST_ID), res)
    }

    CommentsModel.getCommentsForPost(+req.params.postID)
      .then((comments: Comment[]) => {
        res.send(comments);
      })
      .catch(err => handleError(err, res));
  }

  addCommentForPost = async (req: Request, res: Response) => {
    if(!req.body.postID) {
      handleError(ApplicationError.fromIError(MISSING_POST_ID), res)
    } else if(!req.body.message) {
      handleError(ApplicationError.fromIError(MISSING_COMMENT_MESSAGE), res)
    }

    let comment: CommentData = {
      postID: +req.body.postID,
      name: req.body.name,
      message: req.body.message,
    }

    CommentsModel.addComment(comment)
      .then((comment: Comment) => {
        res.send(comment);
      })
      .catch(err => handleError(err, res));
  };

  updateComment = async (req: Request, res: Response) => {
    if(!req.body.id) {
      handleError(ApplicationError.fromIError(MISSING_COMMENT_ID), res)
    }

    CommentsModel.updateComment(+req.body.id, req.body.name, req.body.message)
      .then((comment: Comment) => {
        res.send(comment);
      })
      .catch(err => handleError(err, res));
  };
}

export default BlogController