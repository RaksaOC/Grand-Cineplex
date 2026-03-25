import React, { useState, FormEvent, ChangeEvent, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Password from "../../components/customer/useraccess/password";
import { ValidateEmail } from "../../utils/validation";
import { FaUserAlt } from "react-icons/fa";
import TokenAPI from "../../api/tokenApi";
import { setToken } from "../../utils/auth";
import { StaffAuthContext } from "../../components/context/StaffAuthContext";
import { Clapperboard } from "lucide-react";

export default function Auth() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState<boolean>(false);

    const navigate = useNavigate();
    const { setAuth } = useContext(StaffAuthContext)!;

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!ValidateEmail(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        if (!password) {
            setError("Please enter the password.");
            return;
        }

        setError(null);
        setSubmitting(true);

        try {
            const api_base_url = import.meta.env.VITE_API_BASE_URL;
            const res = await TokenAPI.TokenAPIManager.post(`${api_base_url}/manager/users/login`, {
                email,
                password,
            });

            const { token, ...userData } = res.data;

            // Save token and user info to localStorage
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(userData));

            // Set token in TokenAPI instance
            setToken(token);
            TokenAPI.TokenAPIManager.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            // Update auth context
            setAuth(userData);

            // Force a storage event to trigger context re-check
            window.dispatchEvent(new StorageEvent('storage', {
                key: 'token',
                newValue: token
            }));

            console.log("Auth: Login successful, navigating to /manager");
            navigate("/manager");
        } catch (err: any) {
            console.error("Login error:", err);
            setError(err.response?.data?.message || "Login failed. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const isLoginFormValid = (): boolean => {
        return ValidateEmail(email) && password.trim().length > 0;
    };

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Branding */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Clapperboard className="w-8 h-8 text-blue-400" />
                        <span className="text-2xl font-bold text-blue-400 tracking-wide">GRAND CINEPLEX</span>
                    </div>
                    <p className="text-gray-400 text-sm">Manager Portal</p>
                </div>

                {/* Login Form */}
                <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-8 shadow-2xl">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
                        <p className="text-gray-400 text-sm">Sign in to your staff account</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                    className="w-full pl-12 rounded-xl border border-gray-700 bg-gray-900/50 px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter your email"
                                    required
                                />
                                <FaUserAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Password
                            </label>
                            <Password
                                value={password}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                            />
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                                <p className="text-red-400 text-sm">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={!isLoginFormValid() || submitting}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 hover:scale-[1.02] disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {submitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Signing In...
                                </>
                            ) : (
                                <>
                                    <FaUserAlt className="w-4 h-4" />
                                    Sign In
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
