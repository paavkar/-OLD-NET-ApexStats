import axios from "axios";
const baseUrl = 'api/br';

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

export default { getAll };