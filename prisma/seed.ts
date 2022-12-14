import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      {
        name: 'Erick',
        email: 'erick@gmail.com',
        password: await argon2.hash('Erick123'),
        isConfirmed: true
      },
      {
        name: 'Violetta',
        email: 'violetta@gmail.com',
        password: await argon2.hash('Violetta123'),
        isConfirmed: true
      },
      {
        name: 'Jessyca',
        email: 'jessyca@gmail.com',
        password: await argon2.hash('Jessyca123'),
        isConfirmed: true
      }
    ]
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
