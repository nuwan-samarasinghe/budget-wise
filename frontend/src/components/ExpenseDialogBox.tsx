import { MoneyOff } from '@mui/icons-material';
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
import type { BudgetRecord } from '../pages/BudgetPage';
import type { ExpenseRecord } from '../pages/ExpensePage';

type BudgetDialogProps = {
    open: boolean;
    onClose: () => void;
    onSave: (data: ExpenseRecord) => void;
    initialData?: BudgetRecord | null;
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

export default function ExpenseDialog({
    open,
    onClose,
    onSave,
    initialData = null,
}: BudgetDialogProps) {
    const [formData, setFormData] = useState({
        amount: '',
        source: '',
        category: '',
        note: '',
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                amount: initialData.amount.toString(),
                source: initialData.source,
                category: initialData.category,
                note: initialData.note || '',
            });
        } else {
            setFormData({ amount: '', source: '', category: '', note: '' });
        }
    }, [initialData, open]);

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        onSave({
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
                <MoneyOff fontSize="medium" className="text-blue-600" />
                <span className="text-lg font-medium text-gray-800">
                    {initialData ? 'Edit Expense Entry' : 'Add New Expense Entry'}
                </span>
            </DialogTitle>

            <DialogContent>
                <Stack spacing={2} pt={1}>
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
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={!isValid}
                >
                    {initialData ? 'Update' : 'Save'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
