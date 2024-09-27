import Layout from '../components/Layout';
import { useLocation, useNavigate } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import { object, string } from 'yup';
import { Field, Form, Formik } from 'formik';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { FormikHelpers } from 'formik';
import { useEffect, useState } from 'react';
import InputComponent from '../components/InputComponent';

const AddOrEditBlog = () => {
  const navigate = useNavigate();
  const { state } = useLocation();//to send id we need to know wich blod edit,we send from card throw navigeht  the stat blog with all the data
 

  const [blog, setBlog] = useState<IBlogForm>({
    title: '',
    content: '',
    image:
      'https://www.timsahajans.com.tr/data/uploads/Blog-Nedir-Cesitleri-Nelerdir.jpg',
    categoryId: '',
  });
  const { createBlog, updateBlog, categories, getCategories } = useBlog();//
    // alternatively you can have this state from your store to know wich blog is edit
  const [isEditMode, setIsEditMode] = useState(false); //to kown 

  useEffect(() => {
    // Fetch categories when the component mounts, in the input i have text is categriy
    getCategories();

    // If there's state (editing mode), update blog state and set edit mode
    if (state) {
      setBlog({//it com from card ,edit btn 
        title: state.title,
        content: state.content,
        image: state.image,
        categoryId: state.categoryId._id,//is an obj so in this way accsess the _id
      });
      //setBlog({ ...state, categoryId: state.category._id });...state includ everythig but not acces to the _id so we need to write in this way
      setIsEditMode(true);
    }
  }, [state, getCategories]); // Runs on component mount or when state changes

  const initialValues = blog;

  const validationSchema = object({
    title: string()
      .required('Title is required')
      .min(3, 'Title must be at least 3 characters long'),
    content: string().required('Content is required'),
    image: string().url('Invalid URL').required('Image URL is required'),
    categoryId: string().required('Category is required'),
  });

  const handleSubmit = (
    values: IBlogForm,
    { setSubmitting }: FormikHelpers<IBlogForm>
    // actions: FormikHelpers<IBlogForm>
  ) => {
    if (!isEditMode) {
      createBlog(values, navigate);
    } else {
      updateBlog(values, navigate, state._id);
    }
    setSubmitting(false);//submitting is finish i can use that formik agin .
   // actions.setSubmitting(false);
  };

  return (
    <Layout>
      <div className="w-full mx-auto p-6 max-w-[450px] md:max-w-[900px] bg-white border border-gray-200 rounded-lg shadow">
        <h2 className="text-2xl text-center text-gray-800 mb-8">
          {isEditMode ? 'EDIT' : 'ADD'} POST
        </h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize // This allows Formik to reinitialize the form when `initialValues` changes
       // if initial values are updated then the form will be reinitialized
       //initalvalue creat empty state,in edit mode maybe not com dirctly
       >
        {/* this func com from formik */}
          {({ errors, touched, setFieldValue }) => (
            <Form>
              <InputComponent
                errors={errors}
                touched={touched}
                label="Blog Title"
                name="title"
                inputType="text"
                placeholder="Enter blog title"
              />

              <div className="my-4">
                <label htmlFor="categoryId" className="form-label">
                  Category:
                </label>
                <Field  // the inputcomponent not sport select so i emplement that one
                  as="select"
                  name="categoryId"
                  id="categoryId"
                  className="form-control"
                >{/* it should contain options,i can  see all the categories in this field */}
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </Field>
                {/* if ther is error */}
                {errors.categoryId && touched.categoryId ? (
                  <div className="text-red-500 text-sm">
                    {errors.categoryId}
                  </div>
                ) : null}
              </div>

      {/* <InputComponent
                errors={errors}
                touched={touched}
                label="Content"
                name="content"
                inputType="textarea"
                placeholder="Enter a content"
              /> */}
              {/* library CKeditor famous component it can be use in any frame work ,here react */}
              <div className="my-4">
                <label className="form-label">Post Content:</label>
                <CKEditor
                  editor={ClassicEditor}//alotof featur italic or font blod
                  // ckedir is not working with value
                  // instead we need to use data props for value
                  data={blog ? blog.content : ''}//in editmod i want to see the data blog
                  onChange={(_, editor) => {//event not work here just with value i need e
                     // to update our state we cant use e.target.value
                    const data = editor.getData();//get all the blog
                     // here we need to update our content state
                    // to update it there is function coming from formik
                    // that function is setFieldValue
                    //is update the state with :, normaly formic update the state automaticly but her ckeditor is spical input need somthingels to update the state
                    setFieldValue('content', data);
                  }}
                />
                {errors.content && touched.content ? (
                  <div className="text-red-500 text-sm">{errors.content}</div>
                ) : null}
              </div>

              <InputComponent
                errors={errors}
                touched={touched}
                label="Image URL"
                name="image"
                inputType="url"
                placeholder="Enter image URL"
              />

              <div className="my-4 flex justify-center">
                <button className="btn-primary" type="submit">
                  {isEditMode ? 'EDIT' : 'ADD'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Layout>
  );
};

export default AddOrEditBlog;
