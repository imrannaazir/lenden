import bcrypt from 'bcrypt';
import config from '../../config';

export const hashPin = async (pin: string) => {
  try {
    return await bcrypt.hash(pin, Number(config.salt_rounds));
  } catch (error) {
    console.log(error);
  }
};
