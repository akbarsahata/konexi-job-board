import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from './trpc';
import { TRPCError } from '@trpc/server';

const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const authRouter = router({
  // Sign up a new user
  signUp: publicProcedure
    .input(signUpSchema)
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input;
      
      const { data, error } = await ctx.supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error.message,
        });
      }

      return {
        user: data.user,
        session: data.session,
      };
    }),

  // Sign in an existing user
  signIn: publicProcedure
    .input(signInSchema)
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input;
      
      const { data, error } = await ctx.supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: error.message,
        });
      }

      return {
        user: data.user,
        session: data.session,
      };
    }),

  // Sign out the current user
  signOut: protectedProcedure
    .mutation(async ({ ctx }) => {
      const { error } = await ctx.supabase.auth.signOut();

      if (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message,
        });
      }

      return { success: true };
    }),

  // Get current user
  getUser: protectedProcedure
    .query(async ({ ctx }) => {
      return ctx.user;
    }),

  // Update user profile
  updateProfile: protectedProcedure
    .input(z.object({
      email: z.string().email().optional(),
      password: z.string().min(6).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { data, error } = await ctx.supabase.auth.updateUser(input);

      if (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error.message,
        });
      }

      return data.user;
    }),
});