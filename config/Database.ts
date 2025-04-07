import 'reflect-metadata';
import { DataSource } from 'typeorm';
import config from 'config';
import { User } from '../entities/User';

class Database {
	public static dataSource: DataSource;

	public static async connect(): Promise<void> {
		try {
			const db = config.get('db') as {
				type: string;
				host: string;
				port: number;
				name: string;
				username: string;
				password: string;
				synchronize: boolean;
				logging: boolean;
			};

			this.dataSource = new DataSource({
				type: db.type as 'mongodb' | 'postgres' | 'mysql' | 'mariadb' | 'sqlite' | 'mssql' | 'oracle',
				host: db.host,
				port: db.port,
				database: db.name,
				username: db.username,
				password: db.password,
				synchronize: db.synchronize,
				logging: db.logging,
				entities: [User],
			});

			await this.dataSource.initialize();
			console.log('TypeORM connected');
		} catch (error) {
			console.error('TypeORM connection error:', error);
		}
	}
}

export default Database;