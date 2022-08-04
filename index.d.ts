// Represents a file local to a module
export type File = {
  // The path of the file relative to the module root
  filename: string;
  // The size of the file in bytes
  size: number;
}

// Represents a module in the dependency graph
export type Module = {
  name: string;
  version: string;
  // Represents a file local to a module
  fileSizes: File[];
  // Reduced sum of the `size` field from all items in `fileSizes`
  totalFileSize: number;
  // Individual size records of each dependency
  dependencySizes: Module[];
  // Reduced sum of the `totalSize` from all items in `dependencySizes`
  totalDependencySizes: number;
  // `totalFileSize` plus `totalDependencySizes`
  totalSize: number;
  // Dedupes all dependencies in the tree below the current module
  // and reduces `totalFileSize` from each remaining dependency
  totalDedupedDependencySizes: number;
  // `totalFileSize` plus `totalDedupedDependencySizes`
  totalDedupedSize: number;
}

export type TreeOptions = {
  // If devDependencies of the base module should be included
  // Default: false
  withDev?: boolean;
  // The current working directory to resolve the base from
  // Default: process.cwd()
  cwd?: string;
  // Filenames to ignore in the graph search
  // Default: [ '.git', 'node_modules' ]
  // NOTE:
  // - Must contain "node_modules"
  // - Applies to all modules in the graph
  ignore?: string[];
}

// Computes the tree of all module sizes in the dependency graph
// of the base module, including the base module itself.
export function moduleSizeTree(
  base: string,
  options?: TreeOptions
): Promise<Module>;

// Markdown helper used for GitHub Action and CLI outputs.
// Exposed for convenience but output format is unspecified.
export function toMarkdown(
  tree: Module
): string;
