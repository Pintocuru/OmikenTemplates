// src/types.ts

export interface TimeParts {
 hours: number;
 minutes: number;
 seconds: number;
}

export type TimeUnit = 'minutes' | 'seconds';
export type ProcessResult = {
 success: boolean;
 error?: string;
 time?: Date;
};
