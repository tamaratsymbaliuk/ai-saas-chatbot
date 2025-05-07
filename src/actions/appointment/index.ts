'use server'

import prisma  from "@/lib/prisma"; 
import { currentUser } from '@clerk/nextjs/server'

export const onDomainCustomerResponses = async (customerId: string) => {
  try {
    const customerQuestions = await prisma.customer.findUnique({
      where: {
        id: customerId,
      },
      select: {
        email: true,
        responses: {
          select: {
            id: true,
            question: true,
            answered: true,
          },
        },
      },
    })

    if (customerQuestions) {
      return customerQuestions
    }
  } catch (error) {
    console.log(error)
  }
}

export const onGetAllDomainBookings = async (domainId: string) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        domainId,
      },
      select: {
        slot: true,
        date: true,
      },
    })

    if (bookings) {
      return bookings
    }
  } catch (error) {
    console.log(error)
  }
}

export const onBookNewAppointment = async (
  domainId: string,
  customerId: string,
  slot: string,
  date: string,
  email: string
) => {
  try {
    const booking = await prisma.customer.update({
      where: {
        id: customerId,
      },
      data: {
        bookings: {
          create: {
            domainId,
            slot,
            date,
            email,
          },
        },
      },
    })

    if (booking) {
      return { status: 200, message: 'Booking created' }
    }
  } catch (error) {
    console.log(error)
  }
}

export const saveAnswers = async (
  questions: [question: string],
  customerId: string
) => {
  try {
    for (const question in questions) {
      await prisma.customer.update({
        where: { id: customerId },
        data: {
          responses: {
            update: {
              where: {
                id: question,
              },
              data: {
                answered: questions[question],
              },
            },
          },
        },
      })
    }
    return {
      status: 200,
      messege: 'Updated Responses',
    }
  } catch (error) {
    console.log(error)
  }
}

export const onGetAllBookingsForCurrentUser = async (clerkId: string) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        customer: {
          domain: {
            user: {
              clerkId,
            },
          },
        },
      },
      select: {
        id: true,
        slot: true,
        createdAt: true,
        date: true,
        email: true,
        domainId: true,
        customer: {
          select: {
            domain: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    })

    return {
      status: 200,
      data: bookings
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      error: 'Failed to fetch bookings'
    };
  }
}

export const getUserAppointments = async () => {
  try {
    const user = await currentUser()
    if (user) {
      const bookings = await prisma.booking.count({
        where: {
          customer: {
            domain: {
              user: {
                clerkId: user.id,
              },
            },
          },
        },
      })

      if (bookings) {
        return bookings
      }
    }
  } catch (error) {
    console.log(error)
  }
}