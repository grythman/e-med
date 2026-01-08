import api from './api';

export const certificateService = {
  /**
   * Get user's certificates
   */
  async getMyCertificates() {
    const response = await api.get('/certificates');
    return response.data.certificates;
  },

  /**
   * Get certificate by ID
   */
  async getCertificateById(id) {
    const response = await api.get(`/certificates/${id}`);
    return response.data.certificate;
  },

  /**
   * Verify certificate by code (public)
   */
  async verifyCertificate(code) {
    const response = await api.get(`/certificates/verify/${code}`);
    return response.data;
  },

  /**
   * Download certificate PDF
   */
  async downloadCertificate(id) {
    const response = await api.post(`/certificates/${id}/download`);
    return response.data;
  },

  /**
   * Generate certificate for completed course
   */
  async generateCertificate(enrollmentId) {
    const response = await api.post(`/certificates/generate/${enrollmentId}`);
    return response.data.certificate;
  },
};

