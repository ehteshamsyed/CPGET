import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);
export const SYSTEM_EMAIL = 'onboarding@resend.dev'; // Replace with your domain when ready