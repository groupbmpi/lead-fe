import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import router from 'next/router';

interface DecodedToken {
    id: number;
    role: string;
    email: string;
    name: string;
    iat: number;
    exp: number;
    category?: string;
}
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const decodeToken = (token: string | null): DecodedToken | null => {
    try {
        if (token) {
            return jwtDecode(token) as DecodedToken;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

export const checkAuth = async (requiredRoles: string[]): Promise<boolean> => {
    const token = Cookies.get('token');
    if (!token) {
        return false;
    }

    const decodedToken = decodeToken(token);
    if (!decodedToken || !decodedToken.role || !decodedToken.exp) {
        return false;
    }

    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (decodedToken.exp < currentTimestamp) {
        Cookies.remove('token');
        return false;
    }

    return requiredRoles.includes(decodedToken.role);
};

export const getEmail = (): string => {
    const token = Cookies.get('token');
    if (!token) {
        return 'User';
    }
    const decodedToken = decodeToken(token);
    if (decodedToken) {
        return decodedToken.email;
    } else {
        return 'User';
    }
}

export const getUserName = (): string => {
    const token = Cookies.get('token');
    if (!token) {
        return 'User';
    }
    const decodedToken = decodeToken(token);
    if (decodedToken) {
        return decodedToken.name;
    } else {
        return 'User';
    }
}

export const getRole = (): string => {
    const token = Cookies.get('token');
    if (!token) {
        return 'User';
    }
    const decodedToken = decodeToken(token);
    if (decodedToken) {
        return decodedToken.role;
    } else {
        Cookies.remove('token');
        return 'User';
    }
}

export const getId = (): number => {
    const token = Cookies.get('token');
    if (!token) {
        return 0;
    }
    const decodedToken = decodeToken(token);
    if (decodedToken) {
        return decodedToken.id;
    } else {
        Cookies.remove('token');
        return 0;
    }
}

export const getMentorCategory = (): string => {
    const token = Cookies.get('token');
    if (!token) {
        return 'User';
    }
    const decodedToken = decodeToken(token);
    if (decodedToken && decodedToken.category) {
        return decodedToken.category;
    } else {
        Cookies.remove('token');
        return 'User';
    }
}

export const handleLogout = async () => {
    try {
        const response = await fetch(`${backendUrl}/api/v1/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (response.ok) {
            Cookies.remove('token');
            router.push('/');
        } else {
            console.error('Error logging out:', await response.text());
        }
    } catch (error) {
        console.error('Error logging out:', error);
    }
};

export const redirectLoggedInUser = async () => {
    const loggedIn = checkAuth(['MENTOR', 'ADMIN', 'PARTICIPANT', 'SUPERADMIN']);
    if (await loggedIn) {
        const role = getRole();
        if (role === 'MENTOR') {
            router.push('/mentor/dashboard')
        }
        if (role === 'PARTICIPANT') {
            router.push('/participant/dashboard')
        }
        if (role === 'ADMIN' || role === 'SUPERADMIN') {
            router.push('/admin/dashboard')
        }
    }
}