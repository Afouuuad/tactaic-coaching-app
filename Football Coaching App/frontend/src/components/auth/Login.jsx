import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AUTH_API_END_POINT } from '@/utils/constant'; // 1. Using the correct API endpoint
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setUser } from '@/redux/authSlice';
import { Loader2, Mail, Lock } from 'lucide-react';

// --- Reusable Input Component (to match Signup page) ---
const InputField = ({ icon: Icon, type, placeholder, value, onChange, name }) => (
    <div className="relative">
        {Icon && (
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Icon className="text-gray-400" size={20} />
            </div>
        )}
        <input
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={`w-full ${Icon ? 'pl-12' : 'pl-4'} pr-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-800 transition-colors`}
            required
        />
    </div>
);
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
            const res = await axios.post(`${AUTH_API_END_POINT}/login`, input, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });

            if (res.data.success) {
                dispatch(setUser(res.data)); // Passes {user, token, success} to Redux
                const loggedInUser = res.data.user;

                // Redirect based on team setup status
                if (!loggedInUser.teams || loggedInUser.teams.length === 0) {
                    navigate("/team-setup");
                } else {
                    navigate("/");
                }

                toast.success(res.data.message || "Logged in successfully", {
                    style: { backgroundColor: "#28a745", color: "#FFFFFF" },
                });
            }
        } catch (error) {
            console.error("Error during login:", error);
            toast.error(error.response?.data?.message || "Login failed. Please check credentials.", {
                style: { backgroundColor: "#dc3545", color: "#FFFFFF" },
            });
        } finally {
            dispatch(setLoading(false));
        }
    };

    // Redirect if user is already logged in (AND we have a valid token)
    const { token } = useSelector(store => store.auth);
    useEffect(() => {
        const isMalformed = token === 'null' || token === 'undefined' || token === '[object Object]';
        if (user && token && !isMalformed) {
            if (!user.teams || user.teams.length === 0) {
                navigate("/team-setup");
            } else {
                navigate("/");
            }
        }
    }, [user, token, navigate]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-md">
                <form onSubmit={submitHandler} className="p-8 bg-white border border-gray-200 shadow-lg rounded-2xl space-y-6">
                    <div className="text-center mb-6">
                        <Link to="/">
                            <img src="/Logo_2.png" alt="TactAIQ Logo" className="h-[220px] w-auto mx-auto -mt-14 " />
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-800 -mt-4">Welcome Back!</h1>
                        <p className="text-cyan-500 mt-2">Login to your account</p>
                    </div>

                    <InputField icon={Mail} type="email" name="email" placeholder="Email Address" value={input.email} onChange={changeEventHandler} />
                    <InputField icon={Lock} type="password" name="password" placeholder="Password" value={input.password} onChange={changeEventHandler} />

                    {/* Submit Button */}
                    <div className="pt-2">
                        {loading ? (
                            <button className="w-full flex justify-center items-center py-3 px-4 bg-blue-400 text-white font-semibold rounded-lg cursor-not-allowed" disabled>
                                <Loader2 className="mr-3 h-5 w-5 animate-spin" /> Signing In...
                            </button>
                        ) : (
                            <button type="submit" className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-md">
                                Login
                            </button>
                        )}
                    </div>

                    <p className="text-center text-sm text-gray-500">
                        Don't have an account? <Link to="/signup" className="font-medium text-blue-600 hover:underline">Signup here</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
