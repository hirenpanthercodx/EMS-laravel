import React, { useEffect, useState } from 'react'
import { AuthService } from '../Service/Auth'
import { useLocation, useNavigate } from 'react-router-dom'

function NavBar() {
    const navigate = useNavigate()
    const location = useLocation()
    const [componentName, setComponentName] = useState()

    const locationName = {
        calendar: 'Calendar',
        employee: 'Employee'
    }

    const logout = () => {
        AuthService.logout().then(() => {
            navigate('/login')
            localStorage.removeItem('userData')
            localStorage.removeItem('token')
          })
          .catch(() => {
            localStorage.removeItem('userData')
            localStorage.removeItem('token')
            navigate('/login')
          })
    }

    useEffect(() => {
        setComponentName(locationName[location.pathname.split('/')[1]])
    }, [location.pathname.split('/')[1]])
    

    return (
        <>
            <nav className="main-header navbar navbar-expand navbar-white navbar-light px-3 my-3" style={{borderRadius: '7px'}}>
                <ul className="navbar-nav">
                    <h3>{componentName}</h3>
                </ul>
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item dropdown">
                        <a className="nav-link" data-toggle="dropdown" href="#">
                            <i className="fas fa-th-large" />
                        </a>
                        <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right p-0">
                            <a href="#" className="dropdown-item">
                                <i className="fas fa-envelope mr-2" />Profile
                            </a>
                            <div className="dropdown-divider" />
                            <a href="#" className="dropdown-item" onClick={() => logout()}>
                                <i className="fas fa-users mr-2" />LogOut
                            </a>
                        </div>
                    </li>
                </ul>
            </nav>

        </>
    )
}

export default NavBar