import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Check, X, ChevronLeft, ChevronRight } from "lucide-react";

interface Contact {
  id?: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  streetAddress1?: string;
  streetAddress2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  notes?: string;
  favorite: boolean;
}

interface ImportPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  contacts: Contact[];
  onConfirmImport: (contacts: Contact[]) => void;
  duplicatesCount: number;
}

const ImportPreview = ({
  isOpen,
  onClose,
  contacts,
  onConfirmImport,
  duplicatesCount,
}: ImportPreviewProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>(contacts);

  // Get initials for avatar fallback
  const getInitials = (firstName: string, lastName: string) => {
    return (firstName[0] || "") + (lastName[0] || "").toUpperCase();
  };

  const handleToggleContact = (contact: Contact) => {
    if (selectedContacts.includes(contact)) {
      setSelectedContacts(selectedContacts.filter((c) => c !== contact));
    } else {
      setSelectedContacts([...selectedContacts, contact]);
    }
  };

  const handleConfirmImport = () => {
    onConfirmImport(selectedContacts);
    onClose();
  };

  const handlePrevious = () => {
    setCurrentIndex(Math.max(0, currentIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex(Math.min(contacts.length - 1, currentIndex + 1));
  };

  if (contacts.length === 0) return null;

  const currentContact = contacts[currentIndex];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] bg-background">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex justify-between items-center">
            <span>Import Preview</span>
            <Badge variant="outline" className="ml-2">
              {contacts.length} new contacts found
            </Badge>
          </DialogTitle>
          {duplicatesCount > 0 && (
            <p className="text-sm text-muted-foreground">
              {duplicatesCount} duplicate contacts were skipped
            </p>
          )}
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* Navigation controls */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Contact {currentIndex + 1} of {contacts.length}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={currentIndex === contacts.length - 1}
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          {/* Current contact preview */}
          <div className="flex flex-col md:flex-row gap-6 py-4">
            {/* Contact Avatar */}
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="text-2xl">
                  {getInitials(
                    currentContact.firstName,
                    currentContact.lastName,
                  )}
                </AvatarFallback>
              </Avatar>

              <Button
                variant={
                  selectedContacts.includes(currentContact)
                    ? "default"
                    : "outline"
                }
                size="sm"
                onClick={() => handleToggleContact(currentContact)}
                className={
                  selectedContacts.includes(currentContact)
                    ? ""
                    : "border-dashed"
                }
              >
                {selectedContacts.includes(currentContact) ? (
                  <>
                    <Check className="h-4 w-4 mr-2" /> Selected
                  </>
                ) : (
                  "Select"
                )}
              </Button>
            </div>

            {/* Contact Information */}
            <ScrollArea className="flex-1 max-h-[400px]">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    {currentContact.firstName} {currentContact.lastName}
                  </h3>
                </div>

                <div className="space-y-2">
                  {currentContact.phone && (
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">
                        Phone
                      </span>
                      <span>{currentContact.phone}</span>
                    </div>
                  )}

                  {currentContact.email && (
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">
                        Email
                      </span>
                      <span>{currentContact.email}</span>
                    </div>
                  )}

                  {(currentContact.streetAddress1 ||
                    currentContact.city ||
                    currentContact.state ||
                    currentContact.zipCode) && (
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">
                        Address
                      </span>
                      <div className="flex flex-col">
                        {currentContact.streetAddress1 && (
                          <span>{currentContact.streetAddress1}</span>
                        )}
                        {currentContact.streetAddress2 && (
                          <span>{currentContact.streetAddress2}</span>
                        )}
                        <span>
                          {[
                            currentContact.city,
                            currentContact.state,
                            currentContact.zipCode,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </span>
                      </div>
                    </div>
                  )}

                  {currentContact.notes && (
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">
                        Notes
                      </span>
                      <span>{currentContact.notes}</span>
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>
          </div>

          <Separator />

          {/* Contact list preview */}
          <div>
            <h3 className="text-sm font-medium mb-2">
              All Contacts ({contacts.length})
            </h3>
            <ScrollArea className="h-[120px]">
              <div className="space-y-1">
                {contacts.map((contact, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${currentIndex === index ? "bg-muted" : "hover:bg-muted/50"}`}
                    onClick={() => setCurrentIndex(index)}
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {getInitials(contact.firstName, contact.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <span>
                        {contact.firstName} {contact.lastName}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleContact(contact);
                      }}
                    >
                      {selectedContacts.includes(contact) ? (
                        <Check className="h-4 w-4 text-primary" />
                      ) : (
                        <X className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {selectedContacts.length} of {contacts.length} contacts selected
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmImport}
              disabled={selectedContacts.length === 0}
            >
              Import Selected
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportPreview;
