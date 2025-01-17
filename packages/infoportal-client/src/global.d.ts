// declare module 'enketo-core' {
//   const content: any;
//   export default content;
// }
declare module 'enketo-core-minedeprecated' {
  export default class EnketoCore {
    constructor(container: HTMLElement, options: { formStr: string; modelStr: string });
    init(): Promise<void>;
    getDataStr(): string;
    // Add additional methods and properties as needed.
  }
}