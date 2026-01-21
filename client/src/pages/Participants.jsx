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
    Avatar,
    Paper
} from '@mui/material';
import {
    PersonAdd as PersonAddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    AddCircleOutline as PlusIcon,
    CalendarToday as CalendarIcon,
    AssignmentTurnedIn as ClipboardIcon,
    People as PeopleIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';

function Participants() {
    const [participants, setParticipants] = useState([]);
    const [trials, setTrials] = useState([]);
    const [showEnrollModal, setShowEnrollModal] = useState(false);
    const [showActivityModal, setShowActivityModal] = useState(false);
    const [selectedParticipant, setSelectedParticipant] = useState(null);
    const [editingParticipant, setEditingParticipant] = useState(null);

    const [enrollData, setEnrollData] = useState({
        participant_name: '',
        trial_id: '',
        enrollment_date: new Date().toISOString().split('T')[0],
        status: 'enrolled'
    });
    const [activityData, setActivityData] = useState({ activity_type: '', notes: '' });

    const fetchData = async () => {
        try {
            const [pRes, tRes] = await Promise.all([
                api.get('/participants'),
                api.get('/trials')
            ]);
            setParticipants(pRes.data);
            setTrials(tRes.data);
        } catch (err) {
            toast.error('Sync Error: Failed to retrieve participant registry data.');
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleEnrollSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingParticipant) {
                await api.put(`/participants/${editingParticipant.id}`, enrollData);
                toast.success('Subject profiling updated successfully.');
            } else {
                await api.post('/participants/enroll', enrollData);
                toast.success('Clinical subject has been successfully enrolled.');
            }
            setShowEnrollModal(false);
            setEditingParticipant(null);
            setEnrollData({
                participant_name: '',
                trial_id: '',
                enrollment_date: new Date().toISOString().split('T')[0],
                status: 'enrolled'
            });
            fetchData();
        } catch (err) {
            toast.error('Registry Error: Could not process subject documentation.');
        }
    };

    const handleEdit = (p) => {
        setEditingParticipant(p);
        setEnrollData({
            participant_name: p.participant_name,
            trial_id: p.trial_id,
            enrollment_date: p.enrollment_date ? p.enrollment_date.split('T')[0] : '',
            status: p.status
        });
        setShowEnrollModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('SECURITY WARNING: Permanently purge this subject and all associated clinical logs?')) {
            try {
                await api.delete(`/participants/${id}`);
                toast.success('Subject record purged from system.');
                fetchData();
            } catch (err) {
                toast.error('Purge failure: Internal data integrity error.');
            }
        }
    };

    const handleAddActivity = async (e) => {
        e.preventDefault();
        try {
            await api.post('/participants/activity', { ...activityData, participant_id: selectedParticipant.id });
            setShowActivityModal(false);
            setActivityData({ activity_type: '', notes: '' });
            toast.success('Observation activity logged successfully.');
            fetchData();
        } catch (err) {
            toast.error('Logging Error: Record rejected by verification engine.');
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 850, color: 'text.primary', mb: 1 }}>Subject Monitoring Hub</Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>Track research candidates and clinical activity across active trials.</Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<PersonAddIcon />}
                    onClick={() => { setEditingParticipant(null); setEnrollData({ participant_name: '', trial_id: '', enrollment_date: new Date().toISOString().split('T')[0], status: 'enrolled' }); setShowEnrollModal(true); }}
                >
                    Enroll Research Subject
                </Button>
            </Box>

            <Card sx={{ border: 'none', borderRadius: 4, overflow: 'hidden' }}>
                <TableContainer>
                    <Table>
                        <TableHead sx={{ bgcolor: '#f8fafc' }}>
                            <TableRow>
                                <TableCell sx={{ pl: 4, fontWeight: 700, color: 'text.secondary' }}>Subject Name</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Assigned Trial</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Enrollment Date</TableCell>
                                <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>Status</TableCell>
                                <TableCell sx={{ textAlign: 'right', pr: 4, fontWeight: 700, color: 'text.secondary' }}>Operations</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {participants.map((p) => (
                                <TableRow key={p.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell sx={{ pl: 4 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar sx={{ bgcolor: 'primary.main', fontWeight: 700, fontSize: '0.9rem' }}>
                                                {p.participant_name.charAt(0)}
                                            </Avatar>
                                            <Box>
                                                <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>{p.participant_name}</Typography>
                                                <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>SUB-{p.id.toString().padStart(5, '0')}</Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.primary', fontWeight: 600 }}>
                                            <Box sx={{ width: 8, height: 8, borderRadius: '2px', bgcolor: 'primary.main' }} />
                                            {p.trial_name}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', fontSize: '0.85rem' }}>
                                            <CalendarIcon fontSize="small" />
                                            {new Date(p.enrollment_date).toLocaleDateString()}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={p.status}
                                            color={p.status === 'enrolled' ? 'primary' : p.status === 'completed' ? 'secondary' : 'error'}
                                            size="small"
                                            sx={{
                                                fontWeight: 800,
                                                textTransform: 'uppercase',
                                                fontSize: '0.65rem',
                                                borderRadius: 2,
                                                bgcolor: p.status === 'enrolled' ? '#e0f7ff' : p.status === 'completed' ? '#f0f9eb' : '#fef2f2',
                                                color: p.status === 'enrolled' ? 'primary.main' : p.status === 'completed' ? 'secondary.main' : 'error.main'
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ textAlign: 'right', pr: 4 }}>
                                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                           
                                            <Tooltip title="Modify Record">
                                                <IconButton
                                                    onClick={() => handleEdit(p)}
                                                    size="small"
                                                    sx={{ color: '#475569', bgcolor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 2 }}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Purge Record">
                                                <IconButton
                                                    onClick={() => handleDelete(p.id)}
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

            <Dialog open={showEnrollModal} onClose={() => setShowEnrollModal(false)} PaperProps={{ sx: { borderRadius: 5, p: 2, maxWidth: 600, width: '100%' } }}>
                <DialogTitle>
                    <Typography variant="h5" sx={{ fontWeight: 850 }}>{editingParticipant ? 'Modify Subject' : 'New Subject Registry'}</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>Official enrollment protocol for clinical candidates.</Typography>
                </DialogTitle>
                <Box component="form" onSubmit={handleEnrollSubmit}>
                    <DialogContent>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', mb: 1, display: 'block' }}>Subject Legal Name</Typography>
                                <TextField fullWidth variant="outlined" value={enrollData.participant_name} onChange={(e) => setEnrollData({ ...enrollData, participant_name: e.target.value })} placeholder="e.g. Elena Santiago" required sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#f8fafc' } }} />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', mb: 1, display: 'block' }}>Trial Allocation</Typography>
                                <TextField select fullWidth variant="outlined" value={enrollData.trial_id} onChange={(e) => setEnrollData({ ...enrollData, trial_id: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#f8fafc' } }}>
                                    <MenuItem value="">-- Select Trial --</MenuItem>
                                    {trials.map(t => <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>)}
                                </TextField>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', mb: 1, display: 'block' }}>Activation Date</Typography>
                                <TextField fullWidth type="date" variant="outlined" value={enrollData.enrollment_date} onChange={(e) => setEnrollData({ ...enrollData, enrollment_date: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#f8fafc' } }} InputLabelProps={{ shrink: true }} />
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', mb: 1, display: 'block' }}>Research Status</Typography>
                                <TextField select fullWidth variant="outlined" value={enrollData.status} onChange={(e) => setEnrollData({ ...enrollData, status: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#f8fafc' } }}>
                                    <MenuItem value="enrolled">Enrolled</MenuItem>
                                    <MenuItem value="completed">Completed</MenuItem>
                                    <MenuItem value="withdrawn">Withdrawn</MenuItem>
                                </TextField>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 2, gap: 2 }}>
                        <Button fullWidth variant="text" sx={{ bgcolor: '#f1f5f9', color: '#475569', borderRadius: 3, py: 1.5 }} onClick={() => setShowEnrollModal(false)}>Discard</Button>
                        <Button fullWidth variant="contained" type="submit" sx={{ py: 1.5, borderRadius: 3 }}>{editingParticipant ? 'Update Record' : 'Activate Enrollment'}</Button>
                    </DialogActions>
                </Box>
            </Dialog>

            <Dialog open={showActivityModal} onClose={() => setShowActivityModal(false)} PaperProps={{ sx: { borderRadius: 5, p: 2, maxWidth: 600, width: '100%' } }}>
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Box sx={{ p: 1, bgcolor: '#f0f9ff', borderRadius: 2, color: 'primary.main', display: 'flex' }}><ClipboardIcon /></Box>
                        <Typography variant="h5" sx={{ fontWeight: 850 }}>Log Clinical Visit</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>Recording observations for: <strong>{selectedParticipant?.participant_name}</strong></Typography>
                </DialogTitle>
                <Box component="form" onSubmit={handleAddActivity}>
                    <DialogContent>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', mb: 1, display: 'block' }}>Observation Category</Typography>
                                <TextField fullWidth variant="outlined" placeholder="e.g. Phase 2 Follow-up Screening" value={activityData.activity_type} onChange={(e) => setActivityData({ ...activityData, activity_type: e.target.value })} required sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#f8fafc' } }} />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', mb: 1, display: 'block' }}>Clinical Findings</Typography>
                                <TextField fullWidth multiline rows={4} variant="outlined" placeholder="Detailed outcomes and experimental results..." value={activityData.notes} onChange={(e) => setActivityData({ ...activityData, notes: e.target.value })} sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#f8fafc' } }} />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ px: 3, pb: 2, gap: 2 }}>
                        <Button fullWidth variant="text" sx={{ bgcolor: '#f1f5f9', color: '#475569', borderRadius: 3, py: 1.5 }} onClick={() => setShowActivityModal(false)}>Close Log</Button>
                        <Button fullWidth variant="contained" type="submit" sx={{ py: 1.5, borderRadius: 3 }}>Commit Log Entry</Button>
                    </DialogActions>
                </Box>
            </Dialog>
        </Box>
    );
}

export default Participants;
