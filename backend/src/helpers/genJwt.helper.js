

import jwt from 'jsonwebtoken';
import { SECRETORPRIVATEKEY_JWT } from '../config/index.js';

export const genJWT = id => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { id },
      SECRETORPRIVATEKEY_JWT,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) {
          console.log(err);
          reject('Could not generate token!');
        }

        resolve(token);
      }
    );
  });
};
