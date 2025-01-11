import ky from 'ky'

const apiClient = ky.create({ prefixUrl: '/api/v1', retry: 0 })

export default apiClient