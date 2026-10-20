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

export async function insertBooks(client:pg.ClientBase,authorId:number, books:Book[]): Promise<{title:string; pages:number; publish_date:Date}[]>{
    const result = await client.query(
        ` INSERT INTO books (author_id, title, pages, publish_date)
        SELECT $1, * FROM unnest($2::text[], $3::int[], $4::date[])
        RETURNING *;
        `, [authorId, 
            books.map(book => book.title), 
            books.map(book=>book.pages), 
            books.map(book => book.publishDate?? null)
        ]
    );
        
    return result.rows;
}

export async function getBooksByAuthor(client:pg.ClientBase, authorId:number):Promise<{name:string;title:string;}[]>{
    const result = await client.query<{name:string; title:string}>(`
        SELECT b.title, a.name, 
        FROM books b JOIN authors a
        ON a.id = b.author_id
        WHERE b.author_id = $1
        ORDER BY 
        b.publish_date DESC;
        `, [authorId]);
    return result.rows;
}