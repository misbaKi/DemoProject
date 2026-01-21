import { useState, useEffect } from 'react';
import api from '../api';
import {
  Box,
  Typography,
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  Grid,
  Tooltip,
  Paper
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Science as BeakerIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as CheckCircleIcon,
  Timeline as ActivityIcon,
  Update as ClockIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';

function Trials() {
  const [trials, setTrials] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrial, setEditingTrial] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active',
    start_date: '',
    end_date: ''
  });

  const fetchTrials = async () => {
    try {
      const { data } = await api.get('/trials');
      setTrials(data);
    } catch (err) {
      toast.error('Identity verification failure: Could not sync research trials.');
    }
  };

  useEffect(() => {
    fetchTrials();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      start_date: formData.start_date || null,
      end_date: formData.end_date || null
    };

    try {
      if (editingTrial) {
        await api.put(`/trials/${editingTrial.id}`, submissionData);
        toast.success('Investigation record updated successfully.');
      } else {
        await api.post('/trials', submissionData);
        toast.success('New clinical trial protocol initialized.');
      }
      setIsModalOpen(false);
      setEditingTrial(null);
      setFormData({ name: '', description: '', status: 'active', start_date: '', end_date: '' });
      fetchTrials();
    } catch (err) {
      toast.error(err.response?.data?.error || 'System Error: Data validation failed.');
    }
  };

  const handleEdit = (trial) => {
    setEditingTrial(trial);
    setFormData({
      name: trial.name,
      description: trial.description,
      status: trial.status,
      start_date: trial.start_date ? trial.start_date.split('T')[0] : '',
      end_date: trial.end_date ? trial.end_date.split('T')[0] : ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('PROTOCOL WARNING: Permanently purge this investigation from the database?')) {
      try {
        await api.delete(`/trials/${id}`);
        toast.success('Investigation record purged.');
        fetchTrials();
      } catch (err) {
        toast.error('Deprecation Error: Cannot purge trial with active participant associations.');
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 850, color: 'text.primary', mb: 1 }}>Trials Registry</Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>Global clinical investigation protocols and tracking.</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => { setEditingTrial(null); setFormData({ name: '', description: '', status: 'active', start_date: '', end_date: '' }); setIsModalOpen(true); }}
        >
          Initialize New Trial
        </Button>
      </Box>

      <Card sx={{ border: 'none', borderRadius: 4, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary', pl: 4 }}>Investigation Identity</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Timeline</TableCell>
                <TableCell sx={{ fontWeight: 700, color: 'text.secondary', textAlign: 'right', pr: 4 }}>Operations</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {trials.map((trial) => (
                <TableRow key={trial.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ pl: 4 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a' }}>{trial.name}</Typography>
                    <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>#{trial.id.toString().padStart(4, '0')} &bull; Internal Registry</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={trial.status === 'active' ? <ActivityIcon fontSize="small" /> : trial.status === 'completed' ? <CheckCircleIcon fontSize="small" /> : <ClockIcon fontSize="small" />}
                      label={trial.status}
                      color={trial.status === 'active' ? 'primary' : trial.status === 'completed' ? 'secondary' : 'warning'}
                      size="small"
                      sx={{
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        fontSize: '0.65rem',
                        borderRadius: 2,
                        bgcolor: trial.status === 'active' ? '#e0f7ff' : trial.status === 'completed' ? '#f0f9eb' : '#fff9eb',
                        color: trial.status === 'active' ? 'primary.main' : trial.status === 'completed' ? 'secondary.main' : 'warning.main'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600, color: 'text.secondary', fontSize: '0.85rem' }}>
                      <CalendarIcon sx={{ fontSize: 16 }} />
                      {trial.start_date ? new Date(trial.start_date).toLocaleDateString() : 'N/A'}
                      <Box sx={{ color: 'divider', fontWeight: 400 }}>&rarr;</Box>
                      {trial.end_date ? new Date(trial.end_date).toLocaleDateString() : 'TBD'}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ textAlign: 'right', pr: 4 }}>
                    <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}>
                      <Tooltip title="Modify Record">
                        <IconButton
                          onClick={() => handleEdit(trial)}
                          size="small"
                          sx={{ color: 'primary.main', bgcolor: '#f0f9ff', border: '1px solid #e0f2fe', borderRadius: 2 }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Purge Record">
                        <IconButton
                          onClick={() => handleDelete(trial.id)}
                          size="small"
                          sx={{ color: 'error.main', bgcolor: '#fef2f2', border: '1px solid #fee2e2', borderRadius: 2 }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        PaperProps={{
          sx: { borderRadius: 5, p: 2, maxWidth: 600, width: '100%' }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 850 }}>{editingTrial ? 'Edit Investigation' : 'Initialize Trial'}</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>Official protocol registration for the Clinical Trial Management System.</Typography>
        </DialogTitle>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogContent sx={{ pt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', mb: 1, display: 'block' }}>Trial Protocol Name</Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="e.g. Oncology Therapeutic Study Phase II"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#f8fafc' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', mb: 1, display: 'block' }}>Investigation Scope</Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  variant="outlined"
                  placeholder="Document the primary focus and clinical boundaries..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#f8fafc' } }}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', mb: 1, display: 'block' }}>Launch Date</Typography>
                <TextField
                  fullWidth
                  type="date"
                  variant="outlined"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#f8fafc' } }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', mb: 1, display: 'block' }}>Anticipated Comp.</Typography>
                <TextField
                  fullWidth
                  type="date"
                  variant="outlined"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#f8fafc' } }}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase', mb: 1, display: 'block' }}>Registry Status</Typography>
                <TextField
                  select
                  fullWidth
                  variant="outlined"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#f8fafc' } }}
                >
                  <MenuItem value="active">Active Execution</MenuItem>
                  <MenuItem value="completed">Post-Trial Reporting</MenuItem>
                  <MenuItem value="pending">Pre-Launch Review</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2, gap: 2 }}>
            <Button fullWidth variant="text" sx={{ bgcolor: '#f1f5f9', color: '#475569', borderRadius: 3, py: 1.5 }} onClick={() => setIsModalOpen(false)}>Discard Changes</Button>
            <Button fullWidth variant="contained" type="submit" sx={{ bgcolor: 'primary.main', borderRadius: 3, py: 1.5 }}>Commit Record</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
}

export default Trials;
