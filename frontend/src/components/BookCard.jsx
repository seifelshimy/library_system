
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";



const BookCard = ({ id, title, author, coverUrl, available }) => {
  return (
    <Card className="book-card animate-fade-in">
      <div className="relative">
        <img 
          src={coverUrl || "/placeholder.svg"} 
          alt={`${title} cover`} 
          className="book-cover"
          onError={(e) => {
            const target = e.target;
            target.src = "/placeholder.svg";
          }}
        />
        <Badge 
          className={`absolute top-2 right-2 ${
            available ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {available ? "Available" : "Borrowed"}
        </Badge>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1 line-clamp-1">{title}</h3>
        <p className="text-sm text-muted-foreground mb-2">{author}</p>
      </CardContent>
      
      <CardFooter className="flex justify-between p-4 pt-0">
        <Button
          variant="outline"
          className="w-full"
          asChild
        >
          <a href={`/books/${id}`}>View Details</a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BookCard;
