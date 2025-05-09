import React, { useState } from "react";
import { Search } from "lucide-react";
import ContactCard from "./ContactCard";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface Contact {
  id: string;
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

interface ContactListProps {
  contacts?: Contact[];
  onContactClick?: (contact: Contact) => void;
  onEditContact?: (contact: Contact) => void;
  onToggleFavorite?: (contactId: string, isFavorite: boolean) => void;
}

const ContactList = ({
  contacts = [
    {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      phone: "(555) 123-4567",
      email: "john.doe@example.com",
      streetAddress1: "123 Main St",
      streetAddress2: "",
      city: "Anytown",
      state: "CA",
      zipCode: "12345",
      notes: "Work colleague",
      favorite: true,
    },
    {
      id: "2",
      firstName: "Jane",
      lastName: "Smith",
      phone: "(555) 987-6543",
      email: "jane.smith@example.com",
      streetAddress1: "456 Oak Ave",
      streetAddress2: "",
      city: "Somewhere",
      state: "NY",
      zipCode: "67890",
      notes: "College friend",
      favorite: false,
    },
    {
      id: "3",
      firstName: "Alex",
      lastName: "Johnson",
      phone: "(555) 456-7890",
      email: "alex.johnson@example.com",
      streetAddress1: "789 Pine Rd",
      streetAddress2: "Apt 3C",
      city: "Elsewhere",
      state: "TX",
      zipCode: "54321",
      notes: "Family friend",
      favorite: true,
    },
  ],
  onContactClick = () => {},
  onEditContact = () => {},
  onToggleFavorite = () => {},
}: ContactListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");

  // Filter contacts based on search term
  const filteredContacts = contacts.filter((contact) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      contact.firstName.toLowerCase().includes(searchLower) ||
      contact.lastName.toLowerCase().includes(searchLower) ||
      contact.email.toLowerCase().includes(searchLower) ||
      contact.phone.toLowerCase().includes(searchLower)
    );
  });

  // Sort contacts based on selected criteria
  const sortedContacts = [...filteredContacts].sort((a, b) => {
    if (sortBy === "name") {
      return (a.lastName + a.firstName).localeCompare(b.lastName + b.firstName);
    } else if (sortBy === "email") {
      return a.email.localeCompare(b.email);
    } else if (sortBy === "favorite") {
      return (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0);
    }
    return 0;
  });

  return (
    <div className="w-full bg-background p-4">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="favorite">Favorite</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {sortedContacts.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedContacts.map((contact) => (
            <ContactCard
              key={contact.id}
              id={contact.id}
              name={`${contact.firstName} ${contact.lastName}`}
              phone={contact.phone}
              email={contact.email}
              isFavorite={contact.favorite}
              onClick={() => onContactClick(contact)}
              onEdit={() => onEditContact(contact)}
              onToggleFavorite={() =>
                onToggleFavorite(contact.id, !contact.favorite)
              }
            />
          ))}
        </div>
      ) : (
        <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
          <p className="text-center text-muted-foreground">
            {searchTerm
              ? "No contacts found matching your search"
              : "No contacts yet. Add your first contact!"}
          </p>
        </div>
      )}
    </div>
  );
};

export default ContactList;
