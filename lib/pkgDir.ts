import { packageDirectory } from 'pkg-dir';

// Locate package root.
const pkgDir = await packageDirectory();

export default pkgDir ?? '.';
