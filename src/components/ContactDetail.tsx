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
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    streetAddress1?: string;
    streetAddress2?: string;
    city?: string;
    state?: string;
    zipCode?: string;
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
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "(555) 123-4567",
    streetAddress1: "123 Main St",
    streetAddress2: "",
    city: "Anytown",
    state: "CA",
    zipCode: "12345",
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
  const getInitials = (firstName: string, lastName: string) => {
    return (firstName[0] || "") + (lastName[0] || "").toUpperCase();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] bg-background rounded-xl p-0 overflow-hidden">
        <DialogHeader className="p-6 bg-primary/5">
          <DialogTitle className="text-2xl font-bold">
            Contact Details
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col md:flex-row gap-6 p-6">
          {/* Contact Avatar and Quick Actions */}
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-32 w-32 border-4 border-primary/10 shadow-soft">
              {contact.avatarUrl ? (
                <AvatarImage
                  src={contact.avatarUrl}
                  alt={`${contact.firstName} ${contact.lastName}`}
                />
              ) : (
                <AvatarFallback className="text-3xl bg-primary/10 text-primary">
                  {getInitials(contact.firstName, contact.lastName)}
                </AvatarFallback>
              )}
            </Avatar>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onToggleFavorite(contact.id)}
                className={
                  contact.favorite ? "text-amber-500 border-amber-200" : ""
                }
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
                className="text-destructive border-destructive/20"
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
          <Card className="flex-1 border-none shadow-none bg-transparent">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-2xl flex items-center gap-2">
                {contact.firstName} {contact.lastName}
                {contact.favorite && (
                  <Badge
                    variant="secondary"
                    className="ml-2 bg-amber-100 text-amber-800 hover:bg-amber-200"
                  >
                    <Heart
                      className="h-3 w-3 mr-1 text-amber-500"
                      fill="currentColor"
                    />
                    Favorite
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 space-y-5">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                  <Phone className="h-5 w-5 text-primary" />
                  <span className="font-medium">{contact.phone}</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                  <Mail className="h-5 w-5 text-primary" />
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-primary font-medium hover:underline"
                  >
                    {contact.email}
                  </a>
                </div>
                {(contact.streetAddress1 ||
                  contact.city ||
                  contact.state ||
                  contact.zipCode) && (
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div className="flex flex-col">
                      {contact.streetAddress1 && (
                        <span>{contact.streetAddress1}</span>
                      )}
                      {contact.streetAddress2 && (
                        <span>{contact.streetAddress2}</span>
                      )}
                      <span>
                        {[contact.city, contact.state, contact.zipCode]
                          .filter(Boolean)
                          .join(", ")}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {contact.notes && (
                <>
                  <Separator className="my-4" />
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <h3 className="font-medium mb-2 text-primary">Notes</h3>
                    <p className="text-muted-foreground">{contact.notes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end p-6 pt-0">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactDetail;
