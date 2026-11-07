import { prisma } from '../prisma';

export async function generateNextToken(clinicId: string, prefix = 'A'): Promise<string> {
  const today = new Date().toISOString().split('T')[0];

  // Find all existing entries for today that have a valid prefix-number token
  const entries = await prisma.queueEntry.findMany({
    where: {
      clinicId,
      queueDate: today,
      token: {
        startsWith: `${prefix}-`,
      },
    },
    select: { token: true },
  });

  let maxNum = 100;
  for (const e of entries) {
    const numPart = parseInt(e.token.replace(`${prefix}-`, ''), 10);
    if (!isNaN(numPart) && numPart > maxNum) {
      maxNum = numPart;
    }
  }

  return `${prefix}-${maxNum + 1}`;
}

