import mariadb from "mariadb"
import sqlite3 from "sqlite3"
import { Category, IDatabase, IDatabaseRepository, Note, Tag } from "./database";

export class SQLiteDatabaseRepository<DataType> implements IDatabaseRepository<DataType> {

	private _name: string
	private _sql: sqlite3.Database

	constructor(name: string, sql: sqlite3.Database) {
		this._name = name;
		this._sql = sql;
	}

	public all(): Promise<DataType[]> {
		return new Promise((resolve, reject) => {
			this._sql.all(`SELECT * FROM ${this._name}`, (err, rows) => {
				if (err)
					return reject(err)
				resolve(rows);
			});
		})
	}

	public async create(data: Partial<DataType>): Promise<DataType> {
		const keys = Object.keys(data).map((value: string) => `'${value}'`).join(", ")
		const values = (Object.values(data) as string[]).map((value: string) => `'${value}'`).join(", ")

		return new Promise((resolve, reject) => {
			this._sql.run(`INSERT INTO ${this._name} (${keys}) VALUES (${values})`, function(err) {
				if (err)
					return reject(err)
				console.log(this.lastID)
				resolve({...data as DataType, id: this.lastID});
			});
		})
	}
}

export class SQLiteDatabase implements IDatabase {

	private _filename: string;
	private _db: sqlite3.Database = {} as any

	public notes: IDatabaseRepository<Note> = {} as any
	public tags: IDatabaseRepository<Tag> = {} as any
	public categories: IDatabaseRepository<Category> = {} as any
	
	private constructor(filename: string) {
		this._filename = filename
	}

	private async _createTables(): Promise<void> {
		await this._execQuery(`
			CREATE TABLE IF NOT EXISTS 'notes' (
				'id' INTEGER PRIMARY KEY,
				'title' VARCHAR(64) NOT NULL,
				'content' TEXT NOT NULL,
				'categoryId' INTEGER,
				FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE SET NULL
			)`)

		await this._execQuery(`
			CREATE TABLE IF NOT EXISTS 'tags' (
				'id' INTEGER PRIMARY KEY,
				'name' VARCHAR(64) NOT NULL,
				'color' VARCHAR(64) NOT NULL
			)`)

		await this._execQuery(`
			CREATE TABLE IF NOT EXISTS 'categories' (
				'id' INTEGER PRIMARY KEY,
				'name' VARCHAR(64) NOT NULL
			)`)

		await this._execQuery(`
			CREATE TABLE IF NOT EXISTS 'notes_tags_links' (
				'id' INTEGER PRIMARY KEY,
				'noteId' INTEGER NOT NULL,
				'tagId' INTEGER NOT NULL,
				FOREIGN KEY (noteId) REFERENCES notes(id),
				FOREIGN KEY (tagId) REFERENCES tags(id)
			)`)
	}

	private _execQuery(query: string): Promise<void> {
		return new Promise((resolve, reject) => {
			this._db.exec(query, (err) => {
				if (err)
					return reject(err)
				resolve();
			})
		})
	}

	public async setup(): Promise<void> {

		this._db = new sqlite3.Database(this._filename)

		await this._createTables();

		this.notes = new SQLiteDatabaseRepository("notes", this._db);
		this.tags = new SQLiteDatabaseRepository("tags", this._db);
		this.categories = new SQLiteDatabaseRepository("categories", this._db);

		
	}

	static async create(filename: string): Promise<IDatabase> {
		const database = new SQLiteDatabase(filename);
		await database.setup()
		return database;
	}
}