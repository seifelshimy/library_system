import * as React from "react";

export const Select = ({ children, ...props }) => {
  return (
    <select {...props} className="border rounded px-2 py-1 w-full">
      {children}
    </select>
  );
};

export const SelectTrigger = ({ children }) => <>{children}</>;
export const SelectValue = ({ placeholder }) => (
  <option value="" disabled hidden>
    {placeholder}
  </option>
);
export const SelectContent = ({ children }) => <>{children}</>;
export const SelectItem = ({ value, children }) => (
  <option value={value}>{children}</option>
);
