import { buildPathWithTenant } from '../app/utils/tenant.utils';

describe('tenant.utils', () => {
  describe('buildPathWithTenant', () => {
    it('should add tenant to simple path', () => {
      const result = buildPathWithTenant('/dashboard', 'my-tenant', '');
      expect(result.pathname).toBe('/dashboard');
      expect(result.search).toBe('?tenant=my-tenant');
    });

    it('should preserve existing query params and add tenant', () => {
      const result = buildPathWithTenant('/dashboard', 'my-tenant', '?page=1');
      expect(result.pathname).toBe('/dashboard');
      expect(result.search).toContain('tenant=my-tenant');
      expect(result.search).toContain('page=1');
    });

    it('should handle path with query string', () => {
      const result = buildPathWithTenant('/dashboard?filter=active', 'my-tenant', '');
      expect(result.pathname).toBe('/dashboard');
      expect(result.search).toContain('tenant=my-tenant');
      expect(result.search).toContain('filter=active');
    });

    it('should remove tenant when not provided', () => {
      const result = buildPathWithTenant('/dashboard', undefined, '?tenant=old-tenant');
      expect(result.pathname).toBe('/dashboard');
      expect(result.search).not.toContain('tenant');
    });

    it('should return empty search when no params', () => {
      const result = buildPathWithTenant('/dashboard', undefined, '');
      expect(result.pathname).toBe('/dashboard');
      expect(result.search).toBe('');
    });
  });
});

