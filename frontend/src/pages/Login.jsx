//React Hooks
import React, { useState, useRef, useEffect } from 'react';

//Custom hooks
import { useDocumentTitle } from '../hooks/useDocumentTitle';

// Axios for API calls
import axios from '../api/axios';

//Stylesheets
import styles from './Login.module.css';

// Custom Components
import InputWithIcon from '../components/InputWithIcon';

// React Icons
import { FaEye, FaEyeSlash} from 'react-icons/fa';
import { RxPerson, RxLockClosed, RxReload } from 'react-icons/rx';

// React Router
import { Link, useNavigate } from 'react-router-dom';

// Utility
import { someAsyncAction } from '../utils/someAsyncAction';

// Toast notifications
import { toast } from 'react-toastify';

//Redux
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice'; // adjust path if needed

const Login = () => {
    useDocumentTitle('Login');
    someAsyncAction();

    const [formData, setFormData] = useState({ username: '', password: '', agree: false });
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const inputRef = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        const newValue = type === 'checkbox' ? checked : value; //replacing value with checked only if it's a checkbox.

        setFormData((prev) => ({ ...prev, [name]: newValue }));
    }

    const handleLogin = async (e) => {
        e.preventDefault();

        setIsLoading(true);

        // Wait for the async action to complete
        await someAsyncAction();

        try {
            const response = await axios.post('/auth/login', formData, { withCredentials: true });
            console.log('Login Response:', response.data);

            console.log('User response:', response.data.user);

            // Save user to Redux store
            dispatch(setUser(response.data.user));
            console.log(response.data.user);

            const redirectByRole = (role) => {
                const roleRoutes = {
                  Admin: '/dashboard',
                  Customer: '/order',
                  Cashier: '/cashier/dashboard',
                  Chef: '/chef/dashboard',
                };
                return roleRoutes[role] || '/';
            };

            navigate(redirectByRole(response.data.user.role));
            console.log("Redirecting to:", redirectByRole(response.data.user.role));

        } catch (err) {
          toast.error(err.response?.data?.error || 'Login failed');
          console.log('Login error:', err);
          console.log('Response data:', err.response?.data);
        }

        setIsLoading(false);
    };

    return (
        <div className={styles.loginContainer}>
            <form onSubmit={handleLogin}>
                <h2>Login</h2>

                <InputWithIcon
                    ref={inputRef}
                    icon={RxPerson}
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Username"
                    className={styles.neutralInput}
                />

                <div className={styles.passwordField}>
                    <InputWithIcon
                        icon={RxLockClosed}
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password"
                        className={styles.neutralInput}
                    />
                    <span className={styles.toggleIcon} onClick={togglePasswordVisibility}>{showPassword ? <FaEyeSlash /> : <FaEye />}</span>
                </div>

                <label className={styles.styledCheckbox}>
                    <input
                    className={styles.checkboxInput}
                    type="checkbox"
                    name="agree"
                    checked={formData.agree}
                    onChange={handleChange}
                    />
                    <span className={styles.checkmark} />
                    <p>Remember Me</p>
                </label>

                <button
                    type="submit"
                    className={styles.buttonSignup}
                    disabled={isLoading}
                >
                    {isLoading ? (
                    <RxReload className={styles.spinnerIcon} />
                    ) : (
                        "Login"
                    )}
                </button>

                <p><Link to="/signup">Forgot Password?</Link></p>
            </form>
        </div>
    );
};

export default Login;