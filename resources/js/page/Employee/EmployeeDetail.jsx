import React, { Fragment, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import ReactSelect from 'react-select'
import { Button, Col, Form, Input, Label, Row } from 'reactstrap'
import { EmployeeService } from '../../Service/Employee'
import toast from 'react-hot-toast'
import DeleteModel from '../../Common-component/DeleteModel'

function EmployeeDetail() {
    const navigate = useNavigate()
    const { control, handleSubmit, register, reset } = useForm()
    const [currentOccuption, setCurrentOccuption] = useState({value: '', label: 'select'})
    const [changeper, setChangeper] = useState([])
    const [loader, setLoader] = useState(false)
    const [deleteModel, setDeleteModel] = useState(false)
    const {id} = useParams()
    
    const departmentData = [
        {value: '', label: 'select'},
        {value: 'design', label: 'Design'},
        {value: 'frontend', label: 'Frontend'},
        {value: 'backend', label: 'Backend'}
    ]

    const Project = [
        {value: 'eleos22', label: 'Eleos22'},
        {value: 'shoptell', label: 'Shoptell'},
        {value: 'eleos1', label: 'Eleos1'}
    ]

    const allSelectCheckbox = (e) => {
        let UpdateList = [...changeper]
        if (e.target.checked) UpdateList = [...changeper, e?.target?.id]
        else UpdateList.splice(changeper.indexOf(e?.target?.id), 1)
        setChangeper(UpdateList) 
    }
    
    const fetchFunction = (data) => {
        setLoader(true)
        const payload = {
            name: data?.name,
            email: data?.email,
            gender: data?.gender,
            department: data?.department?.value,
            project: changeper
        }
        EmployeeService[id ? 'update' : 'store'](payload, id)
        .then(res => { 
            toast.success(res?.data?.message)
            navigate('/employee')
        }).catch((err) =>  {
            toast.error(err?.response?.data?.message)
        })
        .finally(() => setLoader(false))
    }

    const editData = () => {
        EmployeeService.editEmployee(id)
        .then(res => { 
            const obj = {
                name: res?.data?.data?.name,
                email: res?.data?.data?.email,
                gender: res?.data?.data?.gender,
                employee_id: res?.data?.data?.employee_id
            }
            departmentData?.map((item) => {
                if (item?.value === res?.data?.data?.department) {
                    obj.department = item
                    setCurrentOccuption(item)
                }
            })
            setChangeper(JSON.parse(res?.data?.data?.project))
            reset(obj)
        }).catch((err) =>  {
            toast.error(err?.response?.data?.message)
        })
        // .finally(() => SetLoaderCall(false))
    }

    useEffect(() => {
        if (id) editData()
    }, [id])

    const onDelete = () => {
        EmployeeService.deleteEmployee(id)
        .then(res => { 
            toast.success(res?.data?.message)
            navigate('/employee')
        }).catch((err) =>  {
            toast.error(err?.response?.data?.message)
        })
    }

  return (
    <Fragment>
        <DeleteModel 
            deleteModel={deleteModel} 
            setDeleteModel={setDeleteModel} 
            title= 'Are you sure?'
            body="You won't be able to revert this!"
            deleteButton={onDelete}
        />
        <div className='main-header navbar-light card p-3'>
            <div className="d-flex mb-4">
                <button className='btn btn-outline-secondary mr-4' onClick={() => navigate('/employee')}>Back</button>
                <h4 className='mb-0 d-flex align-items-center'>Insert Record</h4>
            </div>
            <Form onSubmit={handleSubmit(fetchFunction)}>
                <Row>
                    <Col md="6" className='mb-4'>
                        <Label className="form-label" for="name">Name</Label>
                        <Controller name='name' control={control} rules={{ required: { value: true }}}
                            render={({ field }) => (
                                <Input type="text" placeholder="Enter First name" {...field} required />
                            )}
                        />
                    </Col>
                    {id &&
                        <Col md="6">
                            <Label className="form-label" for="employee_id">Id</Label>
                            <Controller name='employee_id' control={control} rules={{ required: { value: false }}}
                                render={({ field }) => (
                                    <Input type="text" {...field} disabled />
                                )}
                            />
                        </Col>
                    }
                    <Col md="6">
                        <Label className="form-label" for="Email">Email</Label>
                        <Controller name='email' control={control} rules={{ required: { value: true }}}
                            render={({ field }) => (
                                <Input type="email" placeholder="Enter Email" {...field} required />
                            )}
                        />
                    </Col>
                    <Col md="6" className='mb-4'>
                        <Label className="form-label">Gender</Label>
                        <div className='d-flex'>
                            <div className='ps-4' style={{width: '100px'}}>
                                <input type="radio" className='form-check-input' name='gender' value='male' {...register('gender')} required/>
                                <Label className="form-check-label" for="male">Male</Label>
                            </div>
                            <div>
                                <input type="radio" className='form-check-input' name='gender' value='female' {...register('gender')} required/>
                                <Label className="form-check-label" for="female">Female</Label>
                            </div>
                        </div>
                    </Col>
                    <Col md="6">
                        <Label className="form-label" for="department">Department</Label>
                        <Controller name='department' control={control} rules={{ required: { value: false }}}
                            render={({ field: { onChange } }) => (
                                <ReactSelect
                                    id="department"
                                    className="react-select"
                                    classNamePrefix="select"
                                    isClearable={false}
                                    isSearchable={false}
                                    options={departmentData}
                                    value={currentOccuption}
                                    onChange={(data) => { 
                                        onChange(data)
                                        setCurrentOccuption(data)
                                    }}
                                />                            
                            )}
                        />
                    </Col>
                    <Col md="6">
                        <Label className="form-label" for="hobby">Project</Label>
                        <div>
                            {Project?.map((item, i) => {     
                                return(
                                    <div className='form-check form-check-inline mb-1' key={i}> 
                                        <Label for='basic-cb-checked' className='form-check-label'>{item?.label}</Label>
                                        <Input type='checkbox' id={item?.value} value={item?.value} checked={changeper?.includes(item?.value)} onChange={e => allSelectCheckbox(e)}/>
                                    </div>
                                )
                            })}
                        </div>
                    </Col>
                </Row>
                <div className="d-flex justify-content-end my-3">
                    <Button className='btn btn-danger mr-3' disabled={loader} onClick={() => setDeleteModel(true)}>Delete</Button>
                    <Button type="submit" className='btn btn-success' disabled={loader}>{id ? 'Update' : 'create'}</Button>
                </div>
            </Form>
        </div>
    </Fragment>
  )
}

export default EmployeeDetail