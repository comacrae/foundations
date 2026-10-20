import pg from "pg";
type Book = {
    title:string;
    pages: number;
    publishDate?:Date
};
export async function insertAuthor(client:pg.ClientBase,name:string, birthDate:Date):Promise<number>{

        //insert one author with parameters for name and birth date and get their id
        let result = await client.query<{id:number}>(
            ` INSERT INTO authors (name, birth_date)
            VALUES ($1::text, $2::date)
            RETURNING id;
            `,
            [name, birthDate]
        );
        const authorId = result.rows[0]?.id;
        if(authorId === undefined)
            throw new Error("Author ID failed")
        return authorId;
}

export async function insertBooks(client:pg.ClientBase,authorId:number, books:Book[]): Promise<{title:string;name:string}[]>{
    await client.query(
        ` INSERT INTO books (author_id, title, pages, publish_date)
        SELECT $1, * FROM unnest($2::text[], $3::int[], $4::date[])
        `, [authorId, 
            books.map(book => book.title), 
            books.map(book=>book.pages), 
            books.map(book => book.publishDate?? null)
        ]
    );
        
        // run a join to get every book title with its author name, filtered to given author
        const bookQuery = await client.query<{name:string, title:string}>(
            `select books.title, authors.name from 
            authors inner join books on authors.id = books.author_id
            `);
            return bookQuery.rows;
}