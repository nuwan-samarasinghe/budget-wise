import { AttachMoney } from '@mui/icons-material';
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
import type { Income } from '../feature/income/incomeTypes';

type AddIncomeDialogProps = {
  open: boolean;
  onClose: () => void;
  onSave: (data: Income) => void;
  onDelete: (data: Income) => void;
  initialData?: Income | null; // null means add mode
};

export default function IncomeDialog({
  open,
  onClose,
  onSave,
  onDelete,
  initialData = null,
}: AddIncomeDialogProps) {
  const [formData, setFormData] = useState({
    id: '',
    amount: '',
    source: '',
    note: '',
    incomeMonth: '',
    incomeType: '',
    recurrent: false,
    fromDate: '',
    toDate: '',
  });

  // Populate fields on edit
  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id ? initialData.id : '',
        amount: initialData.amount.toString(),
        source: initialData.source,
        note: initialData.note || '',
        incomeMonth: initialData.incomeMonth,
        incomeType: initialData.incomeType,
        recurrent: initialData.recurrent,
        fromDate: initialData.fromDate ? initialData.fromDate : '',
        toDate: initialData.toDate ? initialData.toDate : '',
      });
    } else {
      setFormData({
        id: '',
        amount: '',
        source: '',
        note: '',
        incomeMonth: '',
        incomeType: '',
        recurrent: false,
        fromDate: '',
        toDate: '',
      });
    }
  }, [initialData, open]);

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSave({
      id: formData.id,
      amount: parseFloat(formData.amount),
      source: formData.source,
      note: formData.note,
      incomeMonth: formData.incomeMonth,
      incomeType: formData.incomeType,
      recurrent: formData.recurrent,
      fromDate: formData.fromDate,
      toDate: formData.toDate,
    });
    onClose();
  };

  const handleDelete = () => {
    onDelete({
      id: formData.id,
      amount: parseFloat(formData.amount),
      source: formData.source,
      note: formData.note,
      incomeMonth: formData.incomeMonth,
      incomeType: formData.incomeType,
      recurrent: formData.recurrent,
      fromDate: formData.fromDate,
      toDate: formData.toDate,
    });
    onClose();
  };

  const isValid =
    formData.amount &&
    formData.source &&
    formData.incomeMonth &&
    formData.incomeType &&
    formData.recurrent;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          width: { xs: '90vw', sm: '500px', md: '600px' },
          height: { xs: '90vh', sm: 'auto', md: 'auto' },
          p: 2,
          borderRadius: 3,
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
        <AttachMoney sx={{ fontSize: 24 }} />
        <span className="text-lg font-medium text-gray-800">
          {initialData ? 'Edit Income Entry' : 'Add New Income Entry'}
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
            label="Note"
            fullWidth
            multiline
            rows={2}
            value={formData.note}
            onChange={(e) => handleChange('note', e.target.value)}
          />
          <TextField
            label="Income Month"
            type="month"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={formData.incomeMonth}
            onChange={(e) => handleChange('incomeMonth', e.target.value)}
          />
          <TextField
            select
            label="Income Type"
            fullWidth
            value={formData.incomeType}
            onChange={(e) => handleChange('incomeType', e.target.value)}
          >
            <MenuItem value="SALARY">Salary</MenuItem>
            <MenuItem value="WIFE_INCOME">Wife Income</MenuItem>
          </TextField>
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
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={!isValid}>
          {initialData ? 'Update' : 'Save'}
        </Button>
        {initialData && (
          <Button variant="outlined" color="error" onClick={handleDelete}>
            Delete
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
