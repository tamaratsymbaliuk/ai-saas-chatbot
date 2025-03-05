"use server";

import { currentUser } from "@clerk/nextjs/server";
import prisma  from "@/lib/prisma"; // Import the Prisma client
import { revalidatePath } from "next/cache";

export const onIntegrateDomain = async (
  campaignId: string,
  domain: string,
  icon: string
) => {
  const user = await currentUser();
  if (!user) return { status: 401, message: "Unauthorized" };

  try {
    const dbUser = await prisma.user.findFirst({
      where: { clerkId: user.id },
      include: {
        domains: true,
        billing: {
        },
        campaigns: {
          take: 1,
        },
      },
    });

    if (!dbUser) {
      return { status: 404, message: "User not found" };
    }

    // Check if the domain already exists
    const existingDomain = await prisma.domain.findFirst({
      where: {
        name: domain,
        userId: dbUser.id,
      },
    });

    if (existingDomain) {
      return { status: 400, message: "Domain already exists" };
    }

    // Check the subscription plan and enforce limits
    const currentPlan = dbUser.billing?.plan || "FREE";
    const domainLimit =
      currentPlan === "BASIC" ? 10 : currentPlan === "PREMIUM" ? -1 : 3;

    if (domainLimit !== -1 && dbUser.domains.length >= domainLimit) {
      return {
        status: 403,
        message: `You've reached the maximum number of domains for your ${currentPlan} plan`,
      };
    }

    // Get or create a default campaign
    let targetCampaignId = campaignId;
    if (!targetCampaignId) {
      const defaultCampaign =
        dbUser.campaigns[0] ||
        (await prisma.campaign.create({
          data: {
            name: "Default Campaign",
            customers: [],
            userId: dbUser.id,
          },
        }));
      targetCampaignId = defaultCampaign.id;
    }

    // Create a new domain entry and link it to the user
    const newDomain = await prisma.domain.create({
      data: {
        name: domain,
        icon,
        userId: dbUser.id,
        //campaignId: targetCampaignId,
      },
    });

    revalidatePath("/dashboard");
    return {
      status: 200,
      message: "Domain successfully added",
      domain: newDomain,
    };
  } catch (error) {
    console.error(error);
    return { status: 500, message: "Internal Server Error" };
  }
};

// "use server";

// import { currentUser } from "@clerk/nextjs/server";
// import prisma  from "@/lib/prisma"; // Import the Prisma client

// export const onIntegrateDomain = async (domain: string, icon: string) => {
//   const user = await currentUser();
//   if (!user) return { status: 401, message: "Unauthorized" };

//   try {
//     // Fetch the user's plan from the Billings table
//     const userBilling = await prisma.billings.findUnique({
//       where: { userId: user.id },
//       select: { plan: true },
//     });

//     if (!userBilling) return { status: 403, message: "No active plan found" };

//     // Define domain limits per plan
//     const domainLimits = {
//       FREE: 1,
//       BASIC: 3,
//       PREMIUM: 10,
//     };

//     // Get the current domain count
//     const userDomains = await prisma.domain.count({
//       where: { userId: user.id },
//     });

//     // Check if the domain already exists
//     const existingDomain = await prisma.domain.findFirst({
//      where: { name: domain, userId: user.id },
//    });

//     if (existingDomain) return { status: 400, message: "Domain already added" };

//     // Enforce plan limits
//     if (userDomains >= domainLimits[userBilling.plan]) {
//       return { status: 403, message: "Domain limit reached for your plan" };
//     }

//     // Add new domain
//     await prisma.domain.create({
//       data: {
//         name: domain,
//         icon,
//         userId: user.id,
//       },
//     });

//     return { status: 200, message: "Domain successfully added" };
//   } catch (error) {
//     console.error(error);
//     return { status: 500, message: "Internal Server Error" };
//   }
// };
