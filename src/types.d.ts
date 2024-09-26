//! Auth Type Definitions
//user type
interface IUser { //from the api response ,register
  username: string;// userData: IUser,
  email: string;
  firstName: string;//from api i take what i need to use
  lastName: string;
  isAdmin?: boolean;//i need it in my app
  _id?: string; //i need it also 
}

//for our state  userInfo: ICurrentUser | null;
interface ICurrentUser extends IUser {
  token: string;
}

//! Blog Type Definitions
//for update the blog,for current blog
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
//create a new  blog form the form,
interface IBlogForm {
  categoryId: string;// from api it requierd
  title: string;
  content: string;
  image: string;
}

// Omit is used to omit certain properties from an object

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

interface IBlogs { //for api
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
//single specific blog
interface IBlogUser {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
}

//for categories [],to get single category,i choos this
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
//get a single blog we choose from the response what we need 
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
//get blog
//here we take  the response just data everything inside it ,but in abov i choose what i need
interface ISingleBlogResponse {
  data: ISingleBlog;
}

interface IPaginationData {
  count: number;
  next: number | boolean;
  previous: number | boolean;
  totalPages: number;
}
