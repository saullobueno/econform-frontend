import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'context/auth';
import { setupInterceptors } from './api';

export default function InjectAxiosInterceptors() {
  let navigate = useNavigate();
  const { signOut } = useAuth();

  useEffect(() => {
    setupInterceptors(navigate, signOut);
  }, [navigate]);

  return null;
}
