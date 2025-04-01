import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './app.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [editingAddress, setEditingAddress] = useState(null);
  const [editingUser, setEditingUser] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({ username: "", phone_number: "" });
  const [newAddress, setNewAddress] = useState({ street: "", city: "", state: "", country: "", zip_code: "" });
  const [newDocument, setNewDocument] = useState({
    name: "",
    description: "",
    size: "",
    file: null,
  });
  const navigate = useNavigate();
  const [error, setError] = useState("");
  
  useEffect(() => {
    fetchUserProfile();
    fetchAddresses();
    fetchDocuments();
  }, []);

  const fetchUserProfile = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/v1/auth/user/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const handleEditUser = () => {
    setEditingUser(true);
    setUpdatedUser({ username: user.username, phone_number: user.phone_number });
  };

  const handleCancelEdit = () => {
    setEditingUser(false);
    setUpdatedUser({ username: user.username, phone_number: user.phone_number });
  };

  const fetchAddresses = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/v1/addresses/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAddresses(response.data);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };


  const handleUpdateUser = async () => {
    const token = localStorage.getItem("accessToken");
  
    // Trim spaces before sending request
    const sanitizedUser = {
      username: updatedUser.username.trim(),  // ✅ Trim spaces
      phone_number: updatedUser.phone_number.trim()
    };
  
    console.log("Updated User Payload:", sanitizedUser);  // Debugging output
  
    try {
      const response = await axios.patch(
        "http://127.0.0.1:8000/api/v1/auth/user/",
        sanitizedUser,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log("User updated successfully:", response.data);
      setUser(response.data);
      setEditingUser(false);
  
      // ✅ Refresh the page after successful update
      window.location.reload();
    } catch (error) {
      console.error("Error updating user:", error.response?.data || error);
  
      // Show backend validation errors if available
      if (error.response?.data) {
        setError(JSON.stringify(error.response.data));  // Display API error
      } else {
        setError("Failed to update profile.");
      }
    }
  };
  const handleAddAddress = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      await axios.post("http://127.0.0.1:8000/api/v1/addresses/", newAddress, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewAddress({ street: "", city: "", state: "", country: "", zip_code: "" });
      fetchAddresses();
    } catch (error) {
      console.error("Error adding address:", error);
    }
  };

  // Handle Document Upload
  const handleUploadDocument = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");

    if (!newDocument.name || !newDocument.size || !newDocument.description || !newDocument.file) {
      setError("All fields are required.");
      return;
    }

    const formData = new FormData();
    formData.append("name", newDocument.name);
    formData.append("size", newDocument.size);
    formData.append("description", newDocument.description);
    formData.append("file", newDocument.file);

    try {
      await axios.post("http://127.0.0.1:8000/api/v1/documents/", formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      setNewDocument({ name: "", size: "", description: "", file: null });
      fetchDocuments();
    } catch (error) {
      setError("Error uploading document.");
      console.error("Error uploading document:", error);
    }
  };

  const fetchDocuments = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/v1/documents/list/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDocuments(response.data);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  const handleUpdateAddress = async (id, updatedAddress) => {
    const token = localStorage.getItem("accessToken");
    try {
      await axios.put(`http://127.0.0.1:8000/api/v1/addresses/${id}/`, updatedAddress, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditingAddress(null);
      fetchAddresses();
    } catch (error) {
      console.error("Error updating address:", error);
    }
  };

  const handleDownload = (fileUrl) => {
    window.open(fileUrl, "_blank");
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 shadow-lg rounded-lg">
    <h2 className="text-2xl font-bold text-center">User Profile</h2>

    {user && (
      <div className="p-4 bg-white shadow-md rounded-lg mt-4">
        {editingUser ? (
          <>
            <input
              type="text"
              className="w-full p-2 border rounded mb-2"
              value={updatedUser.username}
              onChange={(e) => setUpdatedUser({ ...updatedUser, username: e.target.value })}
            />
            <input
              type="text"
              className="w-full p-2 border rounded mb-2"
              value={updatedUser.phone_number}
              onChange={(e) => setUpdatedUser({ ...updatedUser, phone_number: e.target.value })}
            />
            <button onClick={handleUpdateUser} className="w-full p-3 bg-green-500 text-white rounded-lg">
              Save Changes
            </button>
            <button onClick={handleCancelEdit} className="w-full p-3 bg-gray-400 text-white rounded-lg mt-2">
              Cancel
            </button>
          </>
        ) : (
          <>
            <p><strong>Name:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone_number}</p>
            <button onClick={handleEditUser} className="w-full p-3 bg-blue-500 text-white rounded-lg">
              Edit Profile
            </button>
          </>
        )}
        <button onClick={handleLogout} className="w-full p-3 bg-red-500 text-white rounded-lg mt-2">
          Logout
        </button>
      </div>
    )}

      <h3 className="text-xl font-bold mt-6">Add Address</h3>
      <div className="bg-white p-4 shadow-md rounded-lg mt-2">
        <input type="text" placeholder="Street" value={newAddress.street} onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })} className="p-2 border rounded w-full mb-2" />
        <input type="text" placeholder="City" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} className="p-2 border rounded w-full mb-2" />
        <input type="text" placeholder="State" value={newAddress.state} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} className="p-2 border rounded w-full mb-2" />
        <input type="text" placeholder="Country" value={newAddress.country} onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })} className="p-2 border rounded w-full mb-2" />
        <input type="text" placeholder="Zip Code" value={newAddress.zip_code} onChange={(e) => setNewAddress({ ...newAddress, zip_code: e.target.value })} className="p-2 border rounded w-full mb-2" />
        <button onClick={handleAddAddress} className="bg-green-500 text-white p-2 rounded w-full">Add Address</button>
      </div>

      <h3 className="text-xl font-bold mt-6">Addresses</h3>
      <table className="w-full border mt-2 bg-white shadow-md">
        <thead>
          <tr className="bg-gray-300">
            <th className="p-2">Street</th>
            <th className="p-2">City</th>
            <th className="p-2">State</th>
            <th className="p-2">Country</th>
            <th className="p-2">Zip Code</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {addresses.map((address) => (
            <tr key={address.id} className="border">
              <td className="p-2">
                {editingAddress?.id === address.id ? (
                  <input type="text" value={editingAddress.street} onChange={(e) => setEditingAddress({ ...editingAddress, street: e.target.value })} />
                ) : (
                  address.street
                )}
              </td>
              <td className="p-2">
                {editingAddress?.id === address.id ? (
                  <input type="text" value={editingAddress.city} onChange={(e) => setEditingAddress({ ...editingAddress, city: e.target.value })} />
                ) : (
                  address.city
                )}
              </td>
              <td className="p-2">
                {editingAddress?.id === address.id ? (
                  <input type="text" value={editingAddress.state} onChange={(e) => setEditingAddress({ ...editingAddress, state: e.target.value })} />
                ) : (
                  address.state
                )}
              </td>
              <td className="p-2">
                {editingAddress?.id === address.id ? (
                  <input type="text" value={editingAddress.country} onChange={(e) => setEditingAddress({ ...editingAddress, country: e.target.value })} />
                ) : (
                  address.country
                )}
              </td>
              <td className="p-2">
                {editingAddress?.id === address.id ? (
                  <input type="text" value={editingAddress.zip_code} onChange={(e) => setEditingAddress({ ...editingAddress, zip_code: e.target.value })} />
                ) : (
                  address.zip_code
                )}
              </td>
              <td className="p-2">
                {editingAddress?.id === address.id ? (
                  <button onClick={() => handleUpdateAddress(address.id, editingAddress)} className="bg-blue-500 text-white p-2 rounded">Save</button>
                ) : (
                  <button onClick={() => setEditingAddress(address)} className="bg-yellow-500 text-white p-2 rounded">Edit</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="text-xl font-bold mt-6">Upload Document</h3>
      <form onSubmit={handleUploadDocument} className="bg-white p-4 shadow-md rounded-lg mt-2">
        <input type="text" placeholder="Document Name" value={newDocument.name} onChange={(e) => setNewDocument({ ...newDocument, name: e.target.value })} className="p-2 border rounded w-full mb-2" />
        <input type="text" placeholder="Description" value={newDocument.description} onChange={(e) => setNewDocument({ ...newDocument, description: e.target.value })} className="p-2 border rounded w-full mb-2" />
        <input type="number" placeholder="Size (MB)" value={newDocument.size} onChange={(e) => setNewDocument({ ...newDocument, size: e.target.value })} className="p-2 border rounded w-full mb-2" />
        <input type="file" onChange={(e) => setNewDocument({ ...newDocument, file: e.target.files[0] })} className="p-2 border rounded w-full mb-2" />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">Upload Document</button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>

      <h3 className="text-xl font-bold mt-6">Uploaded Documents</h3>
      <table className="w-full border mt-2 bg-white shadow-md">
        <thead>
          <tr className="bg-gray-300">
          <th className="p-2">UserName</th>
          <th className="p-2">FileType</th>
            <th className="p-2">Name</th>
            <th className="p-2">Description</th>
            <th className="p-2">Size (MB)</th>
            <th className="p-2">Download</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.id} className="border">
            <td className="p-2">{doc.username}</td>
            <td className="p-2">{doc.file_type}</td>
              <td className="p-2">{doc.name}</td>
              <td className="p-2">{doc.description}</td>
              <td className="p-2">{doc.size}</td>
              <td className="p-2">
                <button onClick={() => handleDownload(doc.file)} className="bg-green-500 text-white p-2 rounded">Download</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Profile;
