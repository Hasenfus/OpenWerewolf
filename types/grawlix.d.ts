declare module 'grawlix' {
  interface GrawlixOptions {
    style?: 'ascii' | 'unicode' | 'dingbats';
    randomize?: boolean;
  }

  interface Grawlix {
    (text: string, options?: GrawlixOptions): string;
    ascii: string[];
    dingbats: string[];
    unicode: string[];
  }

  const grawlix: Grawlix;
  export = grawlix;
} 