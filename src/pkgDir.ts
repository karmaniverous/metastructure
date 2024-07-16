import { packageDirectory } from 'pkg-dir';

// Locate package root.
export const pkgDir = (await packageDirectory()) ?? '.';
