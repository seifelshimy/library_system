import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { memberService, borrowService } from "../services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

const MemberDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");

  // Fetch member details
  const {
    data: member,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["member", id],
    queryFn: () => memberService.getById(id),
  });

  // Fetch borrowed books for this member
  const {
    data: borrowedBooks,
    isLoading: isLoadingBorrowedBooks,
  } = useQuery({
    queryKey: ["memberBorrowedBooks", id],
    queryFn: () => memberService.getBorrowedBooks(id),
    enabled: !!id,
  });

  // Update member mutation
  const updateMemberMutation = useMutation({
    mutationFn: (data) => memberService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["member", id]);
      toast({
        title: "Success",
        description: "Member updated successfully",
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update member",
        variant: "destructive",
      });
    },
  });

  // Pay fine mutation
  const payFineMutation = useMutation({
    mutationFn: (data) => memberService.payFine(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["member", id]);
      setIsPaymentDialogOpen(false);
      setPaymentAmount("");
      setPaymentNotes("");
      toast({
        title: "Success",
        description: "Payment processed successfully",
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to process payment",
        variant: "destructive",
      });
    },
  });

  // Handle payment submission
  const handlePayment = (e) => {
    e.preventDefault();
    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid payment amount",
        variant: "destructive",
      });
      return;
    }

    payFineMutation.mutate({
      amount: parseFloat(paymentAmount),
      notes: paymentNotes,
    });
  };

  // Return a book
  const returnBookMutation = useMutation({
    mutationFn: (borrowId) => borrowService.returnBook(borrowId, {}),
    onSuccess: () => {
      queryClient.invalidateQueries(["memberBorrowedBooks", id]);
      queryClient.invalidateQueries(["member", id]);
      toast({
        title: "Success",
        description: "Book returned successfully",
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to return book",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return <div className="container mx-auto p-6">Loading member details...</div>;
  }

  if (isError) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-red-500">Error loading member: {error.message}</div>
        <Button onClick={() => navigate("/members")} className="mt-4">
          Back to Members
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">{member.name}</h1>
        <div className="flex gap-2">
          {member.fines > 0 && (
            <Button onClick={() => setIsPaymentDialogOpen(true)} variant="secondary">
              Pay Fine
            </Button>
          )}
          <Button onClick={() => navigate("/members")}>Back to Members</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Member Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Membership ID</Label>
                <div className="mt-1">{member.membershipId}</div>
              </div>
              <div>
                <Label className="text-sm font-medium">Membership Type</Label>
                <div className="mt-1">
                  <Badge variant="outline">{member.membershipType}</Badge>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Membership Status</Label>
                <div className="mt-1">
                  <Badge
                    variant={member.status === "Active" ? "success" : "destructive"}
                  >
                    {member.status}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Expiry Date</Label>
                <div className="mt-1">
                  {new Date(member.expiryDate).toLocaleDateString()}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Joined Date</Label>
                <div className="mt-1">
                  {new Date(member.joinedDate).toLocaleDateString()}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Outstanding Fines</Label>
                <div className="mt-1 font-semibold">
                  {member.fines > 0 ? (
                    <span className="text-red-500">${member.fines.toFixed(2)}</span>
                  ) : (
                    <span className="text-green-500">$0.00</span>
                  )}
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Email</Label>
              <div className="mt-1">{member.email}</div>
            </div>
            <div>
              <Label className="text-sm font-medium">Phone</Label>
              <div className="mt-1">{member.phone}</div>
            </div>
            <div>
              <Label className="text-sm font-medium">Address</Label>
              <div className="mt-1">{member.address}</div>
            </div>
            {member.notes && (
              <div>
                <Label className="text-sm font-medium">Notes</Label>
                <div className="mt-1 text-gray-600">{member.notes}</div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Borrowed Books</CardTitle>
              <CardDescription>
                Currently borrowed books by this member
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingBorrowedBooks ? (
                <div>Loading borrowed books...</div>
              ) : borrowedBooks?.length > 0 ? (
                <div className="space-y-4">
                  {borrowedBooks.map((borrowing) => (
                    <div
                      key={borrowing._id}
                      className="flex justify-between items-center border-b pb-3"
                    >
                      <div>
                        <div className="font-medium">
                          {borrowing.bookId.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          Due: {new Date(borrowing.dueDate).toLocaleDateString()}
                        </div>
                        <Badge
                          variant={
                            new Date(borrowing.dueDate) < new Date()
                              ? "destructive"
                              : "outline"
                          }
                          className="mt-1"
                        >
                          {new Date(borrowing.dueDate) < new Date()
                            ? "Overdue"
                            : "Borrowed"}
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => returnBookMutation.mutate(borrowing._id)}
                        disabled={returnBookMutation.isLoading}
                      >
                        Return
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 py-3">No books currently borrowed</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process Fine Payment</DialogTitle>
          </DialogHeader>
          <form onSubmit={handlePayment} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="outstandingFine">Outstanding Fine</Label>
              <Input
                id="outstandingFine"
                value={`$${member.fines.toFixed(2)}`}
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentAmount">Payment Amount</Label>
              <Input
                id="paymentAmount"
                type="number"
                step="0.01"
                min="0.01"
                max={member.fines}
                placeholder="Enter amount"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentNotes">Payment Notes</Label>
              <Textarea
                id="paymentNotes"
                placeholder="Optional notes"
                value={paymentNotes}
                onChange={(e) => setPaymentNotes(e.target.value)}
              />
            </div>
            <DialogFooter className="pt-4">
              <Button
                variant="outline"
                onClick={() => setIsPaymentDialogOpen(false)}
                type="button"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={payFineMutation.isLoading}>
                {payFineMutation.isLoading ? "Processing..." : "Process Payment"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MemberDetailsPage; 