import { FieldValues, UseFormSetError } from 'react-hook-form';

// Password mismatch validator
export const passwordMismatch = (
  controlName: string,
  matchingControlName: string
) => {
  return (values: FieldValues, setError: UseFormSetError<FieldValues>) => {
    const control = values[controlName];
    const matchingControl = values[matchingControlName];

    if (control !== matchingControl) {
      setError(matchingControlName, { type: 'manual', message: 'Passwords do not match' });
    } else {
      setError(matchingControlName, { type: 'manual', message: '' });
    }
  };
};

// Strong password regular expression
export const StrongPasswordRegx: RegExp = /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;
