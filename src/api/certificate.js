import axiosClient from './axiosClient'

export const addCertificate = async (certificateData) => {
  const response = await axiosClient.post('/cert/add', certificateData)
  return response.data
}

export const addCertificateWithFile = async (formData) => {
  const response = await axiosClient.post('/cert/addcertificate', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response.data
}

export const getCertificatesByUser = async (userid) => {
  const response = await axiosClient.get(`/cert/viewcertsbyuser/${userid}`)
  return response.data
}

export const downloadCertificate = async (id) => {
  const response = await axiosClient.get(`/cert/displaycertificate?id=${id}`, {
    responseType: 'blob'
  })
  return response.data
}

export const updateCertificate = async (formData) => {
  const response = await axiosClient.put('/cert/updatecertificate', formData)
  return response.data
}

export const deleteCertificate = async (certName, userid) => {
  const response = await axiosClient.delete(`/cert/delete/${certName}/${userid}`)
  return response.data
}
