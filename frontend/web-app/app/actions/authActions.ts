'use server';

import { prisma } from "@/app/lib/prisma";
import { LoginSchema } from "@/app/lib/schemas/loginSchema";
import { combinedRegisterSchema, profileSchema, RegisterSchema } from "@/app/lib/schemas/registerSchema";
import { ActionResult } from "@/app/types";
import { auth, signIn, signOut } from "@/auth";
import { TokenType, User } from "@prisma/client";
import bcrypt from 'bcryptjs';
import { AuthError } from "next-auth";
import { generateToken, getTokenByToken } from "../lib/tokens";
import { sendPasswordRestEmail, sendVerificationEmail } from "../lib/mail";


export async function signInUser(data: LoginSchema) : Promise<ActionResult<string>> {
    
    try {
        const existingUser = await getUserByEmail(data.email);

        if (!existingUser || !existingUser.email) return { status: 'error', error: 'Invalid credentials' }

        if(!existingUser.emailVerified) {
            const token = await generateToken(existingUser.email, TokenType.VERIFICATION);

            await sendVerificationEmail(token.email, token.token);

            return {status: 'error', error: 'Please verify your email address before logging in'}
        }

        const result = await signIn('credentials', {
            email: data.email,
            password: data.password,
            redirect: false
        })

        return { status: 'success', data: 'Logged in' }
    } catch (error) {
        console.log(error);

        if(error instanceof AuthError){
            switch (error.type) {
                case 'CredentialsSignin':
                    return { status: 'error', error: 'Invalid credentials' }
                default:
                    return { status: 'error', error: 'Something went wrong' }
            }
        } else {
            return { status: 'error', error: 'Something else went wrong' }
        }
    }
}

export async function signOutUser(){
    await signOut({redirectTo: '/'})
}

export async function registerUser(data: RegisterSchema): Promise<ActionResult<User>> {

    try {
        const validated = combinedRegisterSchema.safeParse(data);

        if(!validated.success) {
            return {status: 'error', error: validated.error.errors}
        }

        const {name, email, password, gender, description, dateOfBirth, country, city} = validated.data;

        const hashedPassword = await bcrypt.hash(password, 10);

        const exisitngUser = await prisma.user.findUnique({
            where: {email}
        });

        if(exisitngUser) return {status: 'error', error: 'User already exisits'};

        const user = await prisma.user.create({
            data: {
                name,
                email,
                passwordHas: hashedPassword,
                profileComplete: true,
                member: {
                    create: {
                        name,
                        description,
                        country,
                        city,
                        dateOfBirth: new Date(dateOfBirth),
                        gender
                    }
                }
            }
        });

        const verificationToken = await generateToken(email, TokenType.VERIFICATION);

        await sendVerificationEmail(verificationToken.email, verificationToken.token);
        
        return {status: 'success', data: user}
    } catch (error) {
        console.log(error);
        return {status: 'error', error: 'something went wrong'};
    }
}

export async function getUserByEmail(email: string) {
    return prisma.user.findUnique({where: {email}});
}

export async function getUserById(id: string) {
    return prisma.user.findUnique({where: {id}});
}

export async function getAuthUserId(){
    const session = await auth();
    const userId = session?.user?.id;

    if(!userId) throw new Error('Unauthorised');

    return userId;
}

export async function verifyEmail(token: string): Promise<ActionResult<string>> {
    try {
        const exisitingToken = await getTokenByToken(token);

        if(!exisitingToken) {
            return {status: 'error', error: 'Invalid token'}
        }

        const hasExpired = new Date() > exisitingToken.expires;
        
        if(hasExpired) {
            return {status: 'error', error:'Token has expired'}
        }
        
        const exisitingUser = await getUserByEmail(exisitingToken.email);

        if(!exisitingUser) {
            return {status: 'error', error: 'User not found'}
        }

        await prisma.user.update({
            where: {id: exisitingUser.id},
            data: {emailVerified: new Date()}
        });

        await prisma.token.delete({where: {id: exisitingToken.id}})

        return {status: 'success', data: 'Token verified'};
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function generateResetPasswordEmail(email: string): Promise<ActionResult<string>> {
    try {
        const existingUser = await getUserByEmail(email);

        if(!existingUser) {
            return {status: 'error', error: 'Email address not found'}
        }

        const token = await generateToken(email, TokenType.PASSWORD_RESET);

        await sendPasswordRestEmail(email, token.token)

        return {status: 'success', data: 'Password reset email hase been sent. Please check you inbox'}
    } catch (error) {
        console.log(error);
        return {status: 'error', error: 'something went wrong'}
    }
}

export async function resetPassword(password: string, token: string | null): Promise<ActionResult<string>> {

    try {
        if(!token) return {status: 'error', error: 'Missing token'};

        const exisitingToken = await getTokenByToken(token);

        if(!exisitingToken) {
            return {status: 'error', error: 'Invalid token'}
        }

        const hasExpired = new Date() > exisitingToken.expires;
        
        if(hasExpired) {
            return {status: 'error', error:'Token has expired'}
        }
        
        const exisitingUser = await getUserByEmail(exisitingToken.email);

        if(!exisitingUser) {
            return {status: 'error', error: 'User not found'}
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.update({where: {id: exisitingUser.id}, data: {passwordHas: hashedPassword}});

        await prisma.token.delete({where: {id: exisitingToken.id}});

        return {status: 'success', data: 'Your password has been reset'}    
    } catch (error) {
        console.log(error);
        return {status: 'error', error: 'something went wrong'}
    }
}

export async function completeSocialLoginProfile(data: profileSchema): Promise<ActionResult<string>> {
    const session = await auth();

    if(!session) return {status: 'error', error: 'User not found'};
    
    try {
        const user = await prisma.user.update({
            where: {id: session.user.id},
            data: {
                profileComplete: true,
                member: {
                    create: {
                        name: session.user.name as string,
                        image: session.user.image,
                        gender: data.gender,
                        dateOfBirth: new Date(data.dateOfBirth),
                        description: data.description,
                        city: data.city,
                        country: data.country
                    }
                }
            },
            select: {
                accounts: {
                    select: {
                        provider: true
                    }
                }
            }
        })
        return {status: 'success', data: user.accounts[0].provider}
    } catch (error) {
        console.log(error);
        return {status: 'error', error: 'something went wrong'}
    }
}