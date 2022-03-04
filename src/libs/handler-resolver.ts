/**
 * Provides handler path for handler in index.ts
 * 
 * @param context 
 * @returns handler path
 */
export const handlerPath = (context: string) => {
  return `${context.split(process.cwd())[1].substring(1).replace(/\\/g, '/')}`
};
