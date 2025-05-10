import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Edit, Phone, Mail, MapPin } from "lucide-react";

interface ContactCardProps {
  id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  streetAddress1?: string;
  streetAddress2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  isFavorite?: boolean;
  onEdit?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  onClick?: (id: string) => void;
}

const ContactCard = ({
  id,
  name,
  firstName,
  lastName,
  phone,
  email,
  streetAddress1 = "",
  streetAddress2 = "",
  city = "",
  state = "",
  zipCode = "",
  isFavorite = false,
  onEdit = () => {},
  onToggleFavorite = () => {},
  onClick = () => {},
}: ContactCardProps) => {
  // Use name prop if provided, otherwise construct from firstName and lastName
  const fullName = name || `${firstName || ""} ${lastName || ""}`;

  // Get initials from name or firstName/lastName
  let initials = "";
  if (name) {
    const nameParts = name.split(" ");
    initials = (nameParts[0]?.[0] || "") + (nameParts[1]?.[0] || "");
  } else {
    initials = (firstName?.[0] || "") + (lastName?.[0] || "");
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(id);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(id);
  };

  const hasAddress =
    streetAddress1 || streetAddress2 || city || state || zipCode;

  return (
    <Card
      className="w-full max-w-md bg-white hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onClick(id)}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium truncate">{fullName}</h3>
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
              {hasAddress && (
                <div className="flex items-start text-sm text-gray-500">
                  <MapPin className="h-3.5 w-3.5 mr-1.5 mt-0.5" />
                  <div className="truncate">
                    {streetAddress1 && <div>{streetAddress1}</div>}
                    {streetAddress2 && <div>{streetAddress2}</div>}
                    <div>
                      {[city, state, zipCode].filter(Boolean).join(", ")}
                    </div>
                  </div>
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
