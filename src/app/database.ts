import mariadb from "mariadb"

export abstract class IDatabase {

	public abstract notes: IDatabaseRepository<Note>
	public abstract tags: IDatabaseRepository<Tag>
	public abstract categories: IDatabaseRepository<Category>

}

export abstract class IDatabaseRepository<DataType> {
	public abstract all(): Promise<DataType[]>
	public abstract create(data: Partial<DataType>): Promise<DataType>
	//public abstract update(data: Partial<DataType>): Promise<DataType[]>
	//public abstract delete(data: Partial<DataType>): Promise<void>
}

export class SQLDatabaseRepository<DataType> implements IDatabaseRepository<DataType> {

	private _name: string

	constructor(name: string) {
		this._name = name;
	}

	public async all(): Promise<DataType[]> {
		//return await SQL(`SELECT * FROM ${this._name}`)
		return [] // tmp
	}

	public async create(data: Partial<DataType>): Promise<DataType> {
		const keys = Object.keys(data).join(", ")
		const values = (Object.values(data) as string[]).map((value: string) => `'${value}'`).join(", ")
		//return await SQL(`INSERT INTO ${this._name} VALUES (${keys}) VALUES ${values}`)
		return {} as DataType // tmp
	}
}

export default class SQLDatabase implements IDatabase {

	public notes: IDatabaseRepository<Note>
	public tags: IDatabaseRepository<Tag>
	public categories: IDatabaseRepository<Category>

	constructor() {
		this.notes = new SQLDatabaseRepository("notes");
		this.tags = new SQLDatabaseRepository("tags");
		this.categories = new SQLDatabaseRepository("categories");
	}
}

export interface Note {
	id: string
	title: string
	tags: string[]
	category: string | undefined
}

export interface Tag {
	id: string
	name: string
	color: {r: number, g: number, b: number, a: number}
}

export interface Category {
	name: string
}