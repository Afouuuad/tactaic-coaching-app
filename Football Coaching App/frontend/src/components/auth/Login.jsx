import React, { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PLAYER_API_END_POINT } from '@/utils/constant'; // 1. Using the correct API endpoint
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setUser } from '@/redux/authSlice';
import { Loader2 } from 'lucide-react';

/**
 * Login component for existing users.
 */
const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
    });
    const { loading, user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${PLAYER_API_END_POINT}/login`, input, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });

            if (res.data.success) {
                dispatch(setUser(res.data.user));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.error("Error during login:", error);
            toast.error(error.response?.data?.message || "Login failed. Please check credentials.");
        } finally {
            dispatch(setLoading(false));
        }
    };

    // Redirect if user is already logged in
    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    return (
        // 2. Applying dark theme and full-screen layout
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <form onSubmit={submitHandler} className="w-full max-w-md p-8 bg-gray-800 border border-gray-700 shadow-xl rounded-lg space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
                    <p className="text-gray-400 mt-2">Login to your Tactical Co-Pilot account</p>
                </div>

                {/* Email */}
                <div>
                    <Label className="text-lg text-white">Email</Label>
                    <Input
                        type="email"
                        name="email"
                        value={input.email}
                        onChange={changeEventHandler}
                        placeholder="you@example.com"
                        className="mt-2 w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        required
                    />
                </div>

                {/* Password */}
                <div>
                    <Label className="text-lg text-white">Password</Label>
                    <Input
                        type="password"
                        name="password"
                        value={input.password}
                        onChange={changeEventHandler}
                        placeholder="••••••••"
                        className="mt-2 w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        required
                    />
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                    {loading ? (
                        <Button className="w-full p-4 bg-blue-700" disabled>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                        </Button>
                    ) : (
                        <Button type="submit" className="w-full p-4 bg-blue-600 hover:bg-blue-700">
                            Login
                        </Button>
                    )}
                </div>

                <p className="text-center text-gray-400">
                    Don't have an account? <Link to="/signup" className="text-blue-400 hover:underline">Signup</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;
