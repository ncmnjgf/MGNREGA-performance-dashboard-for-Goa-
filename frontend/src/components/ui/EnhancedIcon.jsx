import React, { forwardRef } from 'react';
import {
  // Navigation & Actions
  HomeIcon,
  ChartBarIcon,
  MapPinIcon,
  ArrowPathIcon,
  Cog6ToothIcon,
  EllipsisHorizontalIcon,
  PlusIcon,
  MinusIcon,
  XMarkIcon,
  CheckIcon,

  // Status & Feedback
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,

  // Connectivity & Data
  WifiIcon,
  SignalSlashIcon,
  CloudIcon,
  ServerIcon,
  SignalIcon,

  // Trends & Analytics
  TrendingUpIcon,
  TrendingDownIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ChartPieIcon,
  PresentationChartLineIcon,

  // User & Interface
  UserGroupIcon,
  BuildingOfficeIcon,
  CurrencyRupeeIcon,
  CalendarDaysIcon,
  ClockIcon,
  EyeIcon,
  EyeSlashIcon,

  // Actions & Controls
  PlayIcon,
  PauseIcon,
  StopIcon,
  ForwardIcon,
  BackwardIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,

  // Files & Data
  DocumentIcon,
  DocumentTextIcon,
  FolderIcon,
  ArchiveBoxIcon,
  ClipboardDocumentIcon,

  // Communication
  PhoneIcon,
  EnvelopeIcon,
  ChatBubbleLeftIcon,
  MegaphoneIcon,

  // Location & Maps
  GlobeAltIcon,
  BuildingLibraryIcon,
  HomeModernIcon,
} from '@heroicons/react/24/outline';

import {
  CheckCircleIcon as CheckCircleIconSolid,
  ExclamationCircleIcon as ExclamationCircleIconSolid,
  ExclamationTriangleIcon as ExclamationTriangleIconSolid,
  InformationCircleIcon as InformationCircleIconSolid,
  XCircleIcon as XCircleIconSolid,
  HeartIcon as HeartIconSolid,
  StarIcon as StarIconSolid,
} from '@heroicons/react/24/solid';

/**
 * Icon registry mapping icon names to their components
 */
const ICON_REGISTRY = {
  // Navigation & Actions
  home: HomeIcon,
  chart: ChartBarIcon,
  'chart-bar': ChartBarIcon,
  location: MapPinIcon,
  'map-pin': MapPinIcon,
  refresh: ArrowPathIcon,
  settings: Cog6ToothIcon,
  menu: EllipsisHorizontalIcon,
  plus: PlusIcon,
  minus: MinusIcon,
  close: XMarkIcon,
  check: CheckIcon,

  // Status & Feedback (Outline)
  'check-circle': CheckCircleIcon,
  'exclamation-circle': ExclamationCircleIcon,
  'exclamation-triangle': ExclamationTriangleIcon,
  'information-circle': InformationCircleIcon,
  'x-circle': XCircleIcon,

  // Status & Feedback (Solid)
  'check-circle-solid': CheckCircleIconSolid,
  'exclamation-circle-solid': ExclamationCircleIconSolid,
  'exclamation-triangle-solid': ExclamationTriangleIconSolid,
  'information-circle-solid': InformationCircleIconSolid,
  'x-circle-solid': XCircleIconSolid,
  'heart-solid': HeartIconSolid,
  'star-solid': StarIconSolid,

  // Connectivity & Data
  wifi: WifiIcon,
  'signal-slash': SignalSlashIcon,
  offline: SignalSlashIcon,
  cloud: CloudIcon,
  server: ServerIcon,
  signal: SignalIcon,
  online: WifiIcon,

  // Trends & Analytics
  'trending-up': TrendingUpIcon,
  'trending-down': TrendingDownIcon,
  'arrow-up': ArrowUpIcon,
  'arrow-down': ArrowDownIcon,
  'chart-pie': ChartPieIcon,
  'chart-line': PresentationChartLineIcon,
  analytics: PresentationChartLineIcon,

  // User & Interface
  users: UserGroupIcon,
  'user-group': UserGroupIcon,
  families: UserGroupIcon,
  households: UserGroupIcon,
  building: BuildingOfficeIcon,
  office: BuildingOfficeIcon,
  currency: CurrencyRupeeIcon,
  money: CurrencyRupeeIcon,
  rupee: CurrencyRupeeIcon,
  calendar: CalendarDaysIcon,
  date: CalendarDaysIcon,
  time: ClockIcon,
  clock: ClockIcon,
  eye: EyeIcon,
  'eye-slash': EyeSlashIcon,

  // Actions & Controls
  play: PlayIcon,
  pause: PauseIcon,
  stop: StopIcon,
  forward: ForwardIcon,
  backward: BackwardIcon,
  sound: SpeakerWaveIcon,
  'sound-off': SpeakerXMarkIcon,

  // Files & Data
  document: DocumentIcon,
  'document-text': DocumentTextIcon,
  folder: FolderIcon,
  archive: ArchiveBoxIcon,
  clipboard: ClipboardDocumentIcon,

  // Communication
  phone: PhoneIcon,
  email: EnvelopeIcon,
  mail: EnvelopeIcon,
  chat: ChatBubbleLeftIcon,
  announcement: MegaphoneIcon,

  // Location & Maps
  globe: GlobeAltIcon,
  world: GlobeAltIcon,
  library: BuildingLibraryIcon,
  government: BuildingLibraryIcon,
  house: HomeModernIcon,

  // Custom MGNREGA specific mappings
  'person-days': UserGroupIcon,
  'work-done': ChartBarIcon,
  'funds-spent': CurrencyRupeeIcon,
  'completion-rate': CheckCircleIcon,
  'north-goa': MapPinIcon,
  'south-goa': MapPinIcon,
  'auto-detect': GlobeAltIcon,
};

/**
 * MGNREGA specific emoji icons for better visual representation
 */
const EMOJI_ICONS = {
  'work-done': '💼',
  'person-days': '👥',
  families: '🏠',
  households: '🏠',
  'funds-spent': '💰',
  money: '💰',
  'completion-rate': '✅',
  completed: '✅',
  success: '✅',
  warning: '⚠️',
  error: '❌',
  info: 'ℹ️',
  location: '📍',
  'north-goa': '🏛️',
  'south-goa': '🏛️',
  government: '🏛️',
  chart: '📊',
  analytics: '📈',
  trend: '📈',
  calendar: '📅',
  time: '⏰',
  online: '🌐',
  offline: '📱',
  cached: '💾',
  loading: '⏳',
  refresh: '🔄',
  settings: '⚙️',
};

/**
 * Size presets for consistent icon sizing
 */
const SIZE_PRESETS = {
  xs: 'w-3 h-3', // 12px
  sm: 'w-4 h-4', // 16px
  base: 'w-5 h-5', // 20px
  lg: 'w-6 h-6', // 24px
  xl: 'w-8 h-8', // 32px
  '2xl': 'w-10 h-10', // 40px
  '3xl': 'w-12 h-12', // 48px
};

/**
 * Color presets for semantic icon colors
 */
const COLOR_PRESETS = {
  inherit: 'text-current',
  primary: 'text-primary-600',
  secondary: 'text-secondary-600',
  success: 'text-success-600',
  warning: 'text-warning-600',
  error: 'text-error-600',
  info: 'text-info-600',
  gray: 'text-gray-500',
  'gray-dark': 'text-gray-700',
  'gray-light': 'text-gray-400',
  white: 'text-white',
  black: 'text-black',
};

/**
 * Enhanced Icon component with accessibility and consistent sizing
 */
export const Icon = forwardRef(({
  name,
  size = 'base',
  color = 'inherit',
  className = '',
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden = false,
  title,
  decorative = false,
  emoji = false,
  solid = false,
  strokeWidth = 1.5,
  ...props
}, ref) => {
  // If using emoji icons
  if (emoji && EMOJI_ICONS[name]) {
    return (
      <span
        ref={ref}
        className={`
          inline-block text-center leading-none
          ${SIZE_PRESETS[size] || size}
          ${className}
        `}
        role={decorative ? 'presentation' : 'img'}
        aria-label={decorative ? undefined : (ariaLabel || name)}
        aria-hidden={decorative ? true : ariaHidden}
        title={title}
        {...props}
      >
        {EMOJI_ICONS[name]}
      </span>
    );
  }

  // Determine which icon variant to use
  let iconName = name;
  if (solid && ICON_REGISTRY[`${name}-solid`]) {
    iconName = `${name}-solid`;
  }

  const IconComponent = ICON_REGISTRY[iconName];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in registry`);
    return (
      <span
        ref={ref}
        className={`
          inline-block bg-gray-200 rounded
          ${SIZE_PRESETS[size] || size}
          ${className}
        `}
        role="img"
        aria-label={ariaLabel || `Missing icon: ${name}`}
        title={title || `Missing icon: ${name}`}
        {...props}
      />
    );
  }

  return (
    <IconComponent
      ref={ref}
      className={`
        ${SIZE_PRESETS[size] || size}
        ${COLOR_PRESETS[color] || color}
        ${className}
      `}
      strokeWidth={strokeWidth}
      role={decorative ? 'presentation' : 'img'}
      aria-label={decorative ? undefined : (ariaLabel || name)}
      aria-hidden={decorative ? true : ariaHidden}
      title={title}
      {...props}
    />
  );
});

Icon.displayName = 'Icon';

/**
 * Status Icon component with predefined colors and states
 */
export const StatusIcon = forwardRef(({
  status,
  size = 'base',
  solid = false,
  className = '',
  ...props
}, ref) => {
  const statusConfig = {
    success: {
      name: 'check-circle',
      color: 'success',
      ariaLabel: 'Success',
    },
    error: {
      name: 'x-circle',
      color: 'error',
      ariaLabel: 'Error',
    },
    warning: {
      name: 'exclamation-triangle',
      color: 'warning',
      ariaLabel: 'Warning',
    },
    info: {
      name: 'information-circle',
      color: 'info',
      ariaLabel: 'Information',
    },
    loading: {
      name: 'refresh',
      color: 'primary',
      ariaLabel: 'Loading',
      className: 'animate-spin',
    },
    online: {
      name: 'wifi',
      color: 'success',
      ariaLabel: 'Online',
    },
    offline: {
      name: 'signal-slash',
      color: 'error',
      ariaLabel: 'Offline',
    },
  };

  const config = statusConfig[status];
  if (!config) {
    console.warn(`Status "${status}" not found`);
    return null;
  }

  return (
    <Icon
      ref={ref}
      name={config.name}
      size={size}
      color={config.color}
      solid={solid}
      aria-label={config.ariaLabel}
      className={`${config.className || ''} ${className}`}
      {...props}
    />
  );
});

StatusIcon.displayName = 'StatusIcon';

/**
 * Trend Icon component for showing data trends
 */
export const TrendIcon = forwardRef(({
  trend,
  size = 'base',
  value = 0,
  className = '',
  showValue = false,
  ...props
}, ref) => {
  const getTrendConfig = () => {
    if (trend === 'up' || value > 0) {
      return {
        name: 'trending-up',
        color: 'success',
        ariaLabel: 'Trending up',
      };
    } else if (trend === 'down' || value < 0) {
      return {
        name: 'trending-down',
        color: 'error',
        ariaLabel: 'Trending down',
      };
    } else {
      return {
        name: 'minus',
        color: 'gray',
        ariaLabel: 'No trend',
      };
    }
  };

  const config = getTrendConfig();

  if (showValue) {
    return (
      <div className={`inline-flex items-center gap-1 ${className}`} ref={ref}>
        <Icon
          name={config.name}
          size={size}
          color={config.color}
          aria-label={config.ariaLabel}
          {...props}
        />
        <span className={`text-sm font-medium ${COLOR_PRESETS[config.color]}`}>
          {Math.abs(value).toFixed(1)}%
        </span>
      </div>
    );
  }

  return (
    <Icon
      ref={ref}
      name={config.name}
      size={size}
      color={config.color}
      aria-label={config.ariaLabel}
      className={className}
      {...props}
    />
  );
});

TrendIcon.displayName = 'TrendIcon';

/**
 * Metric Icon component for MGNREGA specific metrics
 */
export const MetricIcon = forwardRef(({
  metric,
  size = 'lg',
  variant = 'outline',
  className = '',
  ...props
}, ref) => {
  const metricConfig = {
    'person-days': {
      name: 'users',
      color: 'primary',
      emoji: '💼',
      ariaLabel: 'Person days of work',
    },
    households: {
      name: 'households',
      color: 'secondary',
      emoji: '🏠',
      ariaLabel: 'Households benefited',
    },
    'funds-spent': {
      name: 'currency',
      color: 'warning',
      emoji: '💰',
      ariaLabel: 'Funds spent',
    },
    'completion-rate': {
      name: 'check-circle',
      color: 'success',
      emoji: '✅',
      ariaLabel: 'Completion rate',
    },
  };

  const config = metricConfig[metric];
  if (!config) {
    console.warn(`Metric "${metric}" not found`);
    return null;
  }

  return (
    <Icon
      ref={ref}
      name={config.name}
      size={size}
      color={config.color}
      emoji={variant === 'emoji'}
      solid={variant === 'solid'}
      aria-label={config.ariaLabel}
      className={className}
      {...props}
    />
  );
});

MetricIcon.displayName = 'MetricIcon';

/**
 * Icon Button component combining Icon with button behavior
 */
export const IconButton = forwardRef(({
  icon,
  size = 'base',
  variant = 'ghost',
  disabled = false,
  loading = false,
  'aria-label': ariaLabel,
  className = '',
  children,
  ...props
}, ref) => {
  const sizeClasses = {
    xs: 'p-1 min-w-[28px] min-h-[28px]',
    sm: 'p-1.5 min-w-[32px] min-h-[32px]',
    base: 'p-2 min-w-[40px] min-h-[40px]',
    lg: 'p-2.5 min-w-[44px] min-h-[44px]',
    xl: 'p-3 min-w-[48px] min-h-[48px]',
  };

  const variantClasses = {
    ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
    primary: 'text-primary-600 hover:text-primary-700 hover:bg-primary-100',
    secondary: 'text-secondary-600 hover:text-secondary-700 hover:bg-secondary-100',
    success: 'text-success-600 hover:text-success-700 hover:bg-success-100',
    warning: 'text-warning-600 hover:text-warning-700 hover:bg-warning-100',
    error: 'text-error-600 hover:text-error-700 hover:bg-error-100',
  };

  return (
    <button
      ref={ref}
      className={`
        inline-flex items-center justify-center
        rounded-full border-0 bg-transparent
        transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1
        disabled:opacity-50 disabled:cursor-not-allowed
        ${sizeClasses[size] || sizeClasses.base}
        ${variantClasses[variant] || variantClasses.ghost}
        ${loading ? 'cursor-wait' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      aria-label={ariaLabel}
      {...props}
    >
      {loading ? (
        <Icon
          name="refresh"
          size={size}
          className="animate-spin"
          decorative
        />
      ) : (
        <>
          <Icon
            name={icon}
            size={size}
            decorative={!!children}
          />
          {children && (
            <span className="ml-1 text-sm font-medium">
              {children}
            </span>
          )}
        </>
      )}
    </button>
  );
});

IconButton.displayName = 'IconButton';

/**
 * Helper function to get available icons
 */
export const getAvailableIcons = () => {
  return {
    heroicons: Object.keys(ICON_REGISTRY),
    emoji: Object.keys(EMOJI_ICONS),
  };
};

/**
 * Helper function to check if an icon exists
 */
export const hasIcon = (name, emoji = false) => {
  if (emoji) {
    return !!EMOJI_ICONS[name];
  }
  return !!ICON_REGISTRY[name];
};

export default Icon;
