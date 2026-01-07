export interface Comment {
  _id: string;
  lessonId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentPayload {
  lessonId: string;
  content: string;
  parentId?: string;
}
