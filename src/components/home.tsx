import React, { useState, useRef } from "react";
import { PlusCircle, Search, Download, Upload } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import ContactList from "./ContactList";
import ContactForm from "./ContactForm";
import ContactDetail from "./ContactDetail";

interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  address?: string;
  notes?: string;
  favorite: boolean;
  avatarUrl?: string;
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  // Mock data for initial display
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: "1",
      name: "John Doe",
      phone: "(555) 123-4567",
      email: "john.doe@example.com",
      address: "123 Main St, Anytown, USA",
      notes: "Work colleague",
      favorite: true,
      avatarUrl: "",
    },
    {
      id: "2",
      name: "Jane Smith",
      phone: "(555) 987-6543",
      email: "jane.smith@example.com",
      address: "456 Oak Ave, Somewhere, USA",
      notes: "College friend",
      favorite: false,
      avatarUrl: "",
    },
    {
      id: "3",
      name: "Alex Johnson",
      phone: "(555) 456-7890",
      email: "alex.johnson@example.com",
      address: "789 Pine Rd, Elsewhere, USA",
      notes: "Family doctor",
      favorite: true,
      avatarUrl: "",
    },
  ]);

  const handleAddContact = (newContact: Omit<Contact, "id">) => {
    const contact = {
      ...newContact,
      id: Date.now().toString(),
    };
    setContacts([...contacts, contact]);
    setIsAddDialogOpen(false);
  };

  const handleEditContact = (updatedContact: Contact) => {
    setContacts(
      contacts.map((contact) =>
        contact.id === updatedContact.id ? updatedContact : contact,
      ),
    );
    setIsEditDialogOpen(false);
    setSelectedContact(null);
  };

  const handleToggleFavorite = (id: string) => {
    setContacts(
      contacts.map((contact) =>
        contact.id === id
          ? { ...contact, favorite: !contact.favorite }
          : contact,
      ),
    );
  };

  const handleViewContact = (contact: Contact) => {
    setSelectedContact(contact);
    setIsDetailDialogOpen(true);
  };

  const handleEditClick = (contact: Contact) => {
    setSelectedContact(contact);
    setIsEditDialogOpen(true);
  };

  const handleDeleteContact = (id: string) => {
    setContacts(contacts.filter((contact) => contact.id !== id));
    setIsDetailDialogOpen(false);
    setSelectedContact(null);
  };

  const handleExportContacts = () => {
    import("xlsx").then((XLSX) => {
      import("file-saver").then((FileSaver) => {
        // Prepare data for export
        const exportData = contacts.map((contact) => ({
          Name: contact.name,
          Phone: contact.phone,
          Email: contact.email,
          Address: contact.address || "",
          Notes: contact.notes || "",
          Favorite: contact.favorite ? "Yes" : "No",
          AvatarUrl: contact.avatarUrl || "",
        }));

        // Create worksheet
        const ws = XLSX.utils.json_to_sheet(exportData);

        // Create workbook
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Contacts");

        // Generate Excel file and save
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], {
          type: "application/octet-stream",
        });
        FileSaver.saveAs(data, "contacts.xlsx");
      });
    });
  };

  const handleImportContacts = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      import("xlsx").then((XLSX) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });

          // Get first worksheet
          const worksheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[worksheetName];

          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          // Process and add contacts
          const newContacts = jsonData.map((row) => ({
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            name: row.Name || "",
            phone: row.Phone || "",
            email: row.Email || "",
            address: row.Address || "",
            notes: row.Notes || "",
            favorite: row.Favorite === "Yes",
            avatarUrl: row.AvatarUrl || "",
          }));

          setContacts([...contacts, ...newContacts]);
          event.target.value = null; // Reset file input
        } catch (error) {
          console.error("Error importing contacts:", error);
          alert("Failed to import contacts. Please check the file format.");
        }
      });
    };
    reader.readAsArrayBuffer(file);
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.includes(searchTerm),
  );

  const sortedContacts = [...filteredContacts].sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    } else if (sortBy === "email") {
      return a.email.localeCompare(b.email);
    } else if (sortBy === "favorite") {
      return (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0);
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-background p-6">
      <header className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Address Book</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportContacts}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button
              variant="outline"
              onClick={() => document.getElementById("file-upload").click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Import
            </Button>
            <input
              id="file-upload"
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={handleImportContacts}
            />
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Contact
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="w-full sm:w-48">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="favorite">Favorites</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <main>
        <ContactList
          contacts={sortedContacts}
          onToggleFavorite={handleToggleFavorite}
          onContactClick={handleViewContact}
          onEditContact={handleEditClick}
        />
      </main>

      {/* Add Contact Dialog */}
      <ContactForm
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAddContact}
        title="Add New Contact"
      />

      {/* Edit Contact Dialog */}
      {selectedContact && (
        <ContactForm
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onSubmit={handleEditContact}
          initialData={selectedContact}
          title="Edit Contact"
        />
      )}

      {/* Contact Detail Dialog */}
      {selectedContact && (
        <ContactDetail
          contact={selectedContact}
          isOpen={isDetailDialogOpen}
          onClose={() => setIsDetailDialogOpen(false)}
          onEdit={() => {
            setIsDetailDialogOpen(false);
            setIsEditDialogOpen(true);
          }}
          onDelete={() => handleDeleteContact(selectedContact.id)}
          onToggleFavorite={() => handleToggleFavorite(selectedContact.id)}
        />
      )}
    </div>
  );
}
