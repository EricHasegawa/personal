import { cn } from '@/lib/utils';

describe('Utility Functions', () => {
  describe('cn (className utility)', () => {
    it('combines class names correctly', () => {
      const result = cn('class1', 'class2');
      expect(result).toContain('class1');
      expect(result).toContain('class2');
    });

    it('handles conditional classes', () => {
      const showConditional = true;
      const showNever = false;
      const result = cn(
        'always',
        showConditional && 'conditional',
        showNever && 'never',
      );
      expect(result).toContain('always');
      expect(result).toContain('conditional');
      expect(result).not.toContain('never');
    });

    it('handles empty and undefined values', () => {
      const result = cn('valid', '', undefined, null);
      expect(result).toContain('valid');
      expect(result).not.toContain('undefined');
      expect(result).not.toContain('null');
    });

    it('handles arrays of classes', () => {
      const result = cn(['class1', 'class2'], 'class3');
      expect(result).toContain('class1');
      expect(result).toContain('class2');
      expect(result).toContain('class3');
    });

    it('prefers last instance of a class', () => {
      const result = cn('p-4', 'p-2');
      expect(result).toContain('p-2');
      expect(result).not.toContain('p-4');
    });
  });
});
