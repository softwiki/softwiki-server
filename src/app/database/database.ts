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

export interface Note {
	id: string
	title: string
	content: string
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