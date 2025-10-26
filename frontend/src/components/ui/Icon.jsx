import React from 'react';
import { clsx } from 'clsx';
import {
  Menu,
  X,
  MapPin,
  TrendingUp,
  TrendingDown,
  Building2,
  HelpCircle,
  Loader2,
  Crosshair,
  Home,
  Briefcase,
  DollarSign,
  Users,
  Calendar,
  BarChart3,
  LineChart,
  PieChart,
  Activity,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
  Refresh,
  Download,
  Upload,
  Share2,
  Settings,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Plus,
  Minus,
  Search,
  Filter,
  MoreVertical,
  MoreHorizontal,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  Phone,
  Mail,
  Globe,
  Facebook,
  Twitter,
  Youtube,
  Instagram,
  Linkedin,
  Star,
  Heart,
  Bookmark,
  Flag,
  Clock,
  Shield,
  Lock,
  Unlock,
  Key,
  User,
  UserPlus,
  UserMinus,
  UserCheck,
  Bell,
  BellOff,
  Zap,
  Wifi,
  WifiOff,
  Signal,
  Battery,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  Camera,
  Image,
  FileText,
  File,
  Folder,
  FolderOpen,
  Save,
  Print,
  Paperclip,
  Link,
  Unlink,
  Code,
  Terminal,
  Database,
  Server,
  Cloud,
  CloudOff,
  Layers,
  Package,
  Box,
  Archive,
  Inbox,
  Send,
  MessageSquare,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Target,
  Award,
  Trophy,
  Gift,
  Sparkles,
  Sun,
  Moon,
  CloudRain,
  Snowflake,
  Wind,
  Compass,
  Navigation,
  Map,
  Route,
  Car,
  Truck,
  Bus,
  Train,
  Plane,
  Ship,
  Bike,
  Coffee,
  ShoppingCart,
  CreditCard,
  Wallet,
  Coins,
  Banknote,
  Receipt,
  Calculator,
  PiggyBank,
} from 'lucide-react';

// Icon mapping for easy access
const iconMap = {
  // Navigation & UI
  menu: Menu,
  close: X,
  'map-pin': MapPin,
  'trending-up': TrendingUp,
  'trending-down': TrendingDown,
  building: Building2,
  'help-circle': HelpCircle,
  loader: Loader2,
  crosshair: Crosshair,

  // MGNREGA specific
  home: Home,
  briefcase: Briefcase,
  'dollar-sign': DollarSign,
  rupee: DollarSign, // Using dollar sign as rupee alternative
  users: Users,
  calendar: Calendar,

  // Charts & Analytics
  'bar-chart': BarChart3,
  'line-chart': LineChart,
  'pie-chart': PieChart,
  activity: Activity,

  // Status indicators
  'check-circle': CheckCircle,
  'alert-triangle': AlertTriangle,
  'x-circle': XCircle,
  info: Info,

  // Actions
  refresh: Refresh,
  download: Download,
  upload: Upload,
  share: Share2,
  settings: Settings,

  // Directional
  'chevron-down': ChevronDown,
  'chevron-up': ChevronUp,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,
  'arrow-up': ArrowUp,
  'arrow-down': ArrowDown,
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,

  // Basic operations
  plus: Plus,
  minus: Minus,
  search: Search,
  filter: Filter,
  'more-vertical': MoreVertical,
  'more-horizontal': MoreHorizontal,

  // Visibility
  eye: Eye,
  'eye-off': EyeOff,

  // File operations
  edit: Edit,
  trash: Trash2,
  copy: Copy,
  'external-link': ExternalLink,

  // Communication
  phone: Phone,
  mail: Mail,
  globe: Globe,

  // Social media
  facebook: Facebook,
  twitter: Twitter,
  youtube: Youtube,
  instagram: Instagram,
  linkedin: Linkedin,

  // Favorites & ratings
  star: Star,
  heart: Heart,
  bookmark: Bookmark,
  flag: Flag,

  // Time & status
  clock: Clock,
  shield: Shield,
  lock: Lock,
  unlock: Unlock,
  key: Key,

  // Users
  user: User,
  'user-plus': UserPlus,
  'user-minus': UserMinus,
  'user-check': UserCheck,

  // Notifications
  bell: Bell,
  'bell-off': BellOff,

  // System
  zap: Zap,
  wifi: Wifi,
  'wifi-off': WifiOff,
  signal: Signal,
  battery: Battery,

  // Media
  'volume-2': Volume2,
  'volume-x': VolumeX,
  play: Play,
  pause: Pause,
  square: Square,
  'skip-back': SkipBack,
  'skip-forward': SkipForward,
  repeat: Repeat,
  shuffle: Shuffle,

  // Content
  camera: Camera,
  image: Image,
  'file-text': FileText,
  file: File,
  folder: Folder,
  'folder-open': FolderOpen,

  // File operations
  save: Save,
  print: Print,
  paperclip: Paperclip,
  link: Link,
  unlink: Unlink,

  // Development
  code: Code,
  terminal: Terminal,
  database: Database,
  server: Server,

  // Cloud & storage
  cloud: Cloud,
  'cloud-off': CloudOff,
  layers: Layers,
  package: Package,
  box: Box,
  archive: Archive,

  // Messages
  inbox: Inbox,
  send: Send,
  'message-square': MessageSquare,
  'message-circle': MessageCircle,
  'thumbs-up': ThumbsUp,
  'thumbs-down': ThumbsDown,

  // Achievement
  target: Target,
  award: Award,
  trophy: Trophy,
  gift: Gift,
  sparkles: Sparkles,

  // Weather & environment
  sun: Sun,
  moon: Moon,
  'cloud-rain': CloudRain,
  snowflake: Snowflake,
  wind: Wind,

  // Location & navigation
  compass: Compass,
  navigation: Navigation,
  map: Map,
  route: Route,

  // Transportation
  car: Car,
  truck: Truck,
  bus: Bus,
  train: Train,
  plane: Plane,
  ship: Ship,
  bike: Bike,

  // Commerce & finance
  coffee: Coffee,
  'shopping-cart': ShoppingCart,
  'credit-card': CreditCard,
  wallet: Wallet,
  coins: Coins,
  banknote: Banknote,
  receipt: Receipt,
  calculator: Calculator,
  'piggy-bank': PiggyBank,
};

/**
 * Icon component with consistent sizing and styling
 * Uses Lucide React icons with fallback support
 */
export const Icon = ({
  name,
  size = 'md',
  className = '',
  color,
  strokeWidth = 2,
  ...props
}) => {
  const sizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
    '2xl': 'w-10 h-10',
  };

  const IconComponent = iconMap[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found. Available icons:`, Object.keys(iconMap));

    // Fallback icon (question mark)
    return (
      <div
        className={clsx(
          sizes[size],
          'inline-flex items-center justify-center',
          'bg-gray-200 text-gray-500 rounded text-xs',
          className
        )}
        title={`Icon "${name}" not found`}
        {...props}
      >
        ?
      </div>
    );
  }

  return (
    <IconComponent
      className={clsx(sizes[size], className)}
      strokeWidth={strokeWidth}
      color={color}
      {...props}
    />
  );
};

/**
 * Animated loading icon
 */
export const LoadingIcon = ({ size = 'md', className = '', ...props }) => (
  <Icon
    name="loader"
    size={size}
    className={clsx('animate-spin', className)}
    {...props}
  />
);

/**
 * Status icons with predefined colors
 */
export const StatusIcon = ({ type, size = 'md', className = '', ...props }) => {
  const statusConfig = {
    success: {
      name: 'check-circle',
      className: 'text-success-600',
    },
    error: {
      name: 'x-circle',
      className: 'text-error-600',
    },
    warning: {
      name: 'alert-triangle',
      className: 'text-warning-600',
    },
    info: {
      name: 'info',
      className: 'text-blue-600',
    },
  };

  const config = statusConfig[type];
  if (!config) {
    console.warn(`Status type "${type}" not supported`);
    return null;
  }

  return (
    <Icon
      name={config.name}
      size={size}
      className={clsx(config.className, className)}
      {...props}
    />
  );
};

/**
 * Metric icons with consistent styling for dashboard cards
 */
export const MetricIcon = ({ type, size = 'lg', className = '', ...props }) => {
  const metricConfig = {
    work: {
      name: 'briefcase',
      className: 'text-primary-600 bg-primary-50 p-2 rounded-lg',
    },
    families: {
      name: 'home',
      className: 'text-secondary-600 bg-secondary-50 p-2 rounded-lg',
    },
    money: {
      name: 'dollar-sign',
      className: 'text-accent-600 bg-accent-50 p-2 rounded-lg',
    },
    progress: {
      name: 'activity',
      className: 'text-success-600 bg-success-50 p-2 rounded-lg',
    },
  };

  const config = metricConfig[type];
  if (!config) {
    console.warn(`Metric type "${type}" not supported`);
    return null;
  }

  return (
    <div className={clsx('inline-flex', config.className, className)}>
      <Icon
        name={config.name}
        size={size}
        {...props}
      />
    </div>
  );
};

/**
 * Social media icons
 */
export const SocialIcon = ({ platform, size = 'md', className = '', ...props }) => {
  const socialConfig = {
    facebook: {
      name: 'facebook',
      className: 'text-blue-600 hover:text-blue-700',
    },
    twitter: {
      name: 'twitter',
      className: 'text-sky-500 hover:text-sky-600',
    },
    youtube: {
      name: 'youtube',
      className: 'text-red-600 hover:text-red-700',
    },
    instagram: {
      name: 'instagram',
      className: 'text-pink-600 hover:text-pink-700',
    },
    linkedin: {
      name: 'linkedin',
      className: 'text-blue-700 hover:text-blue-800',
    },
  };

  const config = socialConfig[platform];
  if (!config) {
    console.warn(`Social platform "${platform}" not supported`);
    return null;
  }

  return (
    <Icon
      name={config.name}
      size={size}
      className={clsx(
        'transition-colors duration-200 cursor-pointer',
        config.className,
        className
      )}
      {...props}
    />
  );
};

/**
 * Trend icon that shows direction and color based on value
 */
export const TrendIcon = ({
  direction,
  value = 0,
  size = 'sm',
  className = '',
  showValue = false,
  ...props
}) => {
  const isPositive = direction === 'up' || value > 0;
  const isNegative = direction === 'down' || value < 0;

  let iconName = 'minus';
  let colorClass = 'text-gray-500';

  if (isPositive) {
    iconName = 'trending-up';
    colorClass = 'text-success-600';
  } else if (isNegative) {
    iconName = 'trending-down';
    colorClass = 'text-error-600';
  }

  return (
    <span className={clsx('inline-flex items-center gap-1', className)}>
      <Icon
        name={iconName}
        size={size}
        className={colorClass}
        {...props}
      />
      {showValue && (
        <span className={clsx('text-sm font-medium', colorClass)}>
          {Math.abs(value)}%
        </span>
      )}
    </span>
  );
};

// Export icon map for external use
export { iconMap };

export default Icon;
