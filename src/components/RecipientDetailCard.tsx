import { Button, TextField } from "@mui/material";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { useState } from "react";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit"; // Import icon chỉnh sửa

interface RecipientDetailCardProps {
  recipient: {
    _id: string;
    accountNumber: string;
    nickname: string;
    createdAt: string;
  };
  onDeleted: (accountNumber: string) => void;
  onUpdated: (updatedRecipient: {
    accountNumber: string;
    nickname: string;
  }) => void;
}

export function RecipientDetailCard({
  recipient,
  onDeleted,
  onUpdated,
}: RecipientDetailCardProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nickname: recipient.nickname,
    accountNumber: recipient.accountNumber,
  });

  const handleDelete = () => {
    onDeleted(recipient.accountNumber);
    setIsConfirmOpen(false);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    onUpdated(formData);
    handleEditToggle();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <Card className="mb-4">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">{recipient.nickname}</CardTitle>
              <CardDescription>
                Created on {format(new Date(recipient.createdAt), "PPP")}
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="contained"
                color="success"
                onClick={handleEditToggle}
              >
                <EditIcon fontSize="small" />
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => setIsConfirmOpen(true)}
              >
                <DeleteIcon fontSize="small" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <span className="font-medium">Account Number:</span>{" "}
              {recipient.accountNumber}
            </div>
            {isEditing ? (
              <div>
                <TextField
                  label="Nickname"
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleChange}
                  fullWidth
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                  sx={{ mt: 2 }}
                >
                  Save
                </Button>
              </div>
            ) : (
              <div>
                <span className="font-medium">Nickname:</span>{" "}
                {recipient.nickname}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Confirm Delete"
        message="Are you sure you want to delete this recipient?"
      />
    </>
  );
}
