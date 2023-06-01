export type uses = 'aliases' | 'comments' | 'loop' | 'constants'
export function isUses(use:any):use is uses{
    return true;
}

export function isFunction(fn:any):fn is Function{
    return fn instanceof Function;
}
