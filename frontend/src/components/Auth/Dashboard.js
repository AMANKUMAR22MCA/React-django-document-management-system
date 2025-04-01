import { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('accessToken');
      try {
        // Assuming your API returns the necessary aggregated data
        const response = await axios.get('http://127.0.0.1:8000/api/v1/documents/list/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDashboardData(response.data);
      } catch (error) {
        setError('Error fetching dashboard data.');
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center">Documents Overview</h2>

      {error && <p className="text-red-500">{error}</p>}

      {dashboardData && (
        <>
          <div className="mt-6">
            <h3 className="text-xl font-bold">Total Files Uploaded: {dashboardData.total_files}</h3>
          </div>

          {/* File Types Breakdown */}
          <div className="mt-6">
            <h3 className="text-xl font-bold">File Types Breakdown</h3>
            <table className="w-full border mt-2 bg-white shadow-md">
              <thead>
                <tr className="bg-gray-300">
                  <th className="p-2">File Type</th>
                  <th className="p-2">Count</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.file_types.map((fileType) => (
                  <tr key={fileType.file_extension} className="border">
                    <td className="p-2">{fileType.file_extension}</td>
                    <td className="p-2">{fileType.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Files Uploaded by Each User */}
          <div className="mt-6">
            <h3 className="text-xl font-bold">Files Uploaded by Each User</h3>
            <table className="w-full border mt-2 bg-white shadow-md">
              <thead>
                <tr className="bg-gray-300">
                  <th className="p-2">User</th>
                  <th className="p-2">Files Uploaded</th>
                  <th className="p-2">File Details</th>
                  <th className="p-2">Download File</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.user_file_counts.map((userData) => (
                  <tr key={userData.user__username} className="border">
                    <td className="p-2">{userData.user__username}</td>
                    <td className="p-2">{userData.file_count}</td>
                    <td className="p-2">
                      {/* Display file details (name, size, description, file extension) */}
                      <ul>
                        {userData.files.map((file) => (
                          <li key={file.id}>
                            <p>Name: {file.name}</p>
                            <p>Size: {file.size} KB</p>
                            <p>Description: {file.description}</p>
                            <p>File Type: {file.file_extension}</p>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="p-2">
                      {/* Link to download files based on file type */}
                      {userData.files.map((file) => (
                        <div key={file.id}>
                          <a
                            href={`http://127.0.0.1:8000/media/${file.file}`} // Assuming media file URL
                            download
                            className="text-blue-600 hover:underline"
                          >
                            Download {file.name}
                          </a>
                        </div>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
