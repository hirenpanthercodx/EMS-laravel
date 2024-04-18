import React, { createContext, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import routes from "./routes";
import Main from "../Layouts/Main";
import Default from "../Layouts/Default";
import { UserService } from "../Service/User";
import axios from "axios";

export const FilterDetails = createContext()

const Router = () => {
  const token = localStorage.getItem('token')
  const [flag, setFlag] = useState(false)

  const [filterValue, setFilterValue] = useState({
    tracker_stop: null
  })

  const getLogginInfo = async () => {
    if (localStorage.getItem('userData')) {
      await UserService.userData()
        .then((res) => {
          const userData = JSON.stringify(res.data.data)
          localStorage.setItem('userData', userData)
          setFlag(!flag)
      }).catch((err) => console.log('err', err))
    }
  }

  axios.interceptors.request.use(
    config => {
      const accessToken = localStorage.getItem('token')
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
      }
      return config
    },
    error => Promise.reject(error)
  )

  useEffect(() => {
    getLogginInfo()
  }, [])

  return (
    <BrowserRouter >
      <FilterDetails.Provider value={[filterValue, setFilterValue]}>
        <Routes>
          <Route element={<Main />}>
            {routes
              .filter((el, i) => !el.auth)
              .map((route, i) => {
                const { element: Component, ...rest } = route;
                return (
                  <Route
                    key={i}
                    {...rest}
                    element={
                      <>
                        {Boolean(token) ? (
                            <Component />
                          ) : (
                          <Navigate to="/login" />
                        )}
                      </>
                    }
                  />
                );
              })}
          </Route>
          <Route element={<Default />}>
            {routes
              .filter((el, i) => el.auth)
              .map((route, i) => {
                const { element: Component, ...rest } = route;
                return (
                  <Route
                    key={i}
                    {...rest}
                    element={
                      <>
                        {Boolean(token) ? (
                          <Navigate to="/tracker" />
                          ) : (
                          <Component />
                        )}
                      </>
                    }
                  />
                );
              })}
          </Route>
        </Routes>
      </FilterDetails.Provider>
    </BrowserRouter>
  );
};

export default Router;
