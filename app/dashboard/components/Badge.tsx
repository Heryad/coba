interface BadgeProps {
  label: string
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default'
  size?: 'sm' | 'md' | 'lg'
}

const variantStyles = {
  success: 'bg-green-50 text-green-700 ring-green-600/20',
  warning: 'bg-yellow-50 text-yellow-700 ring-yellow-600/20',
  error: 'bg-red-50 text-red-700 ring-red-600/20',
  info: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  default: 'bg-gray-50 text-gray-700 ring-gray-600/20',
}

const sizeStyles = {
  sm: 'text-xs px-2 py-1',
  md: 'text-sm px-2.5 py-1.5',
  lg: 'text-base px-3 py-2',
}

export default function Badge({ label, variant = 'default', size = 'md' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md font-medium ring-1 ring-inset 
        ${variantStyles[variant]} ${sizeStyles[size]}`}
    >
      {label}
    </span>
  )
} 