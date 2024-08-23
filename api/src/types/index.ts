export interface User {
    id: string | number;
    name: string;
    email: string;
    posts: Post[];
    createdAt: Date;
  }
  
  export interface JPUser extends User {
    id: number; // Overwrite the type of id to number
  }
  

export interface Post {
    userId: string
    id: string
    title: string
    body: string
    createdAt: Date;
    comments: Comment[]
}

export interface Comment{
    postId: string
    id: string
    name: string
    email: string
    body: string
    createdAt: Date;
}