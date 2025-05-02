import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const BorrowedBooksPage = () => {
  const [borrowedBooks, setBorrowedBooks] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/borrowed")
      .then(res => res.json())
      .then(data => {
        setBorrowedBooks(data);
        setLoading(false);
      });
  }, );

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="page-title">Borrowed Books</h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Borrowed List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : borrowedBooks.length === 0 ? (
            <p>No borrowed books found.</p>
          ) : (
            <ul className="space-y-4">
              {borrowedBooks.map((entry) => (
                <li key={entry._id} className="border-b pb-2">
                  <strong>{entry.bookId.title}</strong> — Due: {entry.dueDate}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BorrowedBooksPage;