import React from 'react';
import { Grid, Card, CardContent, Box, Typography } from '@mui/material';
import { TrendingUp, TrendingDown, Agriculture, People, Assessment, NotificationsNone } from '@mui/icons-material';
<<<<<<< HEAD
import { DashboardStatistic } from '../../../domain/entities/Dashboard';
=======
import { DashboardStatistic } from '../../../../app/layout/domain/entities/Dashboard';
>>>>>>> 5a7c7fa (Primer commit)

interface StatsCardsProps {
  stats: DashboardStatistic[];
}

<<<<<<< HEAD
=======
// Mover la función fuera del componente
>>>>>>> 5a7c7fa (Primer commit)
const getStatIcon = (category: DashboardStatistic['category']) => {
  switch (category) {
    case 'farms': return <Agriculture sx={{ fontSize: 24, color: '#3b82f6' }} />;
    case 'users': return <People sx={{ fontSize: 24, color: '#10b981' }} />;
    case 'crops': return <Assessment sx={{ fontSize: 24, color: '#06b6d4' }} />;
    case 'alerts': return <NotificationsNone sx={{ fontSize: 24, color: '#ef4444' }} />;
    default: return <Assessment sx={{ fontSize: 24 }} />;
  }
};

<<<<<<< HEAD
=======
// Componente separado para cada tarjeta de estadística
const StatCard = React.memo<{ stat: DashboardStatistic }>(({ stat }) => (
  <Grid item xs={12} sm={6} md={3}>
    <Card 
      sx={{ 
        backgroundColor: '#1e293b',
        border: '1px solid #334155',
        borderRadius: 2,
        '&:hover': {
          borderColor: '#475569',
          transform: 'translateY(-2px)',
          transition: 'all 0.2s ease-in-out'
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ color: '#94a3b8', mb: 1 }}>
              {stat.title}
            </Typography>
            <Typography variant="h4" sx={{ color: '#ffffff', mb: 2, fontWeight: 'bold' }}>
              {stat.value}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                color: stat.changeType === 'positive' ? '#22c55e' : '#ef4444'
              }}
            >
              {stat.changeType === 'positive' ? 
                <TrendingUp sx={{ fontSize: 14 }} /> : 
                <TrendingDown sx={{ fontSize: 14 }} />
              }
              <Typography variant="body2">
                {stat.change}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              width: 48,
              height: 48,
              backgroundColor: `${stat.bgColor}20`,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {getStatIcon(stat.category)}
          </Box>
        </Box>
      </CardContent>
    </Card>
  </Grid>
));

StatCard.displayName = 'StatCard';

>>>>>>> 5a7c7fa (Primer commit)
export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
    <Grid container spacing={3}>
      {stats.map((stat) => (
<<<<<<< HEAD
        <Grid item xs={12} sm={6} md={3} key={stat.id}>
          <Card 
            sx={{ 
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: 2,
              '&:hover': {
                borderColor: '#475569',
                transform: 'translateY(-2px)',
                transition: 'all 0.2s ease-in-out'
              }
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ color: '#94a3b8', mb: 1 }}>
                    {stat.title}
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#ffffff', mb: 2, fontWeight: 'bold' }}>
                    {stat.value}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      color: stat.changeType === 'positive' ? '#22c55e' : '#ef4444'
                    }}
                  >
                    {stat.changeType === 'positive' ? 
                      <TrendingUp sx={{ fontSize: 14 }} /> : 
                      <TrendingDown sx={{ fontSize: 14 }} />
                    }
                    <Typography variant="body2">
                      {stat.change}
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    backgroundColor: `${stat.bgColor}20`,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {getStatIcon(stat.category)}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
=======
        <StatCard key={stat.id} stat={stat} />
>>>>>>> 5a7c7fa (Primer commit)
      ))}
    </Grid>
  );
};
