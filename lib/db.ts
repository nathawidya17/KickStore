import mysql from 'mysql2/promise';

export class Database {
  private static instance: mysql.Pool;

  private constructor() {}

  public static getInstance(): mysql.Pool {
    if (!Database.instance) {
      Database.instance = mysql.createPool({
        host: 'localhost',
        user: 'root', 
        password: '', 
        database: 'shoestore',
        port: 3307, 
      });
    }
    return Database.instance;
  }
}