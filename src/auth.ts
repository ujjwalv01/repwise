import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import NodemailerProvider from "next-auth/providers/nodemailer"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import { createTransport } from "nodemailer"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    NodemailerProvider({
      server: {
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM || "RepWise <no-reply@repwise.app>",
      generateVerificationToken: () => {
        return Math.floor(100000 + Math.random() * 900000).toString()
      },
      sendVerificationRequest: async ({ identifier, provider, token }) => {
        try {
          console.log("\n=========================================================")
          console.log(`🔐 ATTEMPTING TO SEND EMAIL TO: ${identifier}`)
          console.log(`🔑 YOUR OTP CODE IS: ${token}`)
          console.log("=========================================================\n")
          
          const transport = createTransport(provider.server)
          const result = await transport.sendMail({
            to: identifier,
            from: provider.from,
            subject: `Your RepWise Sign In Code (${new Date().toLocaleTimeString()})`,
            html: `
              <div style="font-family: sans-serif; text-align: center; padding: 20px;">
                <h2>Welcome to RepWise!</h2>
                <p>Your one-time password (OTP) to sign in is:</p>
                <h1 style="letter-spacing: 4px; font-size: 36px; color: #333;">${token}</h1>
                <p>This code will expire in 15 minutes.</p>
              </div>
            `,
          })
          
          const failed = result.rejected.concat(result.pending).filter(Boolean)
          if (failed.length) {
            throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`)
          }
          console.log("Email sent successfully via Nodemailer!")
        } catch (error: any) {
          console.log("\n❌ ================= GOOGLE SMTP ERROR =================")
          console.error(error.message || error)
          console.log("=========================================================\n")
          throw new Error("Failed to send verification email")
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // If logging in with Google and the DB name is currently blank (due to earlier email login),
      // aggressively patch the database with the Google name!
      if (account?.provider === "google" && profile?.name && !user.name && user.id) {
        await prisma.user.update({
          where: { id: user.id },
          data: { name: profile.name },
        });
        user.name = profile.name; // Update it in memory for the immediate session
      }
      return true;
    },
    session: async ({ session, user }) => {
      if (session?.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  events: {
    async linkAccount({ user, profile }) {
      // If the user originally signed up with Email (so their name is null),
      // and they later link their Google account, update their database profile
      // with their actual Google name!
      if (!user.name && profile?.name) {
        await prisma.user.update({
          where: { id: user.id },
          data: { name: profile.name },
        })
      }
    }
  }
})
