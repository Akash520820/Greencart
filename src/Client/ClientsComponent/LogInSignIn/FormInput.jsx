import React from 'react';

const FormInput = ({ label, type, name, value, onChange, placeholder }) => {
  return (
    <div className="auth-form-input-group">
      <label>{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="auth-form-input"
        required
      />
    </div>
  );
};

export default React.memo(FormInput);