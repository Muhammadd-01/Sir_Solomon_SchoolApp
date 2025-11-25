import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Fees = () => {
    const [fees, setFees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('');

    useEffect(() => {
        fetchFees();
    }, [filterStatus]);

    const fetchFees = async () => {
        try {
            setLoading(true);
            const params = {};
            if (filterStatus) params.status = filterStatus;

            const response = await api.get('/fees', { params });
            setFees(response.data.data || []);
        } catch (error) {
            console.error('Error fetching fees:', error);
        } finally {
            setLoading(false);
        }
    };

    const getTotalStats = () => {
        const total = fees.reduce((sum, fee) => sum + fee.amount, 0);
        const paid = fees.reduce((sum, fee) => sum + fee.paidAmount, 0);
        const pending = total - paid;

        return { total, paid, pending };
    };

    const stats = getTotalStats();

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Fee Management</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-sm text-gray-600 mb-1">Total Fees</p>
                    <p className="text-3xl font-bold text-gray-900">₨{stats.total.toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-sm text-green-600 mb-1">Collected</p>
                    <p className="text-3xl font-bold text-green-700">₨{stats.paid.toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-sm text-red-600 mb-1">Pending</p>
                    <p className="text-3xl font-bold text-red-700">₨{stats.pending.toLocaleString()}</p>
                </div>
            </div>

            {/* Filter */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="partial">Partially Paid</option>
                    <option value="paid">Fully Paid</option>
                    <option value="overdue">Overdue</option>
                </select>
            </div>

            {/* Fees Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center">Loading...</div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paid</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Balance</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {fees.map((fee) => (
                                <tr key={fee._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {fee.studentId?.name?.first} {fee.studentId?.name?.last}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{fee.type}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        ₨{fee.amount.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                                        ₨{fee.paidAmount.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                                        ₨{(fee.amount - fee.paidAmount).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(fee.dueDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${fee.status === 'paid' ? 'bg-green-100 text-green-800' :
                                                fee.status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                                                    fee.status === 'overdue' ? 'bg-red-100 text-red-800' :
                                                        'bg-gray-100 text-gray-800'
                                            }`}>
                                            {fee.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {!loading && fees.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        No fee records found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Fees;
