import axios from '../api/axios';
import useAuth from './useAuth';

export default function useRefreshToken() {
    const { setAuth } = useAuth();
    const refresh = async () => {
        const response = await axios.get("/api/auth/refresh", { withCredentials: true })
        setAuth(prevState => {
            return {
                ...prevState,
                accessToken: response.data.accessToken,
                user: response.data.user,
                id: response.data.id,
                profilePic: response.data.profilePic
            }
        });
        return response.data.accessToken;
    }
    return refresh;
}
