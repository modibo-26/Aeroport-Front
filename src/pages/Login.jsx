import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { use, useState } from "react";
import { TextField, Button, Box, Typography} from '@mui/material'

function Login() {

    const navigate = useNavigate();

    const { handleLogin } = use(AuthContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    

    const handleSubmit = async (e) => {
        console.log(process.env.REACT_APP_API_URL);
        e.preventDefault();
        try {
            const response = await handleLogin({ email, password });
            if (response) {
                navigate('/');
            }
        } catch (error) {
            console.error("Login error:", error);
        }
    }



    return (
        <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>
            <Typography variant="h4" mb={3}>Connexion</Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <TextField
                    label="Mot de passe"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                    Se connecter
                </Button>
            </form>
        </Box>
    );
}

export default Login;