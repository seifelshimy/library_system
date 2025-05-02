import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reservationService, bookService, memberService } from "../services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

const ReservationsPage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [updateStatus, setUpdateStatus] = useState("");
  const [updateNotes, setUpdateNotes] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch all reservations
  const {
    data: reservationsData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["reservations", statusFilter],
    queryFn: async () => {
      const params = statusFilter !== "all" ? { status: statusFilter } : {};
      return reservationService.getAll(params);
    },
  });

  // Update reservation status mutation
  const updateReservationMutation = useMutation({
    mutationFn: (data) => reservationService.update(data.id, data.updateData),
    onSuccess: () => {
      queryClient.invalidateQueries(["reservations"]);
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Reservation status updated successfully",
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update reservation",
        variant: "destructive",
      });
    },
  });

  // Handle status update
  const handleStatusUpdate = (e) => {
    e.preventDefault();
    if (!updateStatus) {
      toast({
        title: "Error",
        description: "Please select a status",
        variant: "destructive",
      });
      return;
    }

    updateReservationMutation.mutate({
      id: selectedReservation._id,
      updateData: {
        status: updateStatus,
        notes: updateNotes,
      },
    });
  };

  // Open update dialog
  const openUpdateDialog = (reservation) => {
    setSelectedReservation(reservation);
    setUpdateStatus(reservation.status);
    setUpdateNotes(reservation.notes || "");
    setIsDialogOpen(true);
  };

  // Get badge color based on status
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "Pending":
        return "warning";
      case "Fulfilled":
        return "success";
      case "Cancelled":
        return "destructive";
      case "Expired":
        return "outline";
      default:
        return "secondary";
    }
  };

  if (isLoading) {
    return <div className="container mx-auto p-6">Loading reservations...</div>;
  }

  if (isError) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-red-500">Error loading reservations: {error.message}</div>
      </div>
    );
  }

  const { reservations = [] } = reservationsData || {};

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Book Reservations</h1>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>All Reservations</CardTitle>
          <div className="mt-2">
            <TabsList>
              <TabsTrigger 
                value="all" 
                onClick={() => setStatusFilter("all")}
                className={statusFilter === "all" ? "bg-primary text-primary-foreground" : ""}
              >
                All
              </TabsTrigger>
              <TabsTrigger 
                value="pending" 
                onClick={() => setStatusFilter("Pending")}
                className={statusFilter === "Pending" ? "bg-primary text-primary-foreground" : ""}
              >
                Pending
              </TabsTrigger>
              <TabsTrigger 
                value="fulfilled" 
                onClick={() => setStatusFilter("Fulfilled")}
                className={statusFilter === "Fulfilled" ? "bg-primary text-primary-foreground" : ""}
              >
                Fulfilled
              </TabsTrigger>
              <TabsTrigger 
                value="cancelled" 
                onClick={() => setStatusFilter("Cancelled")}
                className={statusFilter === "Cancelled" ? "bg-primary text-primary-foreground" : ""}
              >
                Cancelled
              </TabsTrigger>
              <TabsTrigger 
                value="expired" 
                onClick={() => setStatusFilter("Expired")}
                className={statusFilter === "Expired" ? "bg-primary text-primary-foreground" : ""}
              >
                Expired
              </TabsTrigger>
            </TabsList>
          </div>
        </CardHeader>
        <CardContent>
          {reservations.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              No reservations found
            </div>
          ) : (
            <div className="space-y-6">
              {reservations.map((reservation) => (
                <div key={reservation._id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">
                        {reservation.bookId?.title || "Unknown Book"}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Reserved by: {reservation.memberId?.name || "Unknown Member"}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={getStatusBadgeVariant(reservation.status)}>
                          {reservation.status}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          Reserved on: {new Date(reservation.reservationDate).toLocaleDateString()}
                        </span>
                        <span className="text-xs text-gray-500">
                          Expires on: {new Date(reservation.expiryDate).toLocaleDateString()}
                        </span>
                      </div>
                      {reservation.notes && (
                        <p className="text-sm text-gray-600 mt-2">
                          Notes: {reservation.notes}
                        </p>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openUpdateDialog(reservation)}
                    >
                      Update Status
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Update Status Dialog */}
      {selectedReservation && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Reservation Status</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleStatusUpdate} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="book">Book</Label>
                <Input
                  id="book"
                  value={selectedReservation.bookId?.title || "Unknown Book"}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="member">Member</Label>
                <Input
                  id="member"
                  value={selectedReservation.memberId?.name || "Unknown Member"}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentStatus">Current Status</Label>
                <Input
                  id="currentStatus"
                  value={selectedReservation.status}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newStatus">New Status</Label>
                <Select
                  id="newStatus"
                  value={updateStatus}
                  onValueChange={setUpdateStatus}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Fulfilled">Fulfilled</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                    <SelectItem value="Expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add notes about this status change"
                  value={updateNotes}
                  onChange={(e) => setUpdateNotes(e.target.value)}
                />
              </div>
              <DialogFooter className="pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  type="button"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={updateReservationMutation.isLoading}>
                  {updateReservationMutation.isLoading ? "Updating..." : "Update Status"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ReservationsPage; 