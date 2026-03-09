import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import Landing from "@/components/Landing"

export default async function Home() {
  const session = await getServerSession(authOptions)

  // We no longer redirect automatically. 
  // This allows logged-in users to actually see the landing page and LOGOUT.
  return <Landing session={session} />
}