// app/api/users/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // adjust path if needed

async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        email_verified: true,
        age: true,
        created_at: true,
        updated_at: true,
        provider_name: true,
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('[GET /api/users]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

async function createUser(req: Request) {
    try {
      const body = await req.json();
      const {
        username,
        email,
        password,
        age,
        email_verified,
        provider_id,
        provider_name,
        access_token,
      } = body;
  
      if (!username || !email || !password) {
        return new NextResponse('Missing required fields', { status: 400 });
      }
  
      const newUser = await prisma.user.create({
        data: {
          username,
          email,
          password,
          age,
          email_verified,
          provider_id,
          provider_name,
          access_token,
        },
      });
  
      return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
      console.error('[POST /api/users]', error);
      return new NextResponse('Internal Server Error', { status: 500 });
    }
  }

  export { getUsers as GET, createUser as POST };
