export class VarsException extends Error {
     constructor(message: string,varName:string) {
         super(`[${varName}]: ${message}`);
         this.name = 'VarsException';
     }
 }
