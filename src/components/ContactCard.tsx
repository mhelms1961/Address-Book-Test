import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Edit, Phone, Mail } from "lucide-react";

interface ContactCardProps {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  isFavorite?: boolean;
  avatarUrl?: string;
  onEdit?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  onClick?: (id: string) => void;
}

const ContactCard = ({
  id = "1",
  name = "John Doe",
  phone = "(555) 123-4567",
  email = "john.doe@example.com",
  isFavorite = false,
  avatarUrl,
  onEdit = () => {},
  onToggleFavorite = () => {},
  onClick = () => {},
}: ContactCardProps) => {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(id);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(id);
  };

  return (
    <Card
      className="w-full max-w-md bg-white hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onClick(id)}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12 bg-primary/10">
            <AvatarImage
              src={
                avatarUrl ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
              }
              alt={name}
            />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium truncate">{name}</h3>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className={isFavorite ? "text-yellow-500" : "text-gray-400"}
                  onClick={handleToggleFavorite}
                >
                  <Star
                    className="h-5 w-5"
                    fill={isFavorite ? "currentColor" : "none"}
                  />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleEdit}>
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mt-1 space-y-1">
              {phone && (
                <div className="flex items-center text-sm text-gray-500">
                  <Phone className="h-3.5 w-3.5 mr-1.5" />
                  <span className="truncate">{phone}</span>
                </div>
              )}
              {email && (
                <div className="flex items-center text-sm text-gray-500">
                  <Mail className="h-3.5 w-3.5 mr-1.5" />
                  <span className="truncate">{email}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactCard;
