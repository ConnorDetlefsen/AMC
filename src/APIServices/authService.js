import http from "./httpService";

const apiEndpoint = "https://in-quire-sas-django-4gk0bwieb1.com";

export function login(username, password) {
  return http.post(apiEndpoint, { username, password });
}
