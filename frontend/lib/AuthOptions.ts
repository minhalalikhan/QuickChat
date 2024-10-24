import axios from "axios";
import { AuthOptions, NextAuthOptions, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {

    pages: {
        signIn: '/signin',

        signOut: '/signout'
    },

    secret: process.env.NEXTAUTH_URL,
    providers: [
        CredentialsProvider({
            name: 'Credentials',

            credentials: {
                email: { label: 'email', type: 'text', placeholder: '' },
                password: { label: 'password', type: 'password', placeholder: '' },
            },
            async authorize(credentials) {

                try {
                    const response = await axios.post('http://localhost:4000/auth/signin', {
                        email: credentials?.email,
                        password: credentials?.password
                    })

                    const id_ = credentials?.email.toString() || ''

                    if (response.status === 200) {
                        // console.log('authorize reponse', { email: credentials?.email, token: response.data.token, id: id_ })

                        return { email: credentials?.email, token: response.data.token, id: id_ }
                    }

                    console.log('authorize returning null')
                    return null
                }
                catch (e: any) {
                    console.log('authorize returning null from catch')
                    console.log(e.response.status)
                    console.log(e.response.statusText)

                    const errText = e.response.data
                    console.log(errText, typeof errText)
                    // custom Error message
                    throw new Error(errText)
                    // return null
                }
            },

        })
        // GoogleProvider({})
    ],
    callbacks: {
        async jwt({ token, user }) {


            const newuser: User & { token?: string } = user
            if (user) {
                token.mytoken = newuser?.token

            }
            // console.log('jwt final repsonse', token)
            return token
        },
        async session({ session, token }) {
            const newtoken: JWT & { mytoken?: string } = token
            const Newsession: Session & { mytoken?: string } = session

            // Newsession.mytoken = newtoken.mytoken

            // console.log('new session', Newsession)
            return Newsession
        }
    }
}