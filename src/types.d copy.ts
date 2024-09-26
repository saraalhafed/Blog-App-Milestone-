// interface userInterface {
//   username: string;
//   email: string;
//   firstName: string;
//   lastName: string;
//   isAdmin: boolean;
// }

// interface authInterface {
//   data: userInterface;
//   token: string;
// }

// interface currentUserInterface extends userInterface {
//   token: string;
// }

//! Auth Type Definitions
interface IUser {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
  _id: string;
}

interface ICurrentUser extends IUser {
  token: string;
}

//! Blog Type Definitions
interface IBlog {
  _id: string;
  userId: string;
  categoryId: string;
  title: string;
  content: string;
  image: string;
  isPublish: boolean;
  comments: string[];
  likes: string[];
  countOfVisitors: number;
  createdAt: string;
  updatedAt: string;
}

interface IBlogForm {
  categoryId: string;
  title: string;
  content: string;
  image: string;
}

// type IBlogForm = Omit<
//   IBlog,
//   '_id',
//   'comments',
//   'isPublish',
//   'likes',
//   'countOfVisitors',
//   'createdAt',
//   'updatedAt',
//   'userId'
// >;

interface IBlogs {
  error: string;
  data: IBlog[];
  details: {
    totalRecords: number;
    pages: {
      next: number | boolean;
      previous: number | boolean;
    };
  };
}

interface IBlogUser {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
}

interface IBlogCategory {
  _id: string;
  name: string;
}

interface IBlogComment {
  _id: string;
  blogId: string;
  userId: IBlogUser;
  comment: string;
  createdAt: string;
}

interface ISingleBlog {
  _id: string;
  userId: IBlogUser;
  categoryId: IBlogCategory;
  title: string;
  content: string;
  image: string;
  isPublish: boolean;
  comments: IBlogComment[];
  likes: string[];
  countOfVisitors: number;
  createdAt: string;
  updatedAt: string;
}

interface IPaginationData {
  count: number;
  next: number | boolean;
  previous: number | boolean;
  totalPages: number;
}
