import { Database } from './db';
import { RowDataPacket } from 'mysql2';

export class UserRepository {
  private db = Database.getInstance();

  async authenticate(username: string, password: string): Promise<boolean> {
    const [rows] = await this.db.execute<RowDataPacket[]>(
      'SELECT * FROM users WHERE username = ? AND password = ?',
      [username, password]
    );
    return rows.length > 0;
  }
}