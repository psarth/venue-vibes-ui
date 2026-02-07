import { useAuth } from './useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export const useOwnerGuard = () => {
  const { userRole, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && userRole !== 'owner') {
      navigate('/auth');
    }
  }, [userRole, loading, navigate]);

  return { isOwner: userRole === 'owner', loading };
};

export const useCustomerGuard = () => {
  const { userRole, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && userRole !== 'user') {
      navigate('/auth');
    }
  }, [userRole, loading, navigate]);

  return { isCustomer: userRole === 'user', loading };
};

export const useAdminGuard = () => {
  const { userRole, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && userRole !== 'admin') {
      navigate('/auth');
    }
  }, [userRole, loading, navigate]);

  return { isAdmin: userRole === 'admin', loading };
};
