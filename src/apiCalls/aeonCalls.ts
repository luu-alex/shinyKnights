
import axios from 'axios';

const serverURL = import.meta.env.VITE_SERVER_URL || "http://localhost:5001";
export const createOrder = async (username: string, amount: number) => {
    try {
        const response = await axios.post(serverURL + '/api/aeonOrder', { userID: username, amount });
        if (response.status === 200) {
            console.log('Profile updated successfully', response.data);
            return response.data;
        } else {
            console.error('Error updating profile.');
        }
    } catch (err) {
        console.error('unable to hit api.', err);
    }

}

export const orderStatus = async (userID: string) => {
    try {
        const response = await axios.post(serverURL + '/api/aeonOrderStatus', { userID });
        console.log("getting response", response)
        if (response.status === 200) {
            console.log('Order status updated successfully', response.data);
            return response.data;
        } else {
            console.error('Error updating order status.');
        }
    } catch (err) {
        console.error('unable to hit api.', err);
    }
}