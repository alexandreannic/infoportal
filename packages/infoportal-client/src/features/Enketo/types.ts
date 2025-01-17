export type FormStatus =
  | {
      type: 'idle';
    }
  | {
      type: 'saving';
    }
  | {
      type: 'error';
      message: string;
    }
  | {
      type: 'conflict';
      otherPerson: string;
      timestamp: Date;
    };

export type SubmissionValidation = 'in-progress' | 'invalid' | null;
