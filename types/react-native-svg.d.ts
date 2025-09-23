declare module 'react-native-svg' {
  import * as React from 'react';

  export interface SvgProps {
    width?: number | string;
    height?: number | string;
    viewBox?: string;
    fill?: string;
    children?: React.ReactNode;
    [key: string]: any;
  }

  export interface PathProps {
    d?: string;
    fill?: string;
    fillRule?: 'nonzero' | 'evenodd' | 'inherit' | (string & {});
    clipRule?: 'nonzero' | 'evenodd' | 'inherit' | (string & {});
    [key: string]: any;
  }

  const Svg: React.ComponentType<SvgProps>;
  export const Path: React.ComponentType<PathProps>;

  export default Svg;
}

declare module "*.png" {
	const value: any;
	export default value;
} 