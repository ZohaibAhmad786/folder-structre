
controller = new AbortController();
const CancelToken = axios.CancelToken;
source = CancelToken.source();
client = axios.create({
  baseURL: services.base_url,
});


//Axios Interceptors
client.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('@token');
    const language = await AsyncStorage.getItem('@language');
    config.headers = {
      Accept: 'application/json',
      'Cache-Control': 'no-cache',
      'Content-Type': 'multipart/form-data, application/json',
    };

    config.params = config.params || {};
    config.cancelToken = source.token || {};
    config.signal= controller.signal;
    if (JSON.parse(token)) {
      config.headers['Authorization'] =
        `Bearer ` + JSON.parse(token)?.access_token;
    }
    if (language) {
      config.headers['Accept-Language'] = language;
    }
    return config;
  },
  error => {
    console.log('I am here');
    Promise.reject(error);
  },
);

client.interceptors.response.use(
  response => {
    // AsyncStorage.clear();

    console.log('RESPONSE INTERCPTOR : ', response?.status);
    return response;
  },
  async function (error) {
    console.log('INTERCEPTOR ERROR RESPONSE : ', error?.response?.status);
    console.log('INTERCEPTOR ERROR RESPONSE CONFIG: ', error?.config);
    const token = await AsyncStorage.getItem('@token');

    const originalRequest = error.config;
    if (error?.response?.status === undefined && error?.config === undefined) {
      return Promise.reject('Hi Dude');
    } else if (error?.response?.status === 401) {
      originalRequest._retry = true;
      const tokenInfo = await RECIPE_API.tokenRefresh(
        JSON.parse(token)?.refresh_token,
      );
      console.log('Token info: ', tokenInfo);
      if (tokenInfo) {
        await AsyncStorage.setItem('@token', JSON.stringify(tokenInfo));
        axios.defaults.headers.common['Authorization'] =
          'Bearer ' + tokenInfo?.access_token;
        return client(originalRequest);
      } else {
        AsyncStorage.multiRemove(['@token']).then(res => {
          // props.navigation.navigate('signIn');
          global.navigation.reset({index: 0, routes: [{name: 'signin'}]});
        });
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);


