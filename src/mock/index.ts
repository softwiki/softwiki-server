import { IDatabase, IDatabaseRepository, Note, Tag, Category } from "@app/database";

/*function databaseRepositoryFactory<DataType>(name: string): SQLDatabaseRepository<DataType>
{
	return new SQLDatabaseRepository(name);
}*/

export class DatabaseRepositoryMock<DataType> implements IDatabaseRepository<DataType> {

	private _name: string
	private _data: DataType[]

	constructor(name: string, data: DataType[]) {
		this._name = name;
		this._data = data;
	}

	public async all(): Promise<DataType[]> {
		return this._data;
	}

	public async create(data: Partial<DataType>): Promise<DataType> {
		return data as DataType;
	}
}

export class DatabaseMock implements IDatabase {

	public notes: IDatabaseRepository<Note>
	public tags: IDatabaseRepository<Tag>
	public categories: IDatabaseRepository<Category>

	constructor(fakeData: {notes: Note[], tags: Tag[], categories: Category[]}) {
		this.notes = new DatabaseRepositoryMock<Note>("notes", fakeData.notes)
		this.tags = new DatabaseRepositoryMock<Tag>("tags", fakeData.tags)
		this.categories = new DatabaseRepositoryMock<Category>("categories", fakeData.categories)
	}
}