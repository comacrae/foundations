import { withTransaction, getPool} from "./db.js";
import { insertAuthor, insertBooks, getBooksByAuthor} from "./queries.js";

const pool = getPool();
type Book = {
    title:string;
    pages:number;
    publishDate?:Date;
}

const books: Book[] = [
    { title: "The Name of the Wind", pages: 662, publishDate: new Date("2007-03-27") },
    { title: "The Wise Man's Fear", pages: 994, publishDate: new Date("2011-03-01") },
    { title: "The Slow Regard of Silent Things", pages: 159, publishDate: new Date("2014-10-28") },
    { title: "The Doors of Stone", pages:100 },   // unpublished: no date
];


withTransaction(pool, async (client) => {
    const authorId = await insertAuthor(client, "Patrick Rothfuss",  new Date("1973-06-06"));
    const savedBooks = await insertBooks(client, authorId, books);
    const booksByPatrick = await getBooksByAuthor(client,authorId);
    console.log(booksByPatrick)
})