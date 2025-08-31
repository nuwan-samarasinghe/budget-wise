import { AccountBalanceWallet } from '@mui/icons-material';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import type { Budget } from '../feature/budget/budgetTypes';
import type { Category } from '../feature/category/categoryTypes';

type BudgetDialogProps = {
  open: boolean;
  onClose: () => void;
  onSave: (data: Budget) => void;
  initialData?: Budget | null;
  categories: Category[];
};

export default function BudgetDialog({
  open,
  onClose,
  onSave,
  initialData = null,
  categories,
}: BudgetDialogProps) {
  const [formData, setFormData] = useState({
    id: '',
    amount: '',
    note: '',
    affectOn: '',
    budgetMonth: '',
    recurrent: false,
    fromDate: '',
    toDate: '',
    category: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id,
        amount: initialData.amount.toString(),
        note: initialData.note || '',
        affectOn: initialData.affectOn,
        budgetMonth: initialData.budgetMonth,
        recurrent: initialData.recurrent,
        fromDate: initialData.fromDate ? initialData.fromDate : '',
        toDate: initialData.toDate ? initialData.toDate : '',
        category: initialData.category,
      });
    } else {
      setFormData({
        id: '',
        amount: '',
        note: '',
        affectOn: '',
        budgetMonth: '',
        recurrent: false,
        fromDate: '',
        toDate: '',
        category: '',
      });
    }
  }, [initialData, open]);

  const handleChange = (field: string, value: string | boolean | object) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSave({
      id: formData.id,
      amount: parseFloat(formData.amount),
      note: formData.note,
      affectOn: formData.affectOn,
      budgetMonth: formData.budgetMonth,
      recurrent: formData.recurrent,
      fromDate: formData.fromDate,
      toDate: formData.toDate,
      category: formData.category,
    });
    onClose();
  };

  const isValid = formData.amount && formData.category && formData.budgetMonth;

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
            label="Note"
            fullWidth
            multiline
            rows={2}
            value={formData.note}
            onChange={(e) => handleChange('note', e.target.value)}
          />
          <TextField
            label="Affected Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={formData.affectOn}
            onChange={(e) => handleChange('affectOn', e.target.value)}
          />
          <TextField
            label="Budget Month"
            type="month"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={formData.budgetMonth}
            onChange={(e) => handleChange('budgetMonth', e.target.value)}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.recurrent}
                onChange={(e) => handleChange('recurrent', e.target.checked)}
              />
            }
            label="Recurrent"
          />

          {formData.recurrent && (
            <>
              <TextField
                label="From Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.fromDate}
                onChange={(e) => handleChange('fromDate', e.target.value)}
              />
              <TextField
                label="To Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.toDate}
                onChange={(e) => handleChange('toDate', e.target.value)}
                inputProps={{
                  min: formData.fromDate || undefined,
                }}
              />
            </>
          )}
          <TextField
            select
            label="Category"
            fullWidth
            value={formData.category}
            onChange={(e) =>
              handleChange(
                'category',
                categories.find((cat) => cat.id === e.target.value)!,
              )
            }
          >
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </TextField>
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
