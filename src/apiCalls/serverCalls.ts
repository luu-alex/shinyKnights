import axios from 'axios';

const serverURL = import.meta.env.VITE_SERVER_URL || "http://localhost:5001";
export const updateProfile = async (profile: any) => {
    try {
        console.log(" trying to update profile", profile)
        const response = await axios.post(serverURL + '/api/updateProfile', { username: profile.username, updatedProfile: profile });
        if (response.status === 200) {
            console.log('Profile updated successfully');
        } else {
            console.error('Error updating profile.');
        }
    } catch (err) {
        console.error('Error fetching or creating profile.', err);
    }
};