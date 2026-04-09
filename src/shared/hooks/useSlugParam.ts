import { useParams } from 'next/navigation';

export function useSlugParam(
  segmentIndex: number,
  expectedPrefix?: string,
): string | undefined {
  const params = useParams();
  const slug = params.slug as string[] | undefined;

  if (!slug || slug.length <= segmentIndex) {
    return undefined;
  }

  if (expectedPrefix && slug[0] !== expectedPrefix) {
    return undefined;
  }

  return slug[segmentIndex];
}
