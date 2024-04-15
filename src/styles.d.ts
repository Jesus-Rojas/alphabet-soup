import 'react';

declare module 'react' {
  interface CSSProperties {
    // Esto permite cualquier nombre de propiedad que comience con `--`.
    [key: `--${string}`]: string | number;
  }
}
