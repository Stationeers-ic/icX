export type uses = 'aliases' | 'comments' | 'loop' | 'constants'
export function isUses(use:any):use is uses{
    return true;
}
