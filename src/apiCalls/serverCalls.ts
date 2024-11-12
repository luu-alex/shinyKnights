import axios from 'axios';

const serverURL = import.meta.env.VITE_SERVER_URL;
export const updateProfile = async (profile: any) => {
    try {
        console.log(" trying to update profile", profile)
        const response = await axios.post(serverURL + '/api/updateProfile', { username: profile.username, updatedProfile: profile });
        console.log(response);
        if (response.status === 200) {
            console.log(response.data)
            console.log('Profile updated successfully');
        } else {
            console.error('Error updating profile.');
        }
    } catch (err) {
        console.error('error updatinhg profile.', err);
    }
};

export const gameResults = async (username: string, wave: number) => {
    console.log("game results");
    try {
        const response = await axios.post(serverURL + '/api/gameResults', { username, wave });
        return response.data;
    } catch (err) {
        console.error('Error fetching or creating profile.', err);
    }
}

export const fetchOrCreateProfile = async (username: string) => {
    try {
        const response = await axios.post(serverURL + '/api/profile', { username });
        return response.data;
    } catch (err) {
        console.error('Error fetching or creating profile.', err);
    }
};

export const upgradeWeapon = async (username: string, weaponID: number) => {
    try {
        console.log("updating weapon", username, weaponID)
        const response = await axios.post(serverURL + '/api/upgradeWeapon', { username, weaponID });
        console.log(response);
        if (response.status === 200) {
            console.log(response.data)
            console.log('Profile updated successfully');
        } else {
            console.error('Error updating profile.');
        }
    } catch (err) {
        console.error('error updatinhg profile.', err);
    }
}

export const upgradeCharacter = async (username: string, characterID: string) => {
    try {
        console.log("updating character", username, characterID)
        const response = await axios.post(serverURL + '/api/upgradeCharacter', { username, characterID });
        console.log(response);
        if (response.status === 200) {
            console.log(response.data)
            console.log('Profile updated successfully');
        } else {
            console.error('Error updating profile.');
        }
    } catch (err) {
        console.error('error updatinhg profile.', err);
    }
};
export const equipWeaponAPI = async (username: string, index: number) => {
    try {
        console.log("equipping weapon", username, index)
        const response = await axios.post(serverURL + '/api/equipWeapon', { username, index });
        console.log(response);
        if (response.status === 200) {
            console.log(response.data)
            console.log('Profile updated successfully');
        } else {
            console.error('Error updating profile.');
        }
    } catch (err) {
        console.error('error updatinhg profile.', err);
    }
};

export const unlockChest = async (username: string, chestID: number) => {
    try {
        console.log("unlocking chest", username, chestID)
        const response = await axios.post(serverURL + '/api/unlockChest', { username, itemID: chestID });
        console.log(response);
        if (response.status === 200) {
            console.log(response.data)
            console.log('Profile updated successfully');
            return response.data.unlocked;
        } else {
            console.error('Error updating profile.');
        }
    } catch (err) {
        console.error('error updatinhg profile.', err);
    }
}

export const getDailyShop = async (username: string) => {
    try {
        const response = await axios.post(serverURL + '/api/dailyShop', { username  });
        return response.data;
    } catch (err) {
        console.error('Error fetching daily shop.', err);
    }
}

export const buyItem = async (username: string, itemIndex: number) => {
    try {
        const response = await axios.post(serverURL + '/api/buyItem', { username, itemIndex });
        return response.data;
    } catch (err) {
        console.error('Error buying item.', err);
    }

}