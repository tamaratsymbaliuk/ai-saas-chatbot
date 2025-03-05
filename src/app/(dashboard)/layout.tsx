import { Sidebar } from "@/components/SideBar";
import { currentUser } from "@clerk/nextjs/server";
import prisma  from "@/lib/prisma";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();
  const domains = user
    ? await prisma.domain.findMany({
        where: {
          user: {
            clerkId: user.id,
          },
        },
        select: {
          id: true,
          name: true,
          icon: true,
        },
      })
    : [];

  return (
    <div className="flex min-h-screen">
      <Sidebar domains={domains} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}