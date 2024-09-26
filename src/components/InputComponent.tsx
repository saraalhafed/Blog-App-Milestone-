import { Field } from 'formik';
import { FormikErrors, FormikTouched } from 'formik';

interface IInputComponentProps<T> {
  errors: FormikErrors<T>;
  touched: FormikTouched<T>;
  name: keyof T; // The name corresponds to a key in the form values
  label: string;
  inputType?: string; //for the field in input
  placeholder?: string;
}

const InputComponent = <T extends object>({
  errors,
  touched,
  label,
  name,
  inputType = 'text',//defultvalue
  placeholder,
}: IInputComponentProps<T>) => {
  return (
    <div>
      <label htmlFor={name as string} className="form-label">
        {label}:
      </label>
      <Field  //from formik
        type={inputType}
        name={name as string}
        id={name as string}
        className="form-control" // just styling in index.css
        placeholder={placeholder}
      />
      {errors[name] && touched[name] && (
        <p className="mt-1 text-red-500 text-xs">{errors[name] as string}</p>
      )}
    </div>
  );
};

export default InputComponent;
