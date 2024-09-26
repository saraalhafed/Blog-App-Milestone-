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
  const { state } = useLocation();
  const { createBlog, updateBlog, categories, getCategories } = useBlog();

  const [blog, setBlog] = useState<IBlogForm>({
    title: '',
    content: '',
    image:
      'https://www.timsahajans.com.tr/data/uploads/Blog-Nedir-Cesitleri-Nelerdir.jpg',
    categoryId: '',
  });

  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    // Fetch categories when the component mounts
    getCategories();

    // If there's state (editing mode), update blog state and set edit mode
    if (state) {
      setBlog({
        title: state.title,
        content: state.content,
        image: state.image,
        categoryId: state.categoryId._id,
      });
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
  ) => {
    if (!isEditMode) {
      createBlog(values, navigate);
    } else {
      updateBlog(values, navigate, state._id);
    }
    setSubmitting(false);
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
        >
          {({ errors, touched, setFieldValue }) => (
            <Form>
              <InputComponent
                errors={errors}
                touched={touched}
                label="Blog Title"
                name="title"
                inputType="text"
                placeholder="NYC Best Attractions"
              />

              <div className="my-4">
                <label htmlFor="categoryId" className="form-label">
                  Category:
                </label>
                <Field
                  as="select"
                  name="categoryId"
                  id="categoryId"
                  className="form-control"
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </Field>
                {errors.categoryId && touched.categoryId ? (
                  <div className="text-red-500 text-sm">
                    {errors.categoryId}
                  </div>
                ) : null}
              </div>

              <div className="my-4">
                <label className="form-label">Post Content:</label>
                <CKEditor
                  editor={ClassicEditor}
                  data={blog ? blog.content : ''}
                  onChange={(_, editor) => {
                    const data = editor.getData();
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
                placeholder="https://image.com"
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
