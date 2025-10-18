export const fetchConToken = (url, method = 'GET', body = null) => {
const token = localStorage.getItem('accessToken');

const headers = {
    'Content-Type': 'application/json',
};

if (token) {
    headers['Authorization'] = `Bearer ${token}`;
}

const config = {
    method,
    headers,
};

if (body) {
    config.body = JSON.stringify(body);
}

return fetch(`http://localhost:4002${url}`, config)
    .then(response => {
    if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        }
        throw new Error('Respuesta de red no fue exitosa');
    }
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json();
    } else {
        return {};
    }
    });
};