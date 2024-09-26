import axios from 'axios';
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  Dispatch,
  SetStateAction,
} from 'react';
import { toast } from 'react-toastify';

// Define interfaces for posts and comments

interface IBlogContext {
  getBlog: (id: string) => Promise<void>;
  getBlogs: () => Promise<void>;
  createBlog: (
    data: IBlogForm,
    navigate: (path: string) => void
  ) => Promise<void>;
  addComment: (id: string, content: string) => Promise<void>;
  deleteBlog: (id: string, navigate: (path: string) => void) => Promise<void>;
  addLike: (id: string) => Promise<void>;
  updateBlog: (
    data: IBlogForm,
    navigate: (path: string) => void,
    id: string
  ) => Promise<void>;
  currentBlog: IBlog | null;
  blogs: IBlog[];
  categories: IBlogCategory[];
  getCategories: () => Promise<void>;
  paginationData: IPaginationData;
  page: number;
  setPage: Dispatch<SetStateAction<number>>; // Corrected type
}
//we have 2 option 
//way1: const AuthContext = createContext<IAuthContext | undefined>(undefined);
const BlogContext = createContext<IBlogContext>({//this syntax is better
  getBlog: async () => {},
  getBlogs: async () => {},
  createBlog: async () => {},
  addComment: async () => {},
  deleteBlog: async () => {},
  addLike: async () => {},
  updateBlog: async () => {},
  currentBlog: null,
  blogs: [],
  categories: [],
  getCategories: async () => {},
  paginationData: {} as IPaginationData,
  page: 1,
  setPage: () => {},
});// here we give one type and provide  it will be not undefin

const baseUrl = 'https://33000.fullstack.clarusway.com';

export const BlogProvider = ({ children }: { children: ReactNode }) => {

  const [currentBlog, setCurrentBlog] = useState<ISingleBlog | null>(null);//initially i dont have any blog
  const [blogs, setBlogs] = useState<IBlog[]>([]);//no blogs
  const [categories, setCategories] = useState<IBlogCategory[]>([]);
// this part is for pagination
  const [page, setPage] = useState<number>(1);
  const [paginationData, setPaginationData] = useState<IPaginationData>({
    count: 0,//how many page i have
    next: false,
    previous: false,
    totalPages: 0,
  });

  useEffect(() => {
    if (page) {
      getBlogs(page);
    }
  }, [page]);

  // Get all posts it will used in home 
  const getBlogs = async (page?: number) => {//? optinal make 2 differant ways
    let url = `${baseUrl}/blogs/?limit=10`;
    if (page) {
      url = `${baseUrl}/blogs/?limit=10&page=${page}`;
    }
    try {
      const { data } = await axios<IBlogs>(url);//get automaticly comt const { data } = await axios.get<IBlogs>(url);
      console.log(data); // Log the response data to the console for debuggin
      setBlogs(data.data);
      setPaginationData({
        count: data.details.totalRecords, // 41 blogs
        next: data.details.pages.next, // if we are in page 2, next is 3
        previous: data.details.pages.previous, // if we are in page 2, previous is 1
        totalPages: Math.ceil(data.details.totalRecords / 10), // if have 41, total pages is 5
      });
      // I have 41 blogs. When I use pagination all the blogs are not comming.
      // in page 1, you will have the blogs from 1 to 10
      // in page 2, you will have the blogs from 11 to 20
      // in page 3, you will have the blogs from 21 to 30
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  // Get a single post,click more in home
  const getBlog = async (id: string) => {
   // const token = JSON.parse(localStorage.getItem('user') || '{}').token;
   const { token } = JSON.parse(localStorage.getItem('user') || '{}');
    try {//in detail page  will use it
      const { data } = await axios.get<ISingleBlogResponse>(`${baseUrl}/blogs/${id}/`, { /* ts not compblain that beacus in feauture after runtime ,ts just befor run time ,but is better to provide the type,it help us later */
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });
      //after get response i update my state

      setCurrentBlog(data.data);
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  // Create Post,new post page
  const createBlog = async (
    data: IBlogForm,
    navigate: (path: string) => void
  ) => {/* 
    const token = JSON.parse(localStorage.getItem('user') || '{}').token; */
    const { token } = JSON.parse(localStorage.getItem('user') || '{}');
    console.log(data);
    console.log(token);
    try {
      await axios({
        method: 'POST',
        url: `${baseUrl}/blogs/`,
        data: data,
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      toast.success('Post created successfully!');
      navigate('/');
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  // Add a comment to a post
  const addComment = async (id: string, comment: string) => {
    const token = JSON.parse(localStorage.getItem('user') || '{}').token;
    try {
      await axios.post(
        `${baseUrl}/comments/`,
        { blogId: id, comment },
        {
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      getBlog(id);
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  // Delete a post using its id
  const deleteBlog = async (id: string, navigate: (path: string) => void) => {
    const token = JSON.parse(localStorage.getItem('user') || '{}').token;
    console.log(token);
    console.log(id);
    try {
      await axios.delete(`${baseUrl}/blogs/${id}/`, {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });
      toast.success('Post deleted successfully!');
      navigate('/'); // navigate to a different page if necessary
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  // Add a like to a post
  const addLike = async (id: string) => {
    const token = JSON.parse(localStorage.getItem('user') || '{}').token;
    try {
      await axios.post(
        `${baseUrl}/blogs/${id}/postlike/`,
        {},
        {
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      getBlog(id); // Refresh the posts list
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  // Update a post using its id
  const updateBlog = async (
    data: IBlogForm,
    navigate: (path: string) => void,
    id: string
  ) => {
    const token = JSON.parse(localStorage.getItem('user') || '{}').token;
    try {
      await axios.put(`${baseUrl}/blogs/${id}/`, data, {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });
      toast.success('Post updated successfully!');
      navigate('/');
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  const getCategories = async () => {
    try {
      const { data } = await axios.get(`${baseUrl}/categories/`);
      setCategories(data.data);
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  const value = {
    blogs,
    getBlog,
    getBlogs,
    createBlog,
    deleteBlog,
    addComment,
    addLike,
    updateBlog,
    currentBlog,
    categories,
    getCategories,
    paginationData,
    setPage,
    page,
  };

  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
};
//custom hook
export const useBlog = () => useContext(BlogContext);
