import ky from 'ky';

const apiClient = ky.create({ prefixUrl: '/api/v1' });

export default apiClient;