/**
 * Unit tests for admin-auth helpers
 */

jest.mock('@/lib/supabase-server', () => ({
  createAuthServerClient: jest.fn(),
  getServiceSupabase: jest.fn(),
}));

import { NextResponse } from 'next/server';
import { requireAuth, requireAdmin } from '@/lib/admin-auth';
import { createAuthServerClient, getServiceSupabase } from '@/lib/supabase-server';

const mockCreateAuthServerClient = createAuthServerClient as jest.MockedFunction<typeof createAuthServerClient>;
const mockGetServiceSupabase = getServiceSupabase as jest.MockedFunction<typeof getServiceSupabase>;

describe('admin-auth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('requireAuth', () => {
    it('returns 500 when supabase is not configured', async () => {
      mockCreateAuthServerClient.mockResolvedValue(null);
      const result = await requireAuth();
      expect('error' in result).toBe(true);
      if ('error' in result) {
        expect(result.error.status).toBe(500);
      }
    });

    it('returns 401 when user is not authenticated', async () => {
      mockCreateAuthServerClient.mockResolvedValue({
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: { user: null }, error: null }),
        },
      } as never);

      const result = await requireAuth();
      expect('error' in result).toBe(true);
      if ('error' in result) {
        expect(result.error.status).toBe(401);
      }
    });

    it('returns user when authenticated', async () => {
      const mockUser = { id: 'user-1', email: 'admin@test.com' };
      mockCreateAuthServerClient.mockResolvedValue({
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
        },
      } as never);

      const result = await requireAuth();
      expect('error' in result).toBe(false);
      if (!('error' in result)) {
        expect(result.user).toEqual(mockUser);
      }
    });
  });

  describe('requireAdmin', () => {
    it('returns 403 when user is not admin', async () => {
      const mockUser = { id: 'user-1', email: 'user@test.com' };
      mockCreateAuthServerClient.mockResolvedValue({
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
        },
      } as never);

      mockGetServiceSupabase.mockReturnValue({
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ data: { role: 'user' }, error: null }),
            }),
          }),
        }),
      } as never);

      const result = await requireAdmin();
      expect('error' in result).toBe(true);
      if ('error' in result) {
        expect(result.error.status).toBe(403);
      }
    });

    it('returns serviceClient when user is admin', async () => {
      const mockUser = { id: 'admin-1', email: 'admin@test.com' };
      const mockServiceClient = { from: jest.fn() };

      mockCreateAuthServerClient.mockResolvedValue({
        auth: {
          getUser: jest.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
        },
      } as never);

      mockGetServiceSupabase.mockReturnValue({
        from: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ data: { role: 'admin' }, error: null }),
            }),
          }),
        }),
      } as never);

      const result = await requireAdmin();
      expect('error' in result).toBe(false);
      if (!('error' in result)) {
        expect(result.user).toEqual(mockUser);
        expect(result.serviceClient).toBeDefined();
      }
    });
  });
});
