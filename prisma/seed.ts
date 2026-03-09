import { PrismaClient, Role } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash("Areeb2004", 10)

  const teacher = await prisma.user.upsert({
    where: { email: "160722747302@methodist.edu.com" },
    update: {},
    create: {
      name: "Main Teacher",
      email: "160722747302@methodist.edu.com",
      password: hashedPassword,
      role: Role.TEACHER,
      isApproved: true,
    },
  })
  

  console.log("✅ Teacher created:", teacher.email)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })