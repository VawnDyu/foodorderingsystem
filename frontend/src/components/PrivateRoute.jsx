import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, requiredRole, redirectTo = '/login' }) => {
  const user = useSelector(state => state.user.user);

  // 1. Show a loader while user is still being fetched (optional)
  if (user === null) {
    console.log('🚀 User is still being fetched...');
    return <div>Loading...</div>;
  }

  // 2. Redirect if not authenticated
  if (!user) {
    console.log('🚨 User is not authenticated. Redirecting...');
    return <Navigate to={redirectTo} replace />;
  }

  // 3. Redirect if role doesn't match
  if (requiredRole && user.role !== requiredRole) {
    console.log(`⚠️ User does not have the required role. Expected: ${requiredRole}, Found: ${user.role}. Redirecting...`);
    return <Navigate to={redirectTo} replace />;
  }

  console.log('✅ User authenticated and role matched. Proceeding to protected route.');
  return children;
};

export default PrivateRoute;
