import { useState, useEffect } from 'react';
import api from '../api';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  FileDownload as DownloadIcon,
  Assessment as ReportsIcon,
  Timeline as TimelineIcon,
  QueryStats as StatsIcon,
  Description as DocIcon
} from '@mui/icons-material';
import * as XLSX from 'xlsx';
import { toast } from 'react-toastify';

function Reports() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get('/reports/summary');
        setStats(data);
      } catch (err) {
        toast.error('Failed to load report data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const downloadExcel = async () => {
    try {
      const { data } = await api.get('/reports/export');
      const wb = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data.trials), "Trials Registry");
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data.participants), "Subject Registry");
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data.activities), "Clinical Activities");

      XLSX.writeFile(wb, `Bayer_CTMS_GlobalReport_${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success("Comprehensive report generated and downloaded.");
    } catch (err) {
      toast.error("Generation failure: Export engine synchronization error.");
    }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
      <CircularProgress color="primary" />
    </Box>
  );

  const completionRate = ((stats.statusStats.find(s => s.status === 'completed')?.count / stats.summary.trials) * 100 || 0).toFixed(1);
  const avgActivities = (stats.summary.activities / stats.summary.participants || 0).toFixed(1);
  const activeCount = stats.statusStats.find(s => s.status === 'active')?.count || 0;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 850, color: 'text.primary', mb: 1 }}>Analytical Reports</Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>Executive summaries and clinical data exports.</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={downloadExcel}
          sx={{ px: 4, py: 1.5 }}
        >
          Export Master Dataset
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <TimelineIcon color="primary" fontSize="small" />
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase' }}>Protocol Completion Rate</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 900 }}>{completionRate}%</Typography>
              <Typography sx={{ color: 'text.secondary', fontSize: '0.75rem', mt: 1 }}>Percentage of trials successfully finalized.</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <StatsIcon color="secondary" fontSize="small" />
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase' }}>Data Density / Subject</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 900 }}>{avgActivities}</Typography>
              <Typography sx={{ color: 'text.secondary', fontSize: '0.75rem', mt: 1 }}>Average clinical observations per candidate.</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <DocIcon sx={{ color: '#003359' }} fontSize="small" />
                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', textTransform: 'uppercase' }}>In-Execution Protocols</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 900, color: 'primary.main' }}>{activeCount}</Typography>
              <Typography sx={{ color: 'text.secondary', fontSize: '0.75rem', mt: 1 }}>Current investigations active in the field.</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ border: 'none', borderRadius: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 850, mb: 3 }}>Operational Audit Summary</Typography>
          <TableContainer component={Paper} elevation={0} variant="outlined" sx={{ borderRadius: 3 }}>
            <Table>
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase' }}>Audit Category</TableCell>
                  <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase' }}>Recorded Count</TableCell>
                  <TableCell sx={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase' }}>Registry Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stats.statusStats.map(item => (
                  <TableRow key={item.status} hover>
                    <TableCell sx={{ fontWeight: 600, textTransform: 'capitalize' }}>{item.status} Trials Registry</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>{item.count}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'success.main' }}>
                        <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'currentColor' }} />
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 700 }}>VERIFIED</Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow sx={{ bgcolor: '#fafafa' }}>
                  <TableCell sx={{ fontWeight: 700 }}>Total Enrolled Subjects</TableCell>
                  <TableCell sx={{ fontWeight: 900 }}>{stats.summary.participants}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'success.main' }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'currentColor' }} />
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 700 }}>VERIFIED</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
                <TableRow sx={{ bgcolor: '#fafafa' }}>
                  <TableCell sx={{ fontWeight: 700 }}>Total Clinical Data Points</TableCell>
                  <TableCell sx={{ fontWeight: 900 }}>{stats.summary.activities}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'success.main' }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'currentColor' }} />
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 700 }}>VERIFIED</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>


        </CardContent>
      </Card>
    </Box>
  );
}

export default Reports;
