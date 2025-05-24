import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import FacebookProvider from "next-auth/providers/facebook";
import EmailProvider from "next-auth/providers/email";
import NextAuth, { AuthOptions, User } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import connection from "@/db/db";
import PostgresAdapter from "C:/Users/natha/Documents/Dev/BachelorCDWM/Projets/MyFestivalCompanion/myfestivalcompanion/app/ProcessFcts/pgAdapter"


async function createUser(user: any){
  const table = "article";
const query = `INSERT INTO ${table} name, email, imageprofil VALUES ${user.name, user.email, user.image})`;

const festivalBulkMapInfos = await connection.query(query);
return 'toto';
}  

declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PostgresAdapter(),  // Utiliser l'adaptateur PostgreSQL
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user}) {
      console.log("Utilisateur:", user);
      return true;
    },
    async jwt({ token, user }) {
      // Vérifiez si l'utilisateur existe et affichez ses informations
      if (user) {
        console.log("JWT Callback - User:", user);
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      } else {
        console.log("JWT Callback - Token:", token);
      }
      return token;
    },

    // Callback exécuté pour ajouter des informations au session
    async session({ session, token }) {
      // Vérifiez si le token contient des données
      console.log("Session Callback - Token:", token);
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
      }
      console.log("Session Callback - Session:", session);
      return session;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl; // Redirige vers la page d'accueil ou une page spécifique après la connexion
    },
  },
  cookies: {
    sessionToken: {
      name: 'next-auth.session-token', // Nom du cookie
      options: {
        httpOnly: true, // Le cookie est accessible uniquement par le serveur
        // secure: process.env.NODE_ENV === 'production', 
        sameSite: 'lax', // Politique SameSite
      },
    },
  },
  pages: {
    signIn: "/account",
  },
});



export { handler as GET, handler as POST };
