import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import React, { useEffect, useState } from 'react'
import { Button, CardText, Col, Form, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';
import ReactSelect from 'react-select';
import { EmployeeService } from '../../Service/Employee';
import toast from 'react-hot-toast';
import { Controller, useForm } from 'react-hook-form';
import { CalendarService } from '../../Service/Calendar';
import DeleteModel from '../../Common-component/DeleteModel';
import moment from 'moment';

function CalenderMain() {
  const [openLeave, setOpenLeave] = useState(false)
  const { control, handleSubmit, reset } = useForm()
  const [currentUser, setCurrentUser] = useState({id: null, value: null, label: 'Select User'})
  const [userData, setUserData] = useState([ { id: null, value: null, label: 'Select User' } ])
  const [calendarData, setCalendarData] = useState([])
  const [currentdate, setDate] = useState(moment().format('YYYY-MM'))
  const [firstTimeCallApi, setFirstTimeCallApi] = useState(false)
  const [render, setRender] = useState(false)
  const [modalId, setModalId] = useState()
  const [deleteModel, setDeleteModel] = useState(false)

  const employeeList = () => {
    EmployeeService.employeeData()
    .then(res => {
      const data = res?.data?.data?.map((item) => {
        return {id: item?.id, value: item?.id, label: item?.name}
      })
      setUserData(data)
    }).catch((err) => {
        toast.error(err?.response?.data?.message)
    })
  }

  const getCalendarData = (request) => {
    const payload = {date: request}

    CalendarService.allCalendarData(payload)
    .then(res => {
      if (firstTimeCallApi === false) setFirstTimeCallApi(true)
      const data = []
      res?.data?.data?.map((item) => {
        // userData?.map((user) => {
        //   if(item?.employee_id === user?.id) {
            // data.push({ title: item?.reason + ' | ' +  user?.label , start: item?.start, end: item?.end })
            data.push({ title: item?.reason, start: item?.start, end: item?.end, eventId: item?.id, employee_id: item?.employee_id })
        //   }
        // })
      })
      setCalendarData(data)
    }).catch((err) => {
      toast.error(err?.response?.data?.message)
    })
  }
  
  useEffect(() => {
    getCalendarData(currentdate)
  }, [currentdate, render])
  
  useEffect(() => {
    employeeList()
  }, [])

  function handleEventClick(data) {
    setOpenLeave(true)
    setModalId(data?.event?._def?.extendedProps?.eventId)

    CalendarService.editLeave(data?.event?._def?.extendedProps?.eventId)
    .then(res => {
      const obj = res?.data?.data
      userData?.map((item) => {
        if(res?.data?.data?.employee_id === item?.id) {
          obj.employee_id = item
          setCurrentUser(item)
        }
      })
      reset(obj)
    }).catch((err) => {
        toast.error(err?.response?.data?.message)
    })
  }

  function fetchFunction (data) {
    const payload = { ...data, employee_id: data?.employee_id?.id }

    CalendarService[modalId ? 'updateLeave' : 'createLeave'](payload, modalId)
    .then(res => {
      toast.success(res?.data?.message)
      setOpenLeave(false)
      setRender(!render)
    }).catch((err) => {
        toast.error(err?.response?.data?.message)
    })
  }

  const handleMonthChange = () => {
    if (firstTimeCallApi === false) {
      return true
    } else {
      const date = moment(document.getElementsByClassName('fc-toolbar-title')[0].innerText)
      setFirstTimeCallApi(true)
      if (currentdate !== date.format('YYYY-MM')) {
        if (date.format('w') !== 'Invalid date') setDate(date.format('YYYY-MM'))
      }
    }
  }

  useEffect(() => {
    if(!openLeave) {
      reset({employee_id: '', reason: '', start: '', end: ''})
      setModalId()
    }
  }, [openLeave])

  function onDelete() {
    CalendarService.deleteEvent(modalId)
    .then(res => {
      toast.success(res?.data?.message)
      setDeleteModel(false)
      setOpenLeave(false)
      setRender(!render)
    }).catch((err) => toast.error(err?.response?.data?.message))
  }

  return (
    <div className='main-header navbar-light card header-overlap'>
      <DeleteModel
        deleteModel={deleteModel} 
        setDeleteModel={setDeleteModel} 
        title= 'Are you sure?'
        body="You won't be able to revert this!"
        deleteButton={onDelete}
      />
      <section className="content">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin]}
          initialView="dayGridMonth"
          datesSet= {handleMonthChange}
          customButtons= {{
            myCustomButton: { text: 'Add Event', click: () => { setOpenLeave(true) }}
          }}
          events={calendarData}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek myCustomButton'
          }}
          eventClick={handleEventClick}
        />
      </section>
      <Modal isOpen={openLeave} toggle={() => setOpenLeave(!openLeave)} className='modal-dialog-centered modal-md'>
        <ModalHeader className={`bg-white mt-1`}  style={{border: 'none'}} toggle={() => setOpenLeave(!openLeave)}>
            <CardText>Add Event</CardText>
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit(fetchFunction)}>
            <Row>
              <Col md='12' className='form-group'>
                <Label for="user">Employee</Label>
                <Controller name='employee_id' control={control} rules={{ required: { value: true } }}
                  render={({ field }) => (
                    <ReactSelect 
                      id="user"
                      className="react-select"
                      classNamePrefix="select"
                      isClearable={false}
                      isSearchable={true}
                      isDisabled={modalId}
                      options={userData}
                      value={currentUser}
                      onChange={(data) => { 
                        setCurrentUser(data)
                      }}
                      {...field}
                    />
                  )}
                />
              </Col>
              <Col md='12' className='form-group'>
                <Label for="reason">Reason</Label>
                <Controller name='reason' control={control} rules={{ required: { value: true } }}
                  render={({ field }) => (
                    <Input type="text" id="title" className="form-control" placeholder="Enter Reason" {...field} />
                  )}
                />
              </Col>
              <Col md='12' className='form-group'>
                <Label for="start">Start</Label>
                <Controller name='start' control={control} rules={{ required: { value: true } }}
                  render={({ field }) => (
                    <Input type="datetime-local" name="start" id="start" className="form-control" {...field} />
                  )}
                />
              </Col>
              <Col md='12' className='form-group'>
                <Label for="startTime">End</Label>
                <Controller name='end' control={control} rules={{ required: { value: true } }}
                  render={({ field }) => (
                    <Input type="datetime-local" name="end" id="end" className="form-control" {...field} />
                  )}
                />
              </Col>
            </Row>
            <Col md='12' className='mt-3 d-flex justify-content-between'>
              <div>
                <Button color='danger' onClick={() => setDeleteModel(true)}>Delete</Button>
              </div>
              <div>
                <Button color='secondary' className='mr-3' onClick={() => setOpenLeave(!openLeave)}>Cancel</Button>
                <Button color='success' type='submit'>Create</Button>
              </div>
            </Col>
          </Form>
        </ModalBody>
      </Modal>
  </div>
  )
}

export default CalenderMain