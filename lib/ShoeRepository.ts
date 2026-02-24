import { Database } from './db';
import { RowDataPacket } from 'mysql2';

// Entity Class
export class Shoe {
  constructor(
    public id: number, 
    public name: string, 
    public brand: string,
    public size: string,
    public price: number, 
    public image_url: string, 
    public description: string
  ) {}
}

// Repository Class (Logika CRUD)
export class ShoeRepository {
  private db = Database.getInstance();

  // 1. Get All (Read)
  async getAll(): Promise<Shoe[]> {
    const [rows] = await this.db.query<RowDataPacket[]>('SELECT * FROM shoes ORDER BY id DESC');
    return rows as Shoe[];
  }

  // 2. Create (Insert)
  async create(shoe: Omit<Shoe, 'id'>): Promise<void> {
    await this.db.execute(
      'INSERT INTO shoes (name, brand, size, price, image_url, description) VALUES (?, ?, ?, ?, ?, ?)',
      [shoe.name, shoe.brand, shoe.size, shoe.price, shoe.image_url, shoe.description] as any[] 
    );
  }

  // 3. Delete
  async delete(id: number): Promise<void> {
    await this.db.execute('DELETE FROM shoes WHERE id = ?', [id] as any[]); 
  }
  
  // 4. Update (Edit)
  async update(id: number, shoe: Partial<Shoe>): Promise<void> {
    if (shoe.image_url) {
      await this.db.execute(
        'UPDATE shoes SET name=?, brand=?, size=?, price=?, image_url=? WHERE id=?',
        [shoe.name, shoe.brand, shoe.size, shoe.price, shoe.image_url, id] as any[] 
      );
    } else {
      await this.db.execute(
        'UPDATE shoes SET name=?, brand=?, size=?, price=? WHERE id=?',
        [shoe.name, shoe.brand, shoe.size, shoe.price, id] as any[] 
      );
    }
  }
  
}