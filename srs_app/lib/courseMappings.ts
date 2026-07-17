// Mapping from course id to slug (used in link generation)
export const slugMap: Record<number, string> = {
  1: 'math',
  2: 'chem',
  3: 'phys',
  4: 'history',
  5: 'geo',
  6: 'biology',
  7: 'english',
  8: 'programming',
  9: 'literature',
  10: 'gdcd',
  11: 'french',
  12: 'science',
};

// Get slug from course id
export function getCourseSlug(id: number): string | undefined {
  return slugMap[id];
}

// Reverse map: slug -> id
export function idFromSlug(slug: string): number | undefined {
  const entry = Object.entries(slugMap).find(([, value]) => value === slug);
  return entry ? Number(entry[0]) : undefined;
}

// Prefix mapping for exam ids
export const courseExamPrefixMap: Record<number, string[]> = {
  1: ['math'], // Toán học
  2: ['chem'], // Hóa học
  3: ['phys'], // Vật Lý
  4: ['history'],
  5: ['geo'],
  6: ['biology'],
  7: ['eng'], // Tiếng Anh
  8: ['programming'],
  9: ['literature'],
  10: ['gdcd'],
  11: ['french'],
  12: ['science'],
};