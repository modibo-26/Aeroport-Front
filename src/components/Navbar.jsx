import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { AppBar, Badge, Box, Button, Dialog, DialogContent, DialogTitle, IconButton, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { deleteNotification, fetchNotificationByPassager, markAsRead } from "../services/notificationService";
import { Delete, Notifications } from '@mui/icons-material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale/fr';
import { fetchVolById } from "../services/volService";

function Navbar() {
    
    const navigate = useNavigate();
    const { user, handleLogout } = useContext(AuthContext);
    
    const [notifications, setNotifications] = useState([]);
    const [vols, setVols] = useState([]) 
    const [anchorEl, setAnchorEl] = useState(null);

    const [selectedNotif, setSelectedNotif] = useState(null);


    useEffect(() => {
        if (user) {
            fetchNotificationByPassager(user.id)
                .then(async (res) => {
                    setNotifications(res.data);
                    
                    const volIds = [...new Set(res.data.map(n => n.volId).filter(id => id))];
                    const volsData = await Promise.all(volIds.map(id => fetchVolById(id)));
                    const volsMap = {};
                    volsData.forEach(v => volsMap[v.data.id] = v.data);
                    setVols(volsMap);
                });
        }
    }, [user]);

    const handleMarkAsRead = async (id) => {
        try {
            await markAsRead(id);
            setNotifications(prev => {
                const updated = prev.map(n => n.id ===  Number(id) ? { ...n, lue: true } : n);
                console.log("Updated notifications:", updated);
                return updated;
            });
        } catch (error) {
            console.error("Error marking notification as read:", error);
        };
    }

    const handleDelete = async (id) => {
        try {
           await deleteNotification(id);
           refreshNotification();
        } catch (error) {
            console.error("Error deleting notification:", error);
        }
    }

    const refreshNotification = async () => {
        if (user) {
            try {
                const res = await fetchNotificationByPassager(user.id);
                setNotifications(res.data);
                
                const volIds = [...new Set(res.data.map(n => n.volId).filter(id => id))];
                const volsData = await Promise.all(volIds.map(id => fetchVolById(id)));
                const volsMap = {};
                volsData.forEach(v => volsMap[v.data.id] = v.data);
                setVols(volsMap);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        }
    }

    return ( 
        <AppBar position="static">
            <Toolbar>
                <Typography 
                    variant="h6" 
                    sx={{ cursor: 'pointer' }} 
                    onClick={() => navigate('/')}
                >
                    Aéroport
                </Typography>

                <Box sx={{ flexGrow: 1 }} />

                {user ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {user.role === 'ADMIN' && (
                            <Button color="inherit" onClick={() => navigate('/admin/vols')}>
                                Admin
                            </Button>
                        )}
                        <Button color="inherit" onClick={() => navigate('/user/reservations')}>
                            Mes réservations
                        </Button>
                        <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
                            <Badge badgeContent={notifications.filter(n => !n.lue).length} color="error">
                                <Notifications />
                            </Badge>
                        </IconButton>
                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                            {notifications.map(n => (
                                <MenuItem 
                                    key={n.id} 
                                    sx={{ display: 'flex', justifyContent: 'space-between', opacity: n.lue ? 0.5 : 1 }}
                                >
                                    <span onClick={() => {
                                        handleMarkAsRead(n.id);
                                        setSelectedNotif(n);
                                    }}>
                                        {n.message}
                                    </span>
                                    <IconButton size="small" onClick={() => handleDelete(n.id)}>
                                        <Delete fontSize="small" />
                                    </IconButton>
                                </MenuItem>
                            ))}
                        </Menu>
                        <Typography>{user.email}</Typography>
                        <Button color="inherit" onClick={handleLogout}>
                            Déconnexion
                        </Button>
                    </Box>
                ) : (
                    <Box>
                        <Button color="inherit" onClick={() => navigate('/login')}>
                            Se connecter
                        </Button>
                        <Button color="inherit" onClick={() => navigate('/register')}>
                            S'inscrire
                        </Button>
                    </Box>
                )}
            </Toolbar>

            <Dialog open={!!selectedNotif} onClose={() => setSelectedNotif(null)}>
                <DialogTitle>Notification</DialogTitle>
                <DialogContent>
                    {selectedNotif && vols[selectedNotif.volId] && (
                        <Box>
                            <Typography variant="body1" mb={1}>{selectedNotif.message}</Typography>
                            <Typography variant="body1">Vol n°{vols[selectedNotif.volId].numeroVol}</Typography>
                            <Typography variant="body2">Départ : {vols[selectedNotif.volId].origine}</Typography>
                            <Typography variant="body2">Destination :{vols[selectedNotif.volId].destination}</Typography>
                            {selectedNotif.reservationId && (
                                <Typography variant="body2">Réservation n°{selectedNotif.reservationId}</Typography>
                            )}
                            <Typography variant="caption" color="text.secondary">
                                {format(new Date(vols[selectedNotif.volId].dateDepart), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
            </Dialog>
        </AppBar>
    );
}

export default Navbar;