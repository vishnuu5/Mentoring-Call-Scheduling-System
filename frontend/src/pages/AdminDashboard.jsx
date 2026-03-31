import React, { useState } from 'react';
import { Layout } from '../components/common/Layout.jsx';
import { useFetch } from '../hooks/useFetch.js';
import api from '../utils/api.js';
import { getWeekDates, formatDate } from '../utils/timezone.js';
import { TIMEZONES, CALL_TYPES } from '../utils/constants.js';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [selectedCallType, setSelectedCallType] = useState(CALL_TYPES[0].name);
  const [timezone, setTimezone] = useState('GMT');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: users, refetch: refetchUsers } = useFetch('/api/users');
  const { data: mentors } = useFetch('/api/mentors');
  const { data: allCalls, refetch: refetchCalls } = useFetch('/api/admin/calls');

  const weekDates = getWeekDates();

  const { data: userAvailability } = useFetch(
    selectedUser ? `/api/availability/user/${selectedUser.id}` : null,
    {
      params: {
        startDate: weekDates[0],
        endDate: weekDates[6],
      },
    }
  );

  const { data: mentorAvailability } = useFetch(
    selectedMentor ? `/api/availability/mentor/${selectedMentor.id}` : null,
    {
      params: {
        startDate: weekDates[0],
        endDate: weekDates[6],
      },
    }
  );

  const { data: recommendations } = useFetch(
    selectedUser && selectedCallType ? `/api/recommendations` : null,
    {
      params: {
        userId: selectedUser?.id,
        callType: selectedCallType,
      },
    }
  );

  const filteredUsers = users?.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBookCall = async (e) => {
    e.preventDefault();
    if (!selectedUser || !selectedMentor) {
      setMessage('Please select both user and mentor');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const userSlot = userAvailability?.[0];
      const mentorSlot = mentorAvailability?.[0];

      if (!userSlot || !mentorSlot) {
        if (!userSlot && !mentorSlot) {
          setMessage('No availability found for both user and mentor for the selected week.');
        } else if (!userSlot) {
          setMessage('User has no availability slots for the selected week. Please ask the user to add availability.');
        } else {
          setMessage('Mentor has no availability slots for the selected week. Please ask the mentor to add availability.');
        }
        setLoading(false);
        return;
      }

      const callTypeId = CALL_TYPES.find((ct) => ct.name === selectedCallType)?.id;

      await api.post('/api/calls', {
        userId: selectedUser.id,
        mentorId: selectedMentor.id,
        callTypeId,
        callDate: userSlot.date,
        startTime: userSlot.start_time,
        endTime: userSlot.end_time,
        timezone: timezone,
        notes: `${selectedCallType} call`,
      });

      setMessage('Call booked successfully!');
      refetchCalls();
      setSelectedUser(null);
      setSelectedMentor(null);

      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to book call';
      
      // Provide specific guidance for availability conflicts
      if (errorMessage.includes('availability') || errorMessage.includes('conflicts')) {
        setMessage(` ${errorMessage}\n\n Please ensure both user and mentor have availability slots for the selected time.`);
      } else {
        setMessage(`Error: ${errorMessage}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCall = async (id) => {
    if (confirm('Delete this scheduled call?')) {
      try {
        await api.delete(`/api/calls/${id}`);
        refetchCalls();
      } catch (error) {
        setMessage(`Error: ${error.response?.data?.error || 'Failed to delete call'}`);
      }
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-4xl font-bold mb-6">Admin Dashboard</h1>

        {message && (
          <div className={`mb-6 p-4 rounded-lg border ${
            message.includes('⚠️') ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
            message.includes('❌') ? 'bg-red-50 border-red-200 text-red-800' :
            message.startsWith('Error') ? 'bg-red-50 border-red-200 text-red-800' :
            'bg-green-50 border-green-200 text-green-800'
          }`}>
            <div className="whitespace-pre-line">{message}</div>
          </div>
        )}

        <div className="flex gap-2 mb-6 border-b">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 font-medium ${activeTab === 'users' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          >
            Users & Booking
          </button>
          <button
            onClick={() => setActiveTab('calls')}
            className={`px-4 py-2 font-medium ${activeTab === 'calls' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          >
            Booked Calls
          </button>
          <button
            onClick={() => setActiveTab('mentors')}
            className={`px-4 py-2 font-medium ${activeTab === 'mentors' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          >
            Mentors
          </button>
        </div>

        {activeTab === 'users' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <div className="card">
                <h2 className="text-xl font-bold mb-4">Users</h2>
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4"
                />
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredUsers?.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => setSelectedUser(u)}
                      className={`w-full text-left p-3 rounded-lg transition ${
                        selectedUser?.id === u.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <p className="font-medium">{u.name}</p>
                      <p className="text-xs opacity-75">{u.email}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 space-y-6">
              {selectedUser && (
                <>
                  <div className="card">
                    <h2 className="text-2xl font-bold mb-4">{selectedUser.name}</h2>
                    <div className="space-y-2">
                      <p className="text-gray-600">
                        <span className="font-medium">Email:</span> {selectedUser.email}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Description:</span> {selectedUser.description || 'N/A'}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Tags:</span>{' '}
                        {selectedUser.tags?.join(', ') || 'None'}
                      </p>
                      <p className="text-gray-600">
                        <span className="font-medium">Timezone:</span> {selectedUser.timezone}
                      </p>
                    </div>
                  </div>
                  <div className="card">
                    <h3 className="text-xl font-bold mb-4">Available Time Slots</h3>
                    {userAvailability && userAvailability.length > 0 ? (
                      <div className="space-y-2">
                        {userAvailability.map((slot) => (
                          <div key={slot.id} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="font-medium">{formatDate(slot.date)}</p>
                            <p className="text-sm text-gray-600">
                              {slot.start_time} - {slot.end_time} ({slot.timezone})
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600">No availability marked</p>
                    )}
                  </div>
                  <div className="card">
                    <h3 className="text-xl font-bold mb-4">Recommended Mentors</h3>
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">Call Type</label>
                      <select
                        value={selectedCallType}
                        onChange={(e) => setSelectedCallType(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      >
                        {CALL_TYPES.map((ct) => (
                          <option key={ct.id} value={ct.name}>
                            {ct.icon} {ct.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {recommendations && recommendations.recommendations ? (
                      <div className="space-y-3">
                        {recommendations.recommendations.slice(0, 3).map((mentor) => (
                          <button
                            key={mentor.id}
                            onClick={() => setSelectedMentor(mentor)}
                            className={`w-full text-left p-4 rounded-lg border-2 transition ${
                              selectedMentor?.id === mentor.id
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-300 hover:border-green-400'
                            }`}
                          >
                            <p className="font-bold">{mentor.name}</p>
                            <p className="text-sm text-gray-600">{mentor.description}</p>
                            <div className="flex justify-between items-center mt-2">
                              <p className="text-xs">
                                {mentor.tags?.join(', ')}
                              </p>
                              <span className="font-bold text-green-600">
                                Score: {mentor.relevanceScore}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600">No recommendations available</p>
                    )}
                  </div>

                  {selectedMentor && (
                    <div className="card bg-green-50 border-2 border-green-500">
                      <h3 className="text-xl font-bold mb-4">Book Call</h3>
                      <form onSubmit={handleBookCall}>
                        <div className="space-y-4 mb-4">
                          <div>
                            <p className="font-medium">User: {selectedUser.name}</p>
                            <p className="font-medium">Mentor: {selectedMentor.name}</p>
                            <p className="font-medium">Call Type: {selectedCallType}</p>
                          </div>

                          <div>
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
                        </div>

                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 disabled:opacity-50"
                        >
                          {loading ? 'Booking...' : 'Book Call'}
                        </button>
                      </form>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
        {activeTab === 'calls' && (
          <div className="card">
            <h2 className="text-2xl font-bold mb-4">All Booked Calls</h2>
            {allCalls && allCalls.length > 0 ? (
              <div className="space-y-3">
                {allCalls.map((call) => (
                  <div key={call.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold text-lg">{call.call_type_name}</p>
                        <p className="text-sm text-gray-600">
                          {call.user_name} ↔ {call.mentor_name}
                        </p>
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
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No calls booked yet</p>
            )}
          </div>
        )}
        {activeTab === 'mentors' && (
          <div className="card">
            <h2 className="text-2xl font-bold mb-4">All Mentors</h2>
            {mentors && mentors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mentors.map((mentor) => (
                  <div key={mentor.id} className="p-4 border rounded-lg">
                    <p className="font-bold text-lg">{mentor.name}</p>
                    <p className="text-sm text-gray-600 mb-2">{mentor.email}</p>
                    <p className="text-sm mb-2">{mentor.description}</p>
                    <p className="text-xs text-gray-500">
                      Tags: {mentor.tags?.join(', ') || 'None'}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No mentors available</p>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};
