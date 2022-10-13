import { test, expect } from '@jest/globals';
import { convertSlug } from './utils';

test('slug', () => {
    expect(convertSlug('grinning face')).toBe('grinning-face');
    expect(convertSlug('upside-down face')).toBe('upside-down-face');
    expect(convertSlug('butterfly')).toBe('butterfly');
    expect(convertSlug('man’s shoe')).toBe('mans-shoe');
    expect(convertSlug('O button (blood type)')).toBe('o-button-blood-type');
    expect(convertSlug('Japanese “here” button')).toBe('japanese-here-button');
    expect(convertSlug('flag: Ascension Island')).toBe('flag-ascension-island');
    expect(convertSlug('flag: Ceuta & Melilla')).toBe('flag-ceuta-melilla');
});
