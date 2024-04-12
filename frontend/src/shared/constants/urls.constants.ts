import { getEnvs } from '../utils';

const { VITE_API_URL } = getEnvs();

export const urlAppApi: string = VITE_API_URL;
