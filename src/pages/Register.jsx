import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Box, Button, TextField, Typography } from "@mui/material";

function Register() {
  const navigate = useNavigate()
  const { user, handleRegister } = useContext(AuthContext)

  const [nom, setUsername] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await handleRegister({ nom, prenom, email, password });
      if (response) {
        navigate('/login');
      }
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <div>
      <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>
        <Typography variant="h4" mb={3}>Inscription</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Nom"
            value={nom}
            onChange={(e) => setUsername(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Prénom"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            type="email"po
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            S'inscrire
          </Button>
        </form> 
      </Box>
    </div>
  );
}

export default Register;