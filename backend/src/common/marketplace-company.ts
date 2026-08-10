import { PrismaService } from '../prisma/prisma.service';

/** Resolve or create a platform company so students can post marketplace listings. */
export async function ensureMarketplaceCompany(prisma: PrismaService) {
  const existing = await prisma.company.findFirst({
    where: { deletedAt: null },
    orderBy: { createdAt: 'asc' },
  });
  if (existing) return existing;

  let admin = await prisma.user.findFirst({
    where: { role: 'ADMIN', deletedAt: null },
    orderBy: { createdAt: 'asc' },
  });
  if (!admin) {
    admin = await prisma.user.findFirst({
      where: { deletedAt: null },
      orderBy: { createdAt: 'asc' },
    });
  }
  if (!admin) {
    throw new Error('No user available to own marketplace company');
  }

  const owned = await prisma.company.findUnique({ where: { userId: admin.id } });
  if (owned && !owned.deletedAt) return owned;

  return prisma.company.create({
    data: {
      userId: admin.id,
      name: 'Ellowring Marketplace',
      industry: 'EdTech',
      city: 'India',
      description: 'Platform listings created from the student dashboard.',
      verified: true,
    },
  });
}

export function slugify(input: string, prefix = 'item') {
  const base = String(input || prefix)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
  return `${base || prefix}-${Date.now().toString(36)}`;
}
