// React and React Router
import { Link, useNavigate } from 'react-router-dom';

// React hooks
import { useState, useRef, useEffect } from 'react';

// Axios for API calls
import axios from '../api/axios';

// Stylesheets
import styles from './SignUp.module.css';

// React Icons
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { RxCheckCircled, RxCrossCircled, RxEnvelopeClosed, RxPerson, RxLockClosed, RxReload } from 'react-icons/rx';

// Toast notifications
import { toast } from 'react-toastify';

// Custom Components
import InputWithIcon from '../components/InputWithIcon';

// Custom hooks
import { useDocumentTitle } from '../hooks/useDocumentTitle';

// Utility
import { someAsyncAction } from '../utils/someAsyncAction';

const SignupForm = () => {
  useDocumentTitle('Sign Up');
  someAsyncAction();

  const [formData, setFormData] = useState({nickname: '', email: '', username: '', password: '',  confirmPassword: '', agree: false});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  // Validation Helpers
  const isValidNickname = (nickname) => /^[A-Za-z\s'-]+$/.test(nickname);
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidUsername = (username) => /^[a-zA-Z0-9._-]{4,}$/.test(username);
  const isStrongPassword = (password) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const [validation, setValidation] = useState({
    nickname: '',
    email: '',
    username: '',
    password: '',
  });

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(prev => !prev);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    const newValue = type === 'checkbox' ? checked : value; //replacing value with checked only if it's a checkbox.

    setFormData((prev) => ({ ...prev, [name]: newValue }));

    // Real-time validation
    if (name === 'nickname') {
      setValidation((prev) => ({
        ...prev,
        nickname: isValidNickname(value) ? (
          <span className={styles.validationSuccess}>
            <RxCheckCircled className={styles.validationIcon} /> Valid nickname
          </span>
        ) : (
          <span className={styles.validationError}>
            <RxCrossCircled className={styles.validationIcon} /> Invalid nickname format
        </span>
        ),
      }));
    }

    if (name === 'email') {
      setValidation((prev) => ({
        ...prev,
        email: isValidEmail(value) ? (
          <span className={styles.validationSuccess}>
            <RxCheckCircled className={styles.validationIcon} /> Valid email
          </span>
        ) : ( 
          <span className={styles.validationError}>
            <RxCrossCircled className={styles.validationIcon} /> Invalid email format
          </span>
          ),
      }));
    }

    if (name === 'username') {
      setValidation((prev) => ({
        ...prev,
        username: isValidUsername(value) ? (
          <span className={styles.validationSuccess}>
            <RxCheckCircled className={styles.validationIcon} /> Username looks good
          </span>
        ) : ( 
          <span className={styles.validationError}>
            <RxCrossCircled className={styles.validationIcon} /> At least 4 characters, no spaces
          </span>
          ),
      }));
    }

    if (name === 'password') {
      setValidation((prev) => ({
        ...prev,
        password: isStrongPassword(value) ? (
          <span className={styles.validationSuccess}>
            <RxCheckCircled className={styles.validationIcon} /> Strong password
          </span>
        ) : ( 
          <span className={styles.validationError}>
            <RxCrossCircled className={styles.validationIcon} /> At least 8 characters, include letters & numbers
          </span>
          ),
      }));
    }

    if (name === 'confirmpassword') {
      setValidation((prev) => ({
        ...prev,
        password: isStrongPassword(value) ? (
          <span className={styles.validationSuccess}>
            <RxCheckCircled className={styles.validationIcon} /> Strong password
          </span>
        ) : ( 
          <span className={styles.validationError}>
            <RxCrossCircled className={styles.validationIcon} /> At least 8 characters, include letters & numbers
          </span>
          ),
      }));
    }

    if (name === 'password' || name === 'confirmPassword') {
      const updatedFormData = {
        ...formData,
        [name]: value,
      };
    
      const passwordsMatch = updatedFormData.password === updatedFormData.confirmPassword;

      setValidation((prev) => ({
        ...prev,
        confirmPassword: passwordsMatch ? (
            <span className={styles.validationSuccess}>
              <RxCheckCircled className={styles.validationIcon} /> Passwords match
            </span>
          ) : (
            <span className={styles.validationError}>
              <RxCrossCircled className={styles.validationIcon} /> Passwords do not match
            </span>
          ),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    // Wait for the async action to complete
    await someAsyncAction();

    // Validations
    if(!isValidNickname(formData.nickname)) {
      toast.error('Invalid nickname format');
      setIsLoading(false);
      return;
    }

    if (!isValidEmail(formData.email)) {
      toast.error('Invalid email format');
      setIsLoading(false);
      return;
    }
    
    if (!isValidUsername(formData.username)) {
      toast.error('Username must be 4+ characters, no spaces');
      setIsLoading(false);
      return;
    }

    if (!isStrongPassword(formData.password)) {
      toast.error('Password must be 8+ characters, include letters & numbers');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (!formData.agree) {
      toast.error('You must agree to the Terms and Privacy Policy');
      setIsLoading(false);
      return;
    }

    // Once validations are passed, proceed with the API request
    try {
      const res = await axios.post('/auth/signup', formData);
      toast.success('Sign up successful! You will be redirected to login in a moment');
      setTimeout(() => {
        navigate('/login');
      }, 6000); //6 secs
    } catch (err) {
      toast.error(err.response?.data?.error || 'Sign Up failed');
    }

    setIsLoading(false);
  };
  
  return (
    <div className={styles.signUpContainer}>
        <form onSubmit={handleSubmit}>
        <h2>Sign Up</h2>

        <InputWithIcon
          ref={inputRef}
          icon={RxPerson}
          type="text"
          name="nickname"
          value={formData.nickname}
          onChange={handleChange}
          placeholder="Nickname"
          className={
            formData.nickname.length === 0
                ? styles.validationNeutralInput
                : isValidNickname(formData.nickname)
                ? styles.validationSuccessInput
                : styles.validationErrorInput
          }
        />
        
        {formData.nickname.length > 0 && ( <small>{validation.nickname}</small> )}

        <InputWithIcon
          icon={RxEnvelopeClosed}
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className={
            formData.email.length === 0
                ? styles.validationNeutralInput
                : isValidEmail(formData.email)
                ? styles.validationSuccessInput
                : styles.validationErrorInput
          }
        />

        {formData.email.length > 0 && ( <small>{validation.email}</small> )}

        <InputWithIcon
          icon={RxPerson}
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
          className={
            formData.username.length === 0
                ? styles.validationNeutralInput
                : isValidUsername(formData.username)
                ? styles.validationSuccessInput
                : styles.validationErrorInput
          }
        />

        {formData.username.length > 0 && ( <small>{validation.username}</small> )}

        <div className={styles.passwordField}>
          <InputWithIcon
            icon={RxLockClosed}
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className={
              formData.password.length === 0
                ? styles.validationNeutralInput
                : isStrongPassword(formData.password)
                ? styles.validationSuccessInput
                : styles.validationErrorInput
            }
          />
          <span className={styles.toggleIcon} onClick={togglePasswordVisibility}>{showPassword ? <FaEyeSlash /> : <FaEye />}</span>
        </div>

        {formData.password.length > 0 && ( <small>{validation.password}</small> )}

        <div className={styles.passwordField}>
          <InputWithIcon
            icon={RxLockClosed}
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            className={
              formData.confirmPassword.length === 0
                ? styles.validationNeutralInput
                : formData.confirmPassword === formData.password
                ? styles.validationSuccessInput
                : styles.validationErrorInput
            }
          />
          <span className={styles.toggleIcon} onClick={toggleConfirmPasswordVisibility}>{showConfirmPassword ? <FaEyeSlash /> : <FaEye />}</span>
        </div>

        {formData.confirmPassword.length > 0 && (
          <small>{validation.confirmPassword}</small>
        )}

        <label className={styles.styledCheckbox}>
          <input 
            className={styles.checkboxInput}
            type="checkbox"
            name="agree"
            checked={formData.agree}
            onChange={handleChange}
            />
            <span className={styles.checkmark} />
            <p>I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>.</p>
        </label>

        <button 
          type="submit"
          className={styles.buttonSignup}
          disabled={isLoading}
        >
          {isLoading ? (
            <RxReload className={styles.spinnerIcon} />
          ) : (
            "Sign Up"
          )}
        </button>

        <p><Link to="/login">Already have an account?</Link></p>
        </form>
    </div>
  );
};

export default SignupForm;