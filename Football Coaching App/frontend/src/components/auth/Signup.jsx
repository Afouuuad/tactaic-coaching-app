import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { PLAYER_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { setUser } from '@/redux/authSlice';

/**
 * Signup component for new users to register as either a Coach or a Player.
 */
const Signup = () => {
    const [input, setInput] = useState({
        fullName: "",
        email: "",
        password: "",
        role: "Coach", // Default role is now Coach
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post(`${PLAYER_API_END_POINT}/register`, input, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            });

            if (res.data.success) {
                dispatch(setUser(res.data.user));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <form onSubmit={submitHandler} className="w-full max-w-md p-8 bg-gray-800 border border-gray-700 shadow-xl rounded-lg space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white">Create an Account</h1>
                    <p className="text-gray-400 mt-2">Join Tactical Co-Pilot</p>
                </div>
                
                {/* Full Name */}
                <div>
                    <Label className="text-lg text-white">Full Name</Label>
                    <Input
                        type="text"
                        name="fullName"
                        value={input.fullName}
                        onChange={changeEventHandler}
                        placeholder="John Doe"
                        className="mt-2 w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        required
                    />
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

                {/* Role Selection */}
                <div>
                    <Label className="text-lg text-white">Register as a</Label>
                    <select
                        name="role"
                        value={input.role}
                        onChange={changeEventHandler}
                        className="mt-2 w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        required
                    >
                        <option value="Coach">Coach</option>
                        <option value="Player">Player</option>
                    </select>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                    {loading ? (
                        <Button className="w-full p-4 bg-blue-700" disabled>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing Up...
                        </Button>
                    ) : (
                        <Button type="submit" className="w-full p-4 bg-blue-600 hover:bg-blue-700">
                            Create Account
                        </Button>
                    )}
                </div>

                <p className="text-center text-gray-400">
                    Already have an account? <Link to="/login" className="text-blue-400 hover:underline">Login</Link>
                </p>
            </form>
        </div>
    );
};

export default Signup;

