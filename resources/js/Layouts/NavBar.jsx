import React, { useEffect, useState } from 'react'
import { AuthService } from '../Service/Auth'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button, Input } from 'reactstrap'
import { TrackerService } from '../Service/Tracker'
import toast from 'react-hot-toast'
import DeleteModel from '../Common-component/DeleteModel'
import { Icon } from '@iconify/react'

function NavBar() {
    const navigate = useNavigate()
    const userData = JSON.parse(localStorage.getItem('userData'))
    const location = useLocation()
    const [componentName, setComponentName] = useState()
    const [timerOn, setTimerOn] = useState(false);
    const [openNotes, setOpenNotes] = useState(false)
    const [notes, setNotes] = useState('')
    const [task, setTask] = useState({
        time: 0,
        dateStart: 0,
        dateEnd: 0,
        lastRecordTime: Number(localStorage.getItem('lastRecordTime') || 0),
        startTime: 0
    });

    const locationName = {
        calendar: 'Calendar',
        employee: 'Employee',
        tracker: 'Tracker'
    }

    const logout = () => {
        AuthService.logout().then(() => {
            navigate('/login')
            window.location.reload();
            localStorage.removeItem('userData')
            localStorage.removeItem('token')
          })
          .catch(() => {
            navigate('/login')
            localStorage.removeItem('userData')
            localStorage.removeItem('token')
          })
    }

    useEffect(() => {
        setComponentName(locationName[location.pathname.split('/')[1]])
    }, [location.pathname.split('/')[1]])

    const timeConverter = (time) => {
        return `${('0' + Math.floor((time / 3600000) % 60)).slice(-2)}:${(
          '0' + Math.floor((time / 60000) % 60)
        ).slice(-2)}:${('0' + Math.floor((time / 1000) % 60)).slice(-2)}`;
    };

    const startHandler = () => {
        setTimerOn(true);
        setTask({
            //   time: task.time,
            startTime: task.lastRecordTime,
            lastRecordTime: task.lastRecordTime,
            dateStart: new Date().getTime(),
        });
        localStorage.setItem('tracker', true)
    };

    const stopHandler = () => {
        // setTimerOn(false);
        const data = task;
        data.user_id = userData?.user?.id
        data.time = task.lastRecordTime - task.startTime
        data.startTime = task.lastRecordTime
        data.lastRecordTime = task.lastRecordTime
        data.description = notes
        data.dateStart =  new Date(task.dateStart)
        data.dateEnd = new Date()
        
        setTask(data);
        setOpenNotes(false);
        TrackerService.saveTracker(data)
        .then((res) => {
            toast.success(res?.data?.message)
            localStorage.setItem('tracker', false)
        })
        .catch((err) => toast.error(err?.response?.data?.message))
    };

    useEffect(() => {
        if (task?.lastRecordTime) {
            if (((task?.lastRecordTime - task?.startTime) /1000) === 600) stopHandler()
    
            if ((task?.lastRecordTime / 1000) === 28800) {
                setTimerOn(false)
                stopHandler()
                TrackerService.sendNotificationTracker()
                .then((res) => {
                    toast.success(res?.data?.message)
                })
                .catch((err) => toast.error(err?.response?.data?.message))
            }
            localStorage.setItem('lastRecordTime', Number(task?.lastRecordTime))
        }
    }, [task])
    

    useEffect(() => {
        let interval;
    
        if (timerOn) {
          interval = setInterval(() => {
            setTask((prevTask) => {
              return {
                // time: prevTask.time + 1000,
                startTime: prevTask.startTime,
                lastRecordTime: prevTask.lastRecordTime + 1000,
                dateStart: task.dateStart,
              };
            });
          }, 1000);
        } else if (!timerOn) {
        //   clearInterval(interval);
        }
   
        return () => clearInterval(interval);
    }, [timerOn, task.description, task.dateStart]);

    useEffect(() => {
        if (localStorage.getItem('tracker') === 'true') startHandler()

        if (location.pathname.split('/')[1] === '') navigate('/tracker')
    }, [])
    
    return (
        <>
            <DeleteModel 
                deleteModel={openNotes} 
                setDeleteModel={() => {setOpenNotes(false); stopHandler()}}
                yes={'Save'} 
                ifNo={false}
                title= 'Task Description'
                body={
                    <>
                        <Input type='text' onChange={(e) => setNotes(e?.target?.value)} />
                    </>
                }
                deleteButton={stopHandler}
            />
            <nav className="main-header navbar navbar-expand navbar-white navbar-light px-3 my-3" style={{borderRadius: '7px'}}>
                <div className="col-6">
                    <h3>{componentName}</h3>
                </div>
                <div className="col-6 d-flex justify-content-end">
                    <div className='d-flex mr-2'>
                        <div className="mr-3 d-flex align-items-center">
                            {timeConverter(task.lastRecordTime)}
                        </div>
                        <div>
                            {timerOn && 
                                <div style={{padding: '14px', backgroundColor: '#fd7179', borderRadius: '50%', cursor: 'pointer'}} 
                                    data-toggle="tooltip" data-placement="top" title="Stop Tracker"
                                    onClick={() => { setTimerOn(false); setOpenNotes(true) }}>
                                    <Icon icon="ph:square-thin" width={10} style={{color: 'white', backgroundColor: 'white'}} />
                                </div>
                            }
                            {!timerOn && 
                                <div style={{padding: '10px', backgroundColor: '#bcbaba', borderRadius: '50%', cursor: 'pointer'}} 
                                    data-toggle="tooltip" data-placement="top" title="Start Tracker"
                                    onClick={startHandler} >
                                    <Icon icon="ph:play-fill" width={20} />
                                </div>
                            }
                        </div>
                    </div>
                    <div className="dropdown" style={{width: '50px'}}>
                        <a className="nav-link d-flex align-items-center justify-content-center" data-toggle="dropdown" href="#">
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
                    </div>
                </div>
            </nav>

        </>
    )
}

export default NavBar