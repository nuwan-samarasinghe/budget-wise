import { AccountBalanceWallet } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import type { Budget } from '../feature/budget/budgetTypes';

type BudgetDialogProps = {
  open: boolean;
  onClose: () => void;
  onSave: (data: Budget) => void;
  initialData?: Budget | null;
};

const categoryOptions = [
  'Housing',
  'Food',
  'Transport',
  'Utilities',
  'Entertainment',
  'Healthcare',
  'Savings',
  'Miscellaneous',
];

export default function BudgetDialog({
  open,
  onClose,
  onSave,
  initialData = null,
}: BudgetDialogProps) {
  const [formData, setFormData] = useState({
    id: '',
    amount: '',
    source: '',
    category: '',
    note: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id,
        amount: initialData.amount.toString(),
        source: initialData.source,
        category: initialData.category,
        note: initialData.note || '',
      });
    } else {
      setFormData({ id: '', amount: '', source: '', category: '', note: '' });
    }
  }, [initialData, open]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSave({
      id: formData.id,
      amount: parseFloat(formData.amount),
      source: formData.source,
      category: formData.category,
      note: formData.note,
    });
    onClose();
  };

  const isValid = formData.amount && formData.source && formData.category;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          width: { xs: '90vw', sm: '500px', md: '600px' },
          borderRadius: 3,
          p: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          pb: 1,
        }}
      >
        <AccountBalanceWallet fontSize="medium" className="text-blue-600" />
        <span className="text-lg font-medium text-gray-800">
          {initialData ? 'Edit Budget Entry' : 'Add New Budget Entry'}
        </span>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} pt={1}>
          <input type="hidden" name="id" value={formData.id} />
          <TextField
            label="Amount"
            type="number"
            fullWidth
            value={formData.amount}
            onChange={(e) => handleChange('amount', e.target.value)}
          />
          <TextField
            label="Source"
            fullWidth
            value={formData.source}
            onChange={(e) => handleChange('source', e.target.value)}
          />
          <TextField
            select
            label="Category"
            fullWidth
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
          >
            {categoryOptions.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Note"
            fullWidth
            multiline
            rows={2}
            value={formData.note}
            onChange={(e) => handleChange('note', e.target.value)}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={!isValid}>
          {initialData ? 'Update' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
