import http from "./httpService";

const apiEndpoint = "https://in-quire-eas-django-kjqw3hka1.com/";

export function login(username, password) {
  return http.post(apiEndpoint, { username, password });
}
