import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      { name: 'Erick', email: 'erickcartiady@gmail.com' },
      { name: 'Violetta P. Kartiadi', email: 'violetta.cartiady@gmail.com' },
      { name: 'Jessyca Kartiadi', email: 'jessycaputrikartiadi@gmail.com' },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
