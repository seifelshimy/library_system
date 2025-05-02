import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { bookService } from "@/services/bookService";

const BookDetailsPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBorrowing, setIsBorrowing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;

    const fetchBookDetails = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const data = await bookService.getById(id, token);
        setBook(data);
      } catch (error) {
        console.error("Error fetching book details:", error);
        setBook(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  const handleBorrowBook = async () => {
    if (!book || !book.available) return;

    setIsBorrowing(true);

    try {
      const token = localStorage.getItem("token");

      const updatedBook = {
        ...book,
        available: false,
        borrowHistory: [
          {
            borrowedBy: "Current User",
            borrowedDate: new Date().toISOString().split("T")[0],
            returnedDate: null,
          },
          ...(book.borrowHistory || []),
        ],
      };

      await bookService.update(book._id || id, updatedBook, token);
      setBook(updatedBook);

      setTimeout(() => {
        navigate("/borrowed");
      }, 1500);
    } catch (error) {
      console.error("Error borrowing book:", error);
    } finally {
      setIsBorrowing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="animate-pulse">
          <div className="h-10 w-1/3 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="md:col-span-2">
              <div className="h-10 w-3/4 bg-gray-200 rounded mb-4"></div>
              <div className="h-6 w-1/2 bg-gray-200 rounded mb-6"></div>
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Book not found</h1>
          <p className="text-gray-600 mb-6">
            The book you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <a href="/books">Back to Book Catalog</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <a href="/books" className="text-library-burgundy hover flex items-center">
          ← Back to Book Catalog
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex justify-center">
          <div className="relative">
            <img
              src={book.coverUrl || "/placeholder.svg"}
              alt={`${book.title} cover`}
              className="rounded-lg shadow-lg max-h-96 object-contain"
              onError={(e) => {
                const target = e.target;
                target.src = "/placeholder.svg";
              }}
            />
            <Badge
              className={`absolute top-2 right-2 ${
                book.available ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {book.available ? "Available" : "Borrowed"}
            </Badge>
          </div>
        </div>

        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
          <h2 className="text-xl text-gray-600 mb-4">by {book.author}</h2>

          <div className="flex flex-wrap gap-2 mb-4">
            {book.genre.map((g, index) => (
              <Badge key={index} variant="secondary">
                {g}
              </Badge>
            ))}
          </div>

          <Tabs defaultValue="info" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="info">Book Info</TabsTrigger>
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="history">Borrow History</TabsTrigger>
            </TabsList>

            <TabsContent value="info">
              <Card>
                <CardContent className="pt-6">
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                    <div>
                      <dt className="text-sm text-gray-500">Publisher</dt>
                      <dd>{book.publisher}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Published Year</dt>
                      <dd>{book.publishedYear}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">ISBN</dt>
                      <dd>{book.isbn}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Pages</dt>
                      <dd>{book.pages}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="description">
              <Card>
                <CardContent className="pt-6">
                  <p className="whitespace-pre-line">{book.description}</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardContent className="pt-6">
                  {book.borrowHistory && book.borrowHistory.length > 0 ? (
                    <div className="space-y-4">
                      {book.borrowHistory.map((record, index) => (
                        <div key={index} className="border-b pb-4 last:border-b-0">
                          <p className="font-medium">{record.borrowedBy}</p>
                          <p className="text-sm text-gray-600">
                            Borrowed: {new Date(record.borrowedDate).toLocaleDateString()}
                          </p>
                          {record.returnedDate && (
                            <p className="text-sm text-gray-600">
                              Returned: {new Date(record.returnedDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500">No borrow history available</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-6">
            <Button
              disabled={!book.available || isBorrowing}
              className="w-full sm-auto bg-library-burgundy hover:opacity-90"
              onClick={handleBorrowBook}
            >
              {isBorrowing
                ? "Processing..."
                : book.available
                ? "Borrow This Book"
                : "Currently Unavailable"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsPage;
