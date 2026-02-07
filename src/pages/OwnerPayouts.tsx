import OwnerLayout from '@/layouts/OwnerLayout';
import { Building2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function OwnerPayouts() {
  const navigate = useNavigate();
  const { userRole } = useAuth();

  if (userRole !== 'owner') {
    navigate('/auth');
    return null;
  }

  return (
    <OwnerLayout title="Payouts">
      <div className="p-6 text-center">
        <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">Payouts</h3>
        <p className="text-muted-foreground">Payout information will be available soon.</p>
      </div>
    </OwnerLayout>
  );
}