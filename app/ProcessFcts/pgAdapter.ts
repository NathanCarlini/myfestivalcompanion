// lib/nextAuthPostgresAdapter.ts
import connection from "@/db/db";


export function PostgresAdapter() {
  return {
    async createUser(profile: any) {
      const { email, name, image } = profile;
      const res = await connection.query(
        `INSERT INTO users (email, name, image) VALUES ($1, $2, $3) RETURNING *`,
        [email, name, image]
      );
      return res.rows[0];
    },

    async getUser(id: string) {
      const res = await connection.query(`SELECT * FROM users WHERE id = $1`, [id]);
      return res.rows[0];
    },

    async getUserByEmail(email: string) {
      const res = await connection.query(`SELECT * FROM users WHERE email = $1`, [email]);
      return res.rows[0];
    },

    async getUserByAccount({ providerAccountId, provider }: { providerAccountId: string, provider: string }): Promise<any> {
        const res = await connection.query(
        `SELECT * FROM users left join accounts on accounts.user_id = users.id WHERE accounts."provider_account_id" = $1 AND accounts.provider = $2`,
        [providerAccountId, provider]
      );
      return res.rows[0];
    },

    async updateUser(user: any) {
      const { id, email, name, image } = user;
      const res = await connection.query(
        `UPDATE users SET email = $1, name = $2, image = $3 WHERE id = $4 RETURNING *`,
        [email, name, image, id]
      );
      return res.rows[0];
    },

    async linkAccount(account: any) {
      const { userId, provider, providerAccountId, access_token, refresh_token, expires_at, token_type, scope } = account;
      const res = await connection.query(
        `INSERT INTO accounts (user_id, provider, provider_account_id, access_token, refresh_token, expires_at, token_type, scope) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [userId, provider, providerAccountId, access_token, refresh_token, expires_at, token_type, scope]
      );
      return res.rows[0];
    },

    async createSession(session: any) {
      const { userId, expires } = session;
      const res = await connection.query(
        `INSERT INTO sessions (user_id, expires) VALUES ($1, $2) RETURNING *`,
        [userId, expires]
      );
      return res.rows[0];
    },

    async getSession(sessionToken: string) {
      const res = await connection.query(`SELECT * FROM sessions WHERE session_token = $1`, [sessionToken]);
      return res.rows[0];
    },

    async updateSession(session: any) {
      const { sessionToken, expires } = session;
      const res = await connection.query(
        `UPDATE sessions SET expires = $1 WHERE session_token = $2 RETURNING *`,
        [expires, sessionToken]
      );
      return res.rows[0];
    },

    async deleteSession(sessionToken: string) {
      const res = await connection.query(`DELETE FROM sessions WHERE session_token = $1`, [sessionToken]);
      return res.rowCount > 0;
    },
  };
}
