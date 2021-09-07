import { IDatabase, IDatabaseRepository, Note, Tag, Category } from "@app/database";

/*function databaseRepositoryFactory<DataType>(name: string): SQLDatabaseRepository<DataType>
{
	return new SQLDatabaseRepository(name);
}*/

export class DatabaseRepositoryMock<DataType> implements IDatabaseRepository<DataType> {

	private _name: string
	private _data: DataType[]
	private _nextReturn: any[] = [];

	constructor(name: string, data: DataType[]) {
		this._name = name;
		this._data = data;
	}

	public async all(): Promise<DataType[]> {
		return this._popMockReturn();
	}

	public async create(data: Partial<DataType>): Promise<DataType> {
		return this._popMockReturn();
	}

	public addMockReturn(value: any): void {
		this._nextReturn.push(value);
	}

	private _popMockReturn(): any {
		if (this._nextReturn.length === 0) {
			console.error("Mock return stack is empty")
			throw Error("Mock return stack is empty");
		}
		const value = this._nextReturn.shift();
		return typeof value === "function" ? value() : value;
	}
}

export class DatabaseMock implements IDatabase {

	public notes: DatabaseRepositoryMock<Note>
	public tags: DatabaseRepositoryMock<Tag>
	public categories: DatabaseRepositoryMock<Category>

	constructor(fakeData: {notes: Note[], tags: Tag[], categories: Category[]}) {
		this.notes = new DatabaseRepositoryMock<Note>("notes", fakeData.notes)
		this.tags = new DatabaseRepositoryMock<Tag>("tags", fakeData.tags)
		this.categories = new DatabaseRepositoryMock<Category>("categories", fakeData.categories)
	}
}