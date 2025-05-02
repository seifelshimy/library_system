import React from "react";

export function Switch({ checked, onChange }) {
  return (
    <input
      type="checkbox"
      className="form-switch h-5 w-10 rounded-full border"
      checked={checked}
      onChange={onChange}
    />
  );
}