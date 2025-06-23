import React, { useState } from "react";
import { ArrowLeft, User, Mail, Lock, Shield, Phone, MapPin, Building } from "lucide-react";

interface StaffFormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
    phone: string;
    department: string;
    address: string;
    hireDate: string;
    salary: string;
}

export default function AddStaff({ onBack }: { onBack: () => void }) {
    const [formData, setFormData] = useState<StaffFormData>({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
        phone: "",
        department: "",
        address: "",
        hireDate: "",
        salary: ""
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleInputChange = (field: keyof StaffFormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        setIsSubmitting(true);

        // TODO: Implement API call to add staff
        console.log("Adding staff:", formData);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        setIsSubmitting(false);
        onBack();
    };

    const roles = [
        { value: "manager", label: "Manager", description: "Full system access" },
        { value: "cashier", label: "Cashier", description: "Ticket sales and customer service" },
        { value: "usher", label: "Usher", description: "Theater management and customer assistance" },
        { value: "maintenance", label: "Maintenance", description: "Technical and facility maintenance" },
        { value: "admin", label: "Administrator", description: "System administration" }
    ];

    const departments = [
        "Operations",
        "Customer Service",
        "Technical",
        "Administration",
        "Marketing",
        "Finance"
    ];

    const getRoleColor = (role: string) => {
        switch (role) {
            case "manager": return "text-blue-400";
            case "cashier": return "text-green-400";
            case "usher": return "text-yellow-400";
            case "maintenance": return "text-orange-400";
            case "admin": return "text-red-400";
            default: return "text-slate-400";
        }
    };

    return (
        <div className="flex flex-col gap-6 p-4 w-full">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Staff
                    </button>
                </div>
                <div className="flex flex-col items-end">
                    <h2 className="text-2xl font-bold tracking-tight text-white">Add New Staff Member</h2>
                    <p className="text-slate-400">Create a new staff account</p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                        {/* Personal Information */}
                        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <User className="w-5 h-5" />
                                Personal Information
                            </h3>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            First Name *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.firstName}
                                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                                            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                                            placeholder="Enter first name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Last Name *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.lastName}
                                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                                            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                                            placeholder="Enter last name"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Email Address *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                                            placeholder="Enter email address"
                                        />
                                        <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Phone Number
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => handleInputChange('phone', e.target.value)}
                                            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                                            placeholder="Enter phone number"
                                        />
                                        <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Address
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={formData.address}
                                        onChange={(e) => handleInputChange('address', e.target.value)}
                                        className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                                        placeholder="Enter address"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Account Security */}
                        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <Lock className="w-5 h-5" />
                                Account Security
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Password *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            required
                                            value={formData.password}
                                            onChange={(e) => handleInputChange('password', e.target.value)}
                                            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                                            placeholder="Enter password"
                                            minLength={8}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                                        >
                                            {showPassword ? "Hide" : "Show"}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Confirm Password *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            required
                                            value={formData.confirmPassword}
                                            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                                            placeholder="Confirm password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                                        >
                                            {showConfirmPassword ? "Hide" : "Show"}
                                        </button>
                                    </div>
                                </div>

                                {formData.password && formData.confirmPassword && (
                                    <div className={`text-sm ${formData.password === formData.confirmPassword ? 'text-green-400' : 'text-red-400'}`}>
                                        {formData.password === formData.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Role & Department */}
                        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <Shield className="w-5 h-5" />
                                Role & Department
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Role *
                                    </label>
                                    <select
                                        required
                                        value={formData.role}
                                        onChange={(e) => handleInputChange('role', e.target.value)}
                                        className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                                    >
                                        <option value="">Select role</option>
                                        {roles.map(role => (
                                            <option key={role.value} value={role.value}>
                                                {role.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Role Description */}
                                {formData.role && (
                                    <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
                                        <div className={`font-medium ${getRoleColor(formData.role)}`}>
                                            {roles.find(r => r.value === formData.role)?.label}
                                        </div>
                                        <div className="text-slate-400 text-sm mt-1">
                                            {roles.find(r => r.value === formData.role)?.description}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Department
                                    </label>
                                    <select
                                        value={formData.department}
                                        onChange={(e) => handleInputChange('department', e.target.value)}
                                        className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                                    >
                                        <option value="">Select department</option>
                                        {departments.map(dept => (
                                            <option key={dept} value={dept}>{dept}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Employment Details */}
                        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <Building className="w-5 h-5" />
                                Employment Details
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Hire Date *
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.hireDate}
                                        onChange={(e) => handleInputChange('hireDate', e.target.value)}
                                        max={new Date().toISOString().split('T')[0]}
                                        className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Salary (Annual)
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={formData.salary}
                                            onChange={(e) => handleInputChange('salary', e.target.value)}
                                            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                                            placeholder="Enter annual salary"
                                        />
                                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400">$</span>
                                    </div>
                                </div>

                                {/* Staff Preview */}
                                {formData.firstName && formData.lastName && (
                                    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center">
                                                <User className="w-6 h-6 text-slate-400" />
                                            </div>
                                            <div>
                                                <h4 className="text-white font-semibold">
                                                    {formData.firstName} {formData.lastName}
                                                </h4>
                                                <p className="text-slate-400 text-sm">{formData.email}</p>
                                                {formData.role && (
                                                    <span className={`text-xs font-medium ${getRoleColor(formData.role)}`}>
                                                        {roles.find(r => r.value === formData.role)?.label}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 justify-end pt-6 border-t border-slate-800">
                    <button
                        type="button"
                        onClick={onBack}
                        className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-semibold rounded-lg transition flex items-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Adding...
                            </>
                        ) : (
                            <>
                                <User className="w-4 h-4" />
                                Add Staff Member
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
