"use server";
import prisma from "@/lib/prisma"; // Import the Prisma client
import { clerkClient, currentUser } from "@clerk/nextjs/server"
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
          select: {
          plan: true,
     },
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


    // Create a new domain entry and link it to the user
    const newDomain = await prisma.domain.create({
      data: {
        name: domain,
        icon,
        userId: dbUser.id,
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


// Arslan's code
// export const onIntegrateDomain = async (domain: string, icon: string) => {
//   const user = await currentUser();
//   if (!user) return { status: 401, message: "Unauthorized" };

//   try {
//     // Fetch the user's plan from the Billings table
//     const subscription = await prisma.user.findUnique({
//       where: { clerkId: user.id },
//       select: { _count: {
//           select: {
//               domains: true,   
//           },
//         },
//         billing: {
//             select: {
//                 plan: true,
//             },
//         },
//     },
// })

// const domainExists = await prisma.user.findFirst({
//     where: {
//         clerkId: user.id,
//         domains: {
//             some: {
//                 name: domain,
//             },
//         },
//     },
// })

//     if (!domainExists) {
//         if (
//             (subscription?.billing?.plan == 'FREE' &&
//             subscription._count.domains < 1) ||
//             (subscription?.billing?.plan == 'BASIC' &&
//             subscription._count.domains < 5) ||
//             (subscription?.billing?.plan == 'PREMIUM' &&
//             subscription._count.domains < 10)
//         ) {
//             const newDomain = await prisma.user.update({
//                 where: {
//                     clerkId: user.id,
//                 },
//                 data: {
//                     domains: {
//                         create: {
//                             name: domain,
//                             icon,
//                             chatBot: {
//                                 create: {
//                                     welcomeMessage: 'Het there, have a question? text us here',
//                                 },
//                             },
//                         },
//                     },
//                 },
//             })

//             if (newDomain) {
//                 return { status: 200, message: 'Domain successfully added'}
//             }
//         }
//         return {
//             status: 400,
//             message:
//             "You've reached the maximum number of domains, upgrade your plan",
//         }
//     }
//     return {
//         status: 400,
//         message: 'Domain already exists',
//     }
// } catch (error) {
//     console.log(error)
// }
// }

// export const onGetSubscriptionPlan = async () => {
//     try {
//         const user = await currentUser()
//         if (!user) return 
//         const plan = await prisma.user.findUnique({
//             where: {
//                 clerkId: user.id,
//             },
//             select: {
//                 billing: {
//                     select: {
//                         plan: true,
//                     }

//                 }
//             }
//         })

    
    
    

    


// export const onUpdatePassword = async (password: string) => {
//     const update = await clerkClient[0].users.updateUser(user.id, { password })
//     if (update) {
//         return { status: 200, message: 'Password updated' }
//     }
// } catch (error) {
//     console.log(error)
// }
// }

export const onGetCurrentDomainInfo = async (domain: string) => {
    const user = await currentUser()
    if (!user) return
    try {
        const userDomain = await prisma.user.findUnique({
            where: {
                clerkId: user.id,
            },
            select: {
                billing: {
                    select: {
                        plan: true,
                    },
                },
                domains: {
                    where: {
                        name: {
                            contains: domain,
                        },
                    },
                    select: {
                        id: true,
                        name: true,
                        icon: true,
                        userId: true,
                        products: true,
                        chatBot: {
                            select: {
                                id: true,
                                welcomeMessage: true,
                                icon: true,
                            },
                        },
                    },
                },
            },
        })
        if (userDomain) {
            return userDomain
        }
    } catch (error) {
        console.log(error)
    }
}

// export const onUpdateDomain = async (id: string, name: string) => {
//     try {
//         // check if domain with name exists
//         const domainExists = await client.domain.findFirst({
//             where: {
//                 name: {
//                     contains: name,
//                 },
//             },
//         })
        
//         if (!domainExists) {
            
//         }

//     }
// }