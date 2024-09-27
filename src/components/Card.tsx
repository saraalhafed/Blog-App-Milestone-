import { useState } from 'react';
import { BiSolidComment, BiSolidLike } from 'react-icons/bi';
import { BsFillEyeFill } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useBlog } from '../context/BlogContext';

interface CardProps {
  blog: ISingleBlog |IBlog;
  preview?: boolean;
}
// way to send this blog as props ,because we can use context ,another way to send the blog we can use location from router  but here we dont have this all this info in card so we cant use it here because her api send not all the info for detail page
export default function Card({ blog, preview }: CardProps) {
//dommy data not real
// blog = {
  //   ...blog,
  //   image:
  //     'https://mlect5lsyspg.i.optimole.com/cb:5Q6h.2bbe3/w:620/h:300/q:mauto/f:best/https://ddsmatch.com/wp-content/uploads/2021/03/post-image.jpg',
  //   title: 'Blog Title',
  //   content: 'Blog Content',
  //   _id: '1',
  //   createdAt: '2024-01-01',
  //   countOfVisitors: 5,
  //   likes: [],
  //   comments: [],
  // };

  const [enteredComment, setEnteredComment] = useState('');//for input comment
  const navigate = useNavigate();
  const { deleteBlog, addComment, addLike } = useBlog();
  const { userInfo } = useAuth();//get the  all user info

  const isOwner = (blog as ISingleBlog)?._id === userInfo?._id;//to check if this user is the owner for this blog,in this case i see delet ,edit btn 
  const isLiked =(blog as ISingleBlog).likes?.includes(userInfo?._id as string);
  //like is array includ all the id for user wich make like for this blog

  console.log(blog);
// console.log(userInfo);

  console.log('isOwner', isOwner, 'isLiked', isLiked);

  const handleDelete = (id: string) => {
    deleteBlog(id, navigate);
  };

  const handleLike = (id: string) => {
    addLike(id);
  };

  const handleComment = (id: string) => {
    if (enteredComment.trim().length == 0) //if no comment
      return toast.error('Please add the comment');//trim string method remove empty spaces from start and end
    addComment(id, enteredComment);//else ther is comment we call the func to add this comment
    setEnteredComment('');
  };

  return (
    //to render html content <p></p>
    <div className="border border-gray-200 shadow rounded-lg">
      {/* //* image */}
      <Link to={`/blog/details/${blog?._id}`}>
        <img src={blog?.image} className="h-[200px] object-cover w-full" />
      </Link>
      {/* //* card content */}
      <div className="flex flex-col p-5">
        {/* //* card title */}
        <Link to={`/blog/details/${blog?._id}`}>
          <h5 className="mb-2 text-2xl font-bold text-center">{blog?.title}</h5>
        </Link>
        {/* //* card details */}
        <div>
          <div className="flex justify-between">
            <p className="font-bold">Published On:</p>
            <p className="italic">{new Date(blog?.createdAt).toDateString()}</p>
          </div>
          {/* render nameuser */}
          {(blog as ISingleBlog)?.userId?.username && (//acording to the response of api,in home api not send us usernam just date in the carde but in detail page we recive from api a usernam,we can render it in the card in detailpage
            <div className="flex justify-between">
              <p className="font-bold">Author:</p>
              <p className="italic">{(blog as ISingleBlog).userId.username}</p>
            </div>
          )}
        </div>
        <hr />

        {/* //* blog content */}
        <div
          className={
            preview // 2 perwiew (i render all the carde)or to (i render single be card )
              ? 'line-clamp-1 truncate whitespace-pre-wrap my-3 flex-1'
              : ''
          }
          dangerouslySetInnerHTML={{ __html: blog?.content }}//to remove <p>content</p>
        >
          {/* {blog?.content} */}
           {/* our blog.content contains html tags in it. such as <p></p>. And I dont want to render them. In that case I need to update the inner html of this div */}
        </div>

        <hr />

        <div
          className={`flex space-x-10 pr-3 mt-5 ${
            preview ? 'justify-center' : 'justify-between'
          }`}
        >
          {/* //* Delete and Edit Buttons*/}
          {!preview && isOwner && (
            <div className="flex space-x-5 my-5">
              <button
                className="btn-danger"
                onClick={() => handleDelete(blog?._id)}
              >
                DELETE
              </button>
              <button
                className="btn-warning"
                onClick={() =>
                  navigate(`/blog/edit/${blog?._id}`, { state: blog })//send this blog to editpage  and recive that ther with uselocation
               // alternatively you can have a state in your context to track whether you are editing or not
                  // setIsEditMode(!isEditMode) in the context
                }
              >
                EDIT
              </button>
            </div>
          )}

          {/* //* Like, Comment, View Icons*/}
          <div className="flex space-x-5 my-5">
            <div className="relative">
              <BiSolidLike
                className={`text-2xl ${
                  isLiked ? 'text-blue-800' : 'text-blue-500' // if the owner make like the like darker than another like
                } relative cursor-pointer`}
                onClick={() => {
                  handleLike(blog?._id);
                }}
              />
              <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold bg-red-500 border-2 border-white text-white rounded-full -top-3 -right-4">
                {blog?.likes.length}
              </div>
            </div>
            <div className="relative">
              <BiSolidComment className="text-2xl text-green-500 relative cursor-pointer" />
              <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold bg-red-500 border-2 border-white text-white rounded-full -top-3 -right-4">
                {blog?.comments.length}
              </div>
            </div>
            <div className="relative">
              <BsFillEyeFill className="text-2xl text-gray-500 relative cursor-pointer" />
              <div className="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold bg-red-500 border-2 border-white text-white rounded-full -top-3 -right-4">
                {blog?.countOfVisitors}
              </div>
            </div>
          </div>
        </div>

        <hr />
        {/* //* Comments Section */}
        {!preview && blog?.comments.length !== 0 && (
          <>
            {(blog as ISingleBlog)?.comments.map((comment, index) => (
              <div
                key={index}
                className="flex justify-between items-center my-10"
              >
                <div className="flex space-x-5">
                  <p>{comment?.userId?.username}</p>
                  <p className="font-italic"> {comment?.comment}</p>{/* the content */}
                </div>
                <p>
                  {comment?.createdAt &&
                    new Date(comment?.createdAt).toDateString()}
                </p>
              </div>
            ))}
          </>
        )}

        {!preview && blog?.comments?.length == 0 && (
          <p className="text-center"> No comments add one</p>
        )}

        {/* //* Add Comment Section */}

        {!preview && ( // we dont render all the card ,just one card
          <div className="flex space-x-2">
            <input
              type="text"
              className="form-control"
              value={enteredComment}//to make input controled state and handleevevnt
              onChange={(e) => setEnteredComment(e.target.value)}
            />
            <button
              className="btn-primary"
              onClick={() => handleComment(blog?._id)}
            >
              {' '}
              Add
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
