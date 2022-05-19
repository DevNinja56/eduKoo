import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (key: string, value: any): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(value);

    await AsyncStorage.setItem(key, jsonValue);

    console.log('Stored data: ', key, value);
  } catch (e) {
    console.log(e);
  }
};

export const getData = async <T = undefined>(
  key: string,
): Promise<T | undefined> => {
  try {
    const data = await AsyncStorage.getItem(key);

    if (data !== null) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.log(e);
  }
};

export const removeData = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.log(e);
  }
};
