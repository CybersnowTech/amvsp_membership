import { useState, useCallback } from 'react';

export function useDateMask() {
  const [value, setValue] = useState('');

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/\D/g, '');
    let formattedDate = '';

    if (input.length > 0) {
      // Add first slash after DD
      if (input.length >= 2) {
        formattedDate += input.substr(0, 2) + '/';
        // Add second slash after MM
        if (input.length >= 4) {
          formattedDate += input.substr(2, 2) + '/';
          if (input.length >= 6) {
            formattedDate += input.substr(4, 4);
          } else {
            formattedDate += input.substr(4);
          }
        } else {
          formattedDate += input.substr(2);
        }
      } else {
        formattedDate = input;
      }
    }

    setValue(formattedDate);
    return formattedDate;
  }, []);

  return { value, onChange: handleChange };
}