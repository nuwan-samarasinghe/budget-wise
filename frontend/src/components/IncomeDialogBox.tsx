import { AttachMoney } from '@mui/icons-material';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import type { IncomeRecord } from '../pages/IncomePage';

type AddIncomeDialogProps = {
    open: boolean;
    onClose: () => void;
    onSave: (data: IncomeRecord) => void;
    initialData?: IncomeRecord | null; // null means add mode
};

export default function IncomeDialog({
    open,
    onClose,
    onSave,
    initialData = null,
}: AddIncomeDialogProps) {
    const [formData, setFormData] = useState({
        amount: '',
        source: '',
        salaryMonth: '',
        note: '',
    });

    // Populate fields on edit
    useEffect(() => {
        if (initialData) {
            setFormData({
                amount: initialData.amount.toString(),
                source: initialData.source,
                salaryMonth: initialData.salaryMonth,
                note: initialData.note || '',
            });
        } else {
            setFormData({ amount: '', source: '', salaryMonth: '', note: '' });
        }
    }, [initialData, open]);

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        onSave({
            amount: parseFloat(formData.amount),
            source: formData.source,
            salaryMonth: formData.salaryMonth,
            note: formData.note,
        });
        onClose();
    };

    const isValid = formData.amount && formData.source && formData.salaryMonth;

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
                        label="Salary Month"
                        type="month"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={formData.salaryMonth}
                        onChange={(e) => handleChange('salaryMonth', e.target.value)}
                    />
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
