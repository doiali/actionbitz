'use server';

import { AuthError } from 'next-auth';
import { signIn } from '../auth';

export async function authenticate(
  prevState: { error: string; success: boolean; },
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
    return { error: '', success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid credentials.', success: false };
        default:
          return { error: 'Something went wrong.', success: false };
      }
    }
    throw error;
  }
}