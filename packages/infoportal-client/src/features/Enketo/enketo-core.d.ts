declare module 'enketo-core' {
  export class Form {
    constructor(
      form: HTMLFormElement,
      options: {
        modelStr: string;
        instanceStr?: string;
        external: undefined;
        submitted?: boolean;
      },
      formOptions?: {
        language: string;
      }
    );

    init(): string[];

    getDataStr(opts: { irrelevant: boolean }): string;

    pages: {
      active: boolean;
      activePages: HTMLElement[];
      current: HTMLElement;
      _getCurrentIndex(): number;
      _flipTo(page: HTMLElement, inxes: number);
    };

    get languages(): string[];

    resetView(): HTMLFormElement;

    validateContent(page: JQuery): Promise<boolean>;

    validateAll(): Promise<boolean>;
  }
}

declare module 'enketo-core/src/js/file-manager' {
  export function getFileUrl(
    subject?: File | string
  ): Promise<string | undefined>;
  export function getCurrentFiles(): File[];
}

declare module 'enketo-core/src/js/calculate' {
  export function update(): void;
}

declare module 'enketo-core/src/js/form-model' {
  export class FormModel {
    setInstanceIdAndDeprecatedId(): void;
  }
}

declare module 'enketo-core/src/js/preload' {
  export function init(): void;
}

declare module 'enketo-core/src/js/fake-translator' {
  export function t(key: string, options?: Record<string, string>): string;
}
