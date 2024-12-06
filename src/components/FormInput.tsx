import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  error?: string;
  multiline?: boolean; // Optional prop to support textarea
}

export function FormInput({ label, error, id, multiline, className, ...props }: FormInputProps) {
  const InputComponent = multiline ? 'textarea' : 'input'; // Determine input type
  
  return (
    <div className="space-y-1">
      {/* Accessible label linked to the input via id */}
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>

      {/* Input or Textarea Component */}
      <InputComponent
        id={id}
        {...props}
        className={`mt-1 block w-full rounded-md shadow-sm py-3 px-4
          ${error 
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }
          transition-colors duration-200 ${className || ''}` // Allow custom classes
        }
      />

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}
