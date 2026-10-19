import pg from "pg";
type Book = {
    title:string;
    pages: number;
    publishDate?:Date
};
export async function insertAuthor(pool:pg.Pool,name:string, birthDate:Date, books:Book[]):Promise<void>{
    //connect client
    const client = await pool.connect();
    let booksInserted: string | undefined = undefined;

    //start transaction
    try{
        await client.query(`BEGIN TRANSACTION`);

        //insert one author with parameters for name and birth date and get their id
        let result = await client.query<{id:number}>(
            ` INSERT INTO authors (name, birth_date)
            VALUES ($1::text, $2::date)
            RETURNING id;
            `,
            [name, birthDate]
        );

        const authorId = result.rows[0]!.id;
        //insert books for author passing returned id as param
        books.forEach(async (book) => {
            await client.query(
                ` INSERT INTO books (author_id, title, pages, publish_date)
                VALUES  ($1, ${book.title} , ${book.pages}, ${book.publishDate?? 'NULL'});
                `, [authorId]
            );
        })
        
        await client.query(`COMMIT;`);
        // select author back by id
        const authorResult = await client.query<{id:number, name:string, birthdate:Date}>(
            `select * from authors where id = $1`, [authorId]
        );

        if(!authorResult)
            throw new Error("Author didn't insert correctly");

        // run a join to get every book title with its author name, filtered to given author
        const bookQuery = await client.query<{name:string, title:string}>(
            `select books.title, authors.name from 
            authors inner join books on authors.id = authors.id
            `);
        booksInserted = bookQuery.rows.join("\n");
    }catch(err){
        await client.query(`ROLLBACK;`);
    }finally{
        // log results and close connection
        if(booksInserted)
            console.log(`Inserted books: ${booksInserted}`);
        client.release();
    }
}
