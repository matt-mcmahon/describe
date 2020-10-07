/**
 * Is `true` if **Left** and **Right** are identical types, `false` otherwise.
 * 
 * @see: https://github.com/Microsoft/TypeScript/issues/27024
 */
export type Identical<Left, Right> = (<T>() => T extends Left ? 1 : 2) extends
  (<T>() => T extends Right ? 1 : 2) ? true : false;
