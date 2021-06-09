import { useEffect, useMemo, useState } from 'react';
import { addGlobalRequestInterceptor, addGlobalResponseInterceptor, removeGlobalRequestInterceptor, removeGlobalResponseInterceptor } from '../../util/http';
import LoadingContext from './LoadingContext';

const LoadingProvider = (props) => {
  const [loading, setLoading] = useState(false);
  const [requestCount, setRequestCount] = useState(0);

  useMemo(() => {
    let subscribed = true;

    const requestIds = addGlobalRequestInterceptor(config => {
      if (subscribed && !config.headers.hasOwnProperty('x-ignore-loading')) {
        setLoading(true);
        incrementRequestCount();
      }
      return config;
    });

    const responseIds = addGlobalResponseInterceptor(response => {
      if (subscribed && !response.config.headers.hasOwnProperty('x-ignore-loading')) {
        decrementRequestCount();
      }
      return response;
    }, error => {
      if (subscribed && !error.config.headers.hasOwnProperty('x-ignore-loading')) {
        decrementRequestCount();
      }
      return Promise.reject(error);
    });

    return () => {
      subscribed = false;
      removeGlobalRequestInterceptor(requestIds);
      removeGlobalResponseInterceptor(responseIds);
    }
  }, [true]);

  useEffect(() => {
    if (!requestCount) {
      setLoading(false);
    }
  }, [requestCount]);

  function incrementRequestCount() {
    setRequestCount(previous => previous + 1);
  }

  function decrementRequestCount() {
    setRequestCount(previous => previous - 1);
  }

  return (
    <LoadingContext.Provider value={ loading }>
      { props.children }
    </LoadingContext.Provider>
  );
};

export default LoadingProvider;