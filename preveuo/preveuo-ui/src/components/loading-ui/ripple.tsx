import React from 'react';

export interface RippleProps extends React.ComponentProps<'svg'> {
  className?: string;
  color?: string;
}

/**
 * Ripple Component — Concentric expanding ripples for radar-like, soft indeterminate progress.
 * Source specification from https://www.loading-ui.com/docs/components/ripple
 */
export function Ripple({
  className = 'size-14',
  color,
  style,
  ...props
}: RippleProps) {
  return (
    <svg
      viewBox="0 0 44 44"
      fill="none"
      stroke={color || 'currentColor'}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      {...props}
    >
      <title>Loading...</title>
      <g fill="none" fillRule="evenodd" strokeWidth="2.5">
        <circle cx="22" cy="22" r="1">
          <animate
            attributeName="r"
            begin="0s"
            calcMode="spline"
            dur="1.8s"
            keySplines="0.165, 0.84, 0.44, 1"
            keyTimes="0; 1"
            repeatCount="indefinite"
            values="1; 20"
          />
          <animate
            attributeName="stroke-opacity"
            begin="0s"
            calcMode="spline"
            dur="1.8s"
            keySplines="0.3, 0.61, 0.355, 1"
            keyTimes="0; 1"
            repeatCount="indefinite"
            values="1; 0"
          />
        </circle>
        <circle cx="22" cy="22" r="1">
          <animate
            attributeName="r"
            begin="-0.9s"
            calcMode="spline"
            dur="1.8s"
            keySplines="0.165, 0.84, 0.44, 1"
            keyTimes="0; 1"
            repeatCount="indefinite"
            values="1; 20"
          />
          <animate
            attributeName="stroke-opacity"
            begin="-0.9s"
            calcMode="spline"
            dur="1.8s"
            keySplines="0.3, 0.61, 0.355, 1"
            keyTimes="0; 1"
            repeatCount="indefinite"
            values="1; 0"
          />
        </circle>
      </g>
    </svg>
  );
}

export function RippleDemo() {
  return <Ripple className="size-14" />;
}

export default Ripple;
