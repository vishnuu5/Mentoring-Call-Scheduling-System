import React, { useState } from 'react';
import { Layout } from '../components/common/Layout.jsx';
import { useFetch } from '../hooks/useFetch.js';
import { useAuth } from '../hooks/useAuth.js';
import api from '../utils/api.js';
import { getWeekDates, formatDate } from '../utils/timezone.js';
import { TIMEZONES } from '../utils/constants.js';

export const UserDashboard = () => {
  const { user } = useAuth();
  const [timezone, setTimezone] = useState(user?.timezone || 'GMT');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const weekDates = getWeekDates();

  const { data: myAvailability, refetch: refetchAvailability } = useFetch(
    user?.id ? `/api/availability/user/${user.id}` : null,
    {
      params: {
        startDate: weekDates[0],
        endDate: weekDates[6],
      },
    }
  );

  const { data: myCalls } = useFetch(user?.id ? `/api/calls/user/${user.id}` : null);

  const handleAddAvailability = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await api.post('/api/availability/user', {
        date: selectedDate,
        startTime,
        endTime,
        timezone,
      });

      setMessage('Availability added successfully!');
      setStartTime('09:00');
      setEndTime('10:00');
      refetchAvailability();

      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to add availability';
      setMessage(` Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAvailability = async (id) => {
    if (confirm('Delete this availability slot?')) {
      try {
        await api.delete(`/api/availability/${id}`);
        refetchAvailability();
      } catch (error) {
        const errorMessage = error.response?.data?.error || 'Failed to delete';
        setMessage(`Error: ${errorMessage}`);
      }
    }
  };

  const handleDeleteCall = async (id) => {
    if (confirm('Delete this scheduled call?')) {
      try {
        await api.delete(`/api/calls/${id}`);
        refetchCalls();
      } catch (error) {
        const errorMessage = error.response?.data?.error || 'Failed to delete call';
        setMessage(` Error: ${errorMessage}`);
      }
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-8">Your Dashboard</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="card">
              <h2 className="text-2xl font-bold mb-4">Add Availability</h2>

              {message && (
                <div className={`mb-4 p-3 rounded-lg border ${
                  message.includes('❌') ? 'bg-red-50 border-red-200 text-red-800' :
                  message.startsWith('Error') ? 'bg-red-50 border-red-200 text-red-800' :
                  'bg-green-50 border-green-200 text-green-800'
                }`}>
                  <div>{message}</div>
                </div>
              )}

              <form onSubmit={handleAddAvailability}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Timezone</label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    {TIMEZONES.map((tz) => (
                      <option key={tz.value} value={tz.value}>
                        {tz.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Start Time</label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">End Time</label>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Adding...' : 'Add Availability'}
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <h2 className="text-2xl font-bold mb-4">Your Availability - This Week</h2>
              {myAvailability && myAvailability.length > 0 ? (
                <div className="space-y-3">
                  {myAvailability.map((slot) => (
                    <div key={slot.id} className="p-3 bg-gray-50 rounded-lg border">
                      <div>
                        <p className="font-medium">{formatDate(slot.date)}</p>
                        <p className="text-sm text-gray-600">
                          {slot.start_time} - {slot.end_time} ({slot.timezone})
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No availability slots added yet</p>
              )}
            </div>

            <div className="card">
              <h2 className="text-2xl font-bold mb-4">Your Scheduled Calls</h2>
              {myCalls && myCalls.length > 0 ? (
                <div className="space-y-3">
                  {myCalls.map((call) => (
                    <div key={call.id} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-lg">{call.call_type_name}</p>
                          <p className="text-sm text-gray-600">Mentor: {call.mentor_name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-xs font-medium">
                            {call.status}
                          </span>
                          <button
                            onClick={() => handleDeleteCall(call.id)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <p className="text-sm">
                        {formatDate(call.call_date)} at {call.start_time} - {call.end_time} ({call.timezone})
                      </p>
                      {call.google_meet_link && (
                        <a
                          href={call.google_meet_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm mt-2"
                        >
                          Join Meeting →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No scheduled calls yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
