import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BooksPage = () => {
  const [books, setBooks] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/books")
      .then(res => res.json())
      .then(data => {
        setBooks(data);
        setLoading(false);
      });
  }, );

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="page-title">All Books</h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Books List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : books.length === 0 ? (
            <p>No books found.</p>
          ) : (
            <ul className="space-y-4">
              {books.map((book) => (
                <li key={book._id}>
                  <strong>{book.title}</strong> by {book.author}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BooksPage;