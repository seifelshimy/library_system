
import BookCard from "./BookCard";





const BookGrid = ({ books, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm-cols-2 md-cols-3 lg-cols-4 xl-cols-5 gap-6">
        {Array(10).fill(null).map((_, index) => (
          <div key={index} className="bg-gray-100 animate-pulse h-80 rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h3 className="text-xl font-medium text-gray-500">No books found</h3>
        <p className="text-gray-400">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm-cols-2 md-cols-3 lg-cols-4 xl-cols-5 gap-6">
      {books.map((book) => (
        <BookCard key={book.id} {...book} />
      ))}
    </div>
  );
};

export default BookGrid;
