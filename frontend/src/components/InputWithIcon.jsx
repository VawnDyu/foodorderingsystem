import React from 'react';

import styles from './InputWithIcon.module.css'

const InputWithIcon = React.forwardRef(function InputWithIcon({ icon: Icon, type, name, value, onChange, placeholder, className }, ref ) {
  return (
    <div className={styles.inputWrapper}>
      <Icon className={styles.inputIcon} />
      <input
        ref={ref}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${styles.inputField} ${className}`}
        required
      />
    </div>
  );
});

export default InputWithIcon;