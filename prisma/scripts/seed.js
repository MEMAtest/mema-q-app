// prisma/scripts/seed.js
const { PrismaClient, Prisma } = require('@prisma/client');
// This assumes you have created the file 'lib/checklistData.js' as per the previous instruction
const { checklistData } = require('../../lib/checklistData'); 

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);
  
  await prisma.question.deleteMany();
  console.log('Deleted existing questions.');

  for (const section of checklistData) {
    for (const item of section.items) {
      await prisma.question.create({
        data: {
          id: item.id,
          sectionId: section.id,
          sectionTitle: section.title,
          questionText: item.question,
          type: item.type,
          options: item.options || [], 
          explanation: item.explanation,
          // THIS IS THE FIX: Changed 'ref' to 'questionRef' to match your database schema
          questionRef: item.ref, 
          complianceImplicationIfNo: item.complianceImplicationIfNo,
          complianceImplicationIfSelected: item.complianceImplicationIfSelected || Prisma.JsonNull,
        },
      });
    }
  }
  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
  