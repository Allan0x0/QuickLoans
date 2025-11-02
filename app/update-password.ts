import bcrypt from 'bcryptjs';

import { prisma } from './db.server';

async function run() {
  const HASHED_PASSWORD = await bcrypt.hash('jarnbjorn@8901', 10);

  console.log('Fetching user...');
  const user = await prisma.user.findFirst({
    where: { emailAddress: 'admin@gmail.com' },
  });
  if (!user) {
    console.error('User not found');
    throw new Error('User not found');
  }
  console.log('User found:', user.id);
  console.log('Updating password...');
  await prisma.user.update({
    where: { id: user.id },
    data: { hashedPassword: HASHED_PASSWORD },
  });
  console.log('Password updated successfully');
  console.log('Done');
}
run();
