import { BadgeCheck } from 'lucide-react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'accent' | 'warning' | 'danger' | 'neutral';
  className?: string;
}

const variantMap = {
  primary: 'bg-primary-100 text-primary-700',
  accent: 'bg-accent-100 text-accent-700',
  warning: 'bg-warning-100 text-warning-600',
  danger: 'bg-danger-100 text-danger-600',
  neutral: 'bg-gray-100 text-gray-600',
};

export function Badge({ children, variant = 'primary', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${variantMap[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

export function VerifiedBadge({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 text-primary-600 ${className}`}>
      <BadgeCheck size={18} className="fill-primary-600 text-white" />
      <span className="text-xs font-semibold">Verified</span>
    </span>
  );
}
