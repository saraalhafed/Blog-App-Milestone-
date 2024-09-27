import { useNavigate } from 'react-router-dom';
import { object, ref, string } from 'yup';
import FormComponent from '../components/FormComponent';
import { useAuth } from '../context/AuthContext';



const inputs = [
  {
    name: 'username',
    label: 'Username',
    inputType: 'text',
    placeholder: 'johndoe',
  },
  {
    name: 'email',
    label: 'Email',
    inputType: 'email',
    placeholder: 'john@example.com',
  },
  {
    name: 'firstName',
    label: 'First Name',
    inputType: 'text',
    placeholder: 'John',
  },
  {
    name: 'lastName',
    label: 'Last Name',
    inputType: 'text',
    placeholder: 'Doe',
  },
  {
    name: 'password',
    label: 'Password',
    inputType: 'password',
    placeholder: '********',
  },
  {
    name: 'password2',
    label: 'Confirm Password',
    inputType: 'password',
    placeholder: '********',
  },
];
export default function Register() {
  const initialValues = {
    username: '',//ts not comlain this variabls because ittake a value
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    password2: '',
   // dummyData: [] here i need type for this array 
  };

  const { register } = useAuth();
  const navigate = useNavigate();

  // validation
  const registerSchema = object().shape({
    username: string().required('Username is required!'),
    email: string().email('Invalid Email').required('Email is required!'),
    firstName: string().required('First name is required!'),
    lastName: string().required('Last name is required!'),
    password: string()
      .min(8, 'Min 8 characters')
      .required('Password is required!'),
    password2: string()
      .required('Password is required!')
      .oneOf([ref('password')], 'Password does not match'),//ensue they mactch eachother
  });

  const handleSubmit = (values, actions) => {
    actions.setSubmitting(false);
    //i need to call my register from context
    register(values, navigate);
  };

  return (
    <section className="flex items-center min-h-screen">
      <img
        src="https://images.unsplash.com/photo-1542435503-956c469947f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
        className="hidden lg:block w-7/12 h-screen object-cover"
        alt="login page image"
      />
      <FormComponent
        handleSubmit={handleSubmit}
        initialValues={initialValues}
        ValidationSchema={registerSchema}
        title="Register"
        inputs={inputs}
        buttonText="Sign Up"
        bottomText1="Already have an account?"
        bottomLink="/auth/login"
        bottomText2="Sign In"
      />
    </section>
  );
}
//it should be in each form page own handelsubmit and own initial vlues and sechmavalidations
