import Layout from '../components/Layout';
import Card from '../components/Card';
import { useBlog } from '../context/BlogContext';
import { useEffect } from 'react';
import PaginationComponent from '../components/PaginationComponent';

export default function Home() {
  const { blogs, getBlogs, getCategories } = useBlog();

  useEffect(() => {
    getBlogs(); //to ssee the latest update for all the blogs []
    getCategories();
  }, []);

  return (
    <Layout>
      {blogs.length === 0 && ( //if ther is no posts
        <div className="flex justify-center items-center">
          <p>No Posts , Add one</p>
        </div>
      )}
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-5">
        {blogs.map((item) => (
          <Card key={item?._id} blog={item} preview={true} />
        ))}
      </div>

      <PaginationComponent />
    </Layout>
  );
}
