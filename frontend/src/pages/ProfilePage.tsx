import { Edit } from '@mui/icons-material';
import {
  Avatar,
  Button,
  IconButton,
  TextField,
} from '@mui/material';
import { useRef, useState } from 'react';

export default function ProfilePage() {
  const [fullName, setFullName] = useState('John Doe');
  const [editingName, setEditingName] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const handleNameEdit = () => {
    setEditingName(true);
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswords({ ...passwords, [field]: value });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>

      {/* Profile Image Section */}
      <div className="flex items-center gap-4 mb-6">
        <Avatar
          src={profileImage || '/default-profile.png'}
          alt="Profile"
          sx={{ width: 80, height: 80 }}
        />
        <div>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageUpload}
            hidden
          />
          <Button
            variant="outlined"
            size="small"
            onClick={() => fileInputRef.current?.click()}
          >
            Upload New Image
          </Button>
        </div>
      </div>

      {/* Full Name Section */}
      <div className="mb-6">
        {editingName ? (
          <TextField
            fullWidth
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            onBlur={() => setEditingName(false)}
            autoFocus
          />
        ) : (
          <div className="flex items-center justify-between max-w-md">
            <span className="text-lg font-medium text-gray-700">{fullName}</span>
            <IconButton onClick={handleNameEdit}>
              <Edit fontSize="small" />
            </IconButton>
          </div>
        )}
      </div>

      {/* Change Password Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Change Password</h2>
        <div className="space-y-4 max-w-md">
          <TextField
            fullWidth
            label="Current Password"
            type="password"
            value={passwords.current}
            onChange={(e) => handlePasswordChange('current', e.target.value)}
          />
          <TextField
            fullWidth
            label="New Password"
            type="password"
            value={passwords.new}
            onChange={(e) => handlePasswordChange('new', e.target.value)}
          />
          <TextField
            fullWidth
            label="Confirm New Password"
            type="password"
            value={passwords.confirm}
            onChange={(e) => handlePasswordChange('confirm', e.target.value)}
          />
          <div className="pt-2">
            <Button
              variant="contained"
              color="primary"
              className="!rounded-xl"
              disabled={
                !passwords.current || !passwords.new || passwords.new !== passwords.confirm
              }
              onClick={() => alert('Password changed (mock action)')}
            >
              Update Password
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
