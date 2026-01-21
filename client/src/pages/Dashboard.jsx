import { useState, useEffect } from 'react';
import api from '../api';
import {
    Box,
    Grid,
    Typography,
    Card,
    CardContent,
    CircularProgress
} from '@mui/material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import {
    Science as BeakerIcon,
    People as UsersIcon,
    Assignment as ActivityIcon
} from '@mui/icons-material';

function Dashboard() {
    const [stats, setStats] = useState(null);
    const [participation, setParticipation] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, partRes] = await Promise.all([
                    api.get('/reports/summary'),
                    api.get('/reports/participation')
                ]);
                setStats(statsRes.data);
                setParticipation(partRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
            <CircularProgress color="primary" />
        </Box>
    );

    const statCards = [
        { title: 'Total Trials', value: stats.summary.trials, icon: <BeakerIcon />, color: '#00BCFF' },
        { title: 'Total Participants', value: stats.summary.participants, icon: <UsersIcon />, color: '#6BBE44' },
        { title: 'Total Activities', value: stats.summary.activities, icon: <ActivityIcon />, color: '#003359' },
    ];

    return (
        <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 800, mb: 4 }}>
                Dashboard
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                {statCards.map((stat, index) => (
                    <Grid item xs={12} md={4} key={index}>
                        <Card>
                            <CardContent sx={{ textAlign: 'center', p: 4 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                    <Box
                                        sx={{
                                            width: 60,
                                            height: 60,
                                            borderRadius: '50%',
                                            bgcolor: '#f8fafc',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: stat.color
                                        }}
                                    >
                                        {stat.icon}
                                    </Box>
                                </Box>
                                <Typography variant="h3" sx={{ fontWeight: 900, color: 'text.primary', mb: 1 }}>
                                    {stat.value}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                                    {stat.title}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Card>
                <CardContent sx={{ p: 4 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>
                        Trial Participation Overview
                    </Typography>
                    <Box sx={{ height: 350 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={participation}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis
                                    dataKey="trial_name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 13 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 13 }}
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(0,188,255,0.05)' }}
                                    contentStyle={{
                                        borderRadius: 8,
                                        border: '1px solid #e2e8f0',
                                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                    }}
                                />
                                <Bar
                                    dataKey="participant_count"
                                    fill="#00BCFF"
                                    radius={[8, 8, 0, 0]}
                                    barSize={50}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}

export default Dashboard;
