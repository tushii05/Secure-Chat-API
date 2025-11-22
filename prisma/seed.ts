import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const password = await bcrypt.hash('Password123!', 10);

    const alice = await prisma.user.upsert({
        where: { email: 'tushar@example.com' },
        update: {},
        create: { email: 'tushar@example.com', passwordHash: password, name: 'Tushar' }
    });

    const bob = await prisma.user.upsert({
        where: { email: 'tushii@example.com' },
        update: {},
        create: { email: 'tushii@example.com', passwordHash: password, name: 'tushii' }
    });

    const [a, b] = alice.id < bob.id ? [alice, bob] : [bob, alice];

    await prisma.conversation.upsert({
        where: { userAId_userBId: { userAId: a.id, userBId: b.id } } as any,
        update: {},
        create: { userAId: a.id, userBId: b.id }
    } as any);

    console.log('Seed completed.');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
