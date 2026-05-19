import { motion } from 'motion/react';
import { CircleAlert as AlertCircle, CircleCheck as CheckCircle, Info } from 'lucide-react';

interface ValidationToastProps {
  message: string;
  type?: 'error' | 'warning' | 'info' | 'success';
  visible?: boolean;
}

export default function ValidationToast({ message, type = 'error', visible = true }: ValidationToastProps) {
  if (!visible) return null;

  const configs = {
    error: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      text: 'text-red-400',
      icon: AlertCircle,
      accentBg: 'bg-red-500/20',
    },
    warning: {
      bg: 'bg-gold/10',
      border: 'border-gold/30',
      text: 'text-gold',
      icon: AlertCircle,
      accentBg: 'bg-gold/20',
    },
    info: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      text: 'text-blue-400',
      icon: Info,
      accentBg: 'bg-blue-500/20',
    },
    success: {
      bg: 'bg-green-500/10',
      border: 'border-green-500/30',
      text: 'text-green-400',
      icon: CheckCircle,
      accentBg: 'bg-green-500/20',
    },
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className={`flex items-center gap-3 ${config.bg} border ${config.border} rounded-xl px-4 py-3 max-w-sm`}
    >
      <div className={`flex-shrink-0 w-8 h-8 rounded-lg ${config.accentBg} flex items-center justify-center`}>
        <Icon className={`w-4 h-4 ${config.text}`} />
      </div>
      <p className={`text-sm font-medium ${config.text}`}>{message}</p>
    </motion.div>
  );
}
