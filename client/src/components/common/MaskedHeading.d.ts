import React from 'react';

export interface MaskedHeadingProps extends React.HTMLAttributes<HTMLElement> {
  text?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  mediaType?: 'image' | 'video';
  src?: string;
  poster?: string;
  fillScale?: number;
  parallax?: number;
  drift?: number;
  brightness?: number;
  saturation?: number;
  grayscale?: boolean;
  reveal?: 'rise' | 'wipe' | 'fade' | 'none';
  duration?: number;
  stagger?: number;
  trigger?: 'view' | 'hover' | 'load';
  align?: 'left' | 'center' | 'right';
  weight?: number | string;
  tracking?: number;
  lineHeight?: number | string;
  textScale?: number;
  className?: string;
  style?: React.CSSProperties;
}

export declare const MaskedHeading: React.FC<MaskedHeadingProps>;
export default MaskedHeading;
