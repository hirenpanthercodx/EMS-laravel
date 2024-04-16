import React, { useEffect, useState } from 'react'
import { AuthService } from '../Service/Auth'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button, Input } from 'reactstrap'
import { TrackerService } from '../Service/Tracker'
import toast from 'react-hot-toast'
import DeleteModel from '../Common-component/DeleteModel'

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
        lastRecordTime: 0,
        startTime: 0
    });

    const locationName = {
        calendar: 'Calendar',
        employee: 'Employee'
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

    const dateTimeConverter = (inputDate) => {
        const date = new Date(inputDate);
        const [month, day, year] = [date.getMonth(), date.getDate(), date.getFullYear()];
        const [hour, minutes] = [date.getHours(), date.getMinutes()];
        return `${('0' + day).slice(-2)}.${('0' + (month + 1)).slice(-2)}.${year} ${('0' + hour).slice(-2)}:${('0' + minutes).slice(-2)}`;
    };

    const startHandler = () => {
        setTimerOn(true);
        setTask({
        //   time: task.time,
            startTime: task.lastRecordTime,
            lastRecordTime: task.lastRecordTime,
            dateStart: new Date().getTime(),
        });
    };

    const stopHandler = () => {
        // setTimerOn(false);
        const data = task;
        data.user_id = userData?.user?.id
        data.time = (task.lastRecordTime - task.startTime) / 1000
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
        })
        .catch((err) => toast.error(err?.response?.data?.message))
    };

    useEffect(() => {
        if (((task?.lastRecordTime - task?.startTime) /1000) === 60) stopHandler()

        if (task?.lastRecordTime === 28800) {
            setTimerOn(false)
            stopHandler()
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
        const date = {date: moment(new Date()).format('YYYY-MM-DD')}
        TrackerService.getTrackerDetail(date)
        .then((res) => {
            const data = res?.data[res?.data?.length - 1]

            setTask({ lastRecordTime: Number(data?.lastRecordTime || 0)  });
        })
        .catch((err) => toast.error(err?.response?.data?.message))
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
                            {!timerOn && 
                                <Button className='btn-success' onClick={startHandler}>
                                    Start Tracking
                                </Button>
                            }
                            {timerOn && 
                                <Button className='btn-danger' onClick={() => { setTimerOn(false); setOpenNotes(true) }}>
                                    Stop Tracking
                                </Button>
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