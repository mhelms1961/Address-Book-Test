import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Heart, Mail, Phone, MapPin, Edit, Trash2, Star } from "lucide-react";

interface ContactDetailProps {
  contact?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address?: string;
    notes?: string;
    favorite?: boolean;
    avatarUrl?: string;
  };
  isOpen?: boolean;
  onClose?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
}

const ContactDetail = ({
  contact = {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "(555) 123-4567",
    address: "123 Main St, Anytown, USA 12345",
    notes: "Met at the conference last year. Works in software development.",
    favorite: true,
  },
  isOpen = true,
  onClose = () => {},
  onEdit = () => {},
  onDelete = () => {},
  onToggleFavorite = () => {},
}: ContactDetailProps) => {
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] bg-background">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Contact Details
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col md:flex-row gap-6 py-4">
          {/* Contact Avatar and Quick Actions */}
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-32 w-32">
              {contact.avatarUrl ? (
                <AvatarImage src={contact.avatarUrl} alt={contact.name} />
              ) : (
                <AvatarFallback className="text-3xl">
                  {getInitials(contact.name)}
                </AvatarFallback>
              )}
            </Avatar>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onToggleFavorite(contact.id)}
                className={contact.favorite ? "text-yellow-500" : ""}
              >
                {contact.favorite ? <Star fill="currentColor" /> : <Star />}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onEdit(contact.id)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="text-destructive"
                onClick={() => {
                  if (
                    confirm("Are you sure you want to delete this contact?")
                  ) {
                    onDelete(contact.id);
                  }
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Contact Information */}
          <Card className="flex-1 border-none shadow-none">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-2xl flex items-center gap-2">
                {contact.name}
                {contact.favorite && (
                  <Badge variant="secondary" className="ml-2">
                    <Heart
                      className="h-3 w-3 mr-1 text-red-500"
                      fill="currentColor"
                    />
                    Favorite
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{contact.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-primary hover:underline"
                  >
                    {contact.email}
                  </a>
                </div>
                {contact.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                    <span>{contact.address}</span>
                  </div>
                )}
              </div>

              {contact.notes && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-medium mb-2">Notes</h3>
                    <p className="text-muted-foreground">{contact.notes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactDetail;
