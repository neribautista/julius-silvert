import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('silvUser') || 'null');
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  return config;
});

// Auto-logout on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('silvUser');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login',    data),
  me:       ()     => api.get('/auth/me'),
  profile:  (data) => api.put('/auth/profile',   data),
};

export const productsAPI = {
  list:   (params) => api.get('/products',    { params }),
  single: (id)     => api.get(`/products/${id}`),
  create: (data)   => api.post('/products',   data),
  update: (id, d)  => api.put(`/products/${id}`, d),
  remove: (id)     => api.delete(`/products/${id}`),
};

export const cartAPI = {
  get:    ()           => api.get('/cart'),
  add:    (productId, quantity) => api.post('/cart', { productId, quantity }),
  remove: (productId)  => api.delete(`/cart/${productId}`),
  clear:  ()           => api.delete('/cart'),
};

export const ordersAPI = {
  place:  (data) => api.post('/orders',      data),
  mine:   ()     => api.get('/orders/mine'),
  single: (id)   => api.get(`/orders/${id}`),
  all:    ()     => api.get('/orders'),
  status: (id, status) => api.put(`/orders/${id}/status`, { status }),
};

export default api;
