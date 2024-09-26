import { Form, Formik, FormikHelpers } from 'formik';
import { Link } from 'react-router-dom';
import InputComponent from '../components/InputComponent';
import * as Yup from 'yup';

// Define the type for individual input field props
interface IInput {
  name: string;
  label: string;
  inputType?: string;//for the field in input
  placeholder?: string;
}

// Define the props interface
interface IFormComponentProps<T> {
  handleSubmit: (
    values: T,//in every form will have a differant structure for value
    formikHelpers: FormikHelpers<T>/* the same type like value */ // this come from formik
  ) => void | Promise<void>;
  initialValues: T;
  ValidationSchema: Yup.ObjectSchema<any>;//i dont want to give type of each value ,
  title: string;
  inputs: IInput[];
  buttonText: string;
  bottomLink?: string;
  bottomText1?: string;
  bottomText2?: string;
}

const FormComponent = <T extends object>({
  handleSubmit,
  initialValues,
  ValidationSchema,
  title,
  inputs,
  buttonText,
  bottomText1,
  bottomText2,
  bottomLink,
}: IFormComponentProps<T>) => {
  return (
    <div className="w-full max-w-sm p-8 mx-auto bg-white border border-gray-200 rounded-lg shadow">
      <Formik
        onSubmit={handleSubmit}
        initialValues={initialValues}
        validationSchema={ValidationSchema}
      >
        {/* in formik for error */}
        {({ errors, touched }) => (
          <Form className="space-y-5">
            <h5 className="text-3xl text-center font-bold text-gray-500">
              {title} {/* register */}
            </h5>
{/* i recive the input as props  */}
            {inputs.map((input) => (
              <InputComponent
                key={input.name}
                errors={errors}
                touched={touched}
                label={input.label}
                name={input.name as keyof T}
                inputType={input.inputType}
                placeholder={input.placeholder}
              />
            ))}

            <div className="flex flex-col justify-center items-center space-y-4">
              <button type="submit" className="btn-primary">
                {buttonText} {/* sin up =register */}
              </button>
            </div>
            {/* not exist */}
            {bottomText1 && (
              <p className="text-sm font-medium text-gray-500">
                {bottomText1}{' '}{/* "Already have an account?" space*/}
                <Link
                  to={bottomLink as string}
                  className="text-blue-700 hover:underline"
                >
                  {bottomText2}{/* sin in */}
                </Link>
              </p>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default FormComponent;
