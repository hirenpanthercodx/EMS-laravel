import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Card, CardBody, CardText, Form, Input, Label, Spinner } from 'reactstrap';
import logo from '../../../../public/Image/eleos_logo_36_36.png'
import { AuthService } from '../../Service/Auth';
import toast from 'react-hot-toast';

function Login() {
    const { control, handleSubmit, formState: { errors } } = useForm({})
    const [isErrorMsg, setErrorMsg] = useState(false)
    const [errorMsg, setDynamicErrorMsg] = useState('')
    const [LoaderCall, SetLoaderCall] = useState(false)
    const EmailPattern = /^[a-zA-Z0-9.'’‘’'_%+-]+@[a-zA-Z0-9.'’‘’'-]+\.[a-z]{0,30}$/
    const navigate = useNavigate()
    
    const onSubmit = data => {
        SetLoaderCall(true)
        AuthService.login({ email: data?.email, password: data?.password })
        .then(res => { 
            toast.success(res?.data?.message)
            const data = { user: res?.data?.data?.data?.user, role: res?.data?.data?.data?.role }
            localStorage.setItem('userData', JSON.stringify(data))
            localStorage.setItem('token', res?.data?.data?.token)
            navigate('/')
            location.reload();
        }).catch((err) =>  {
            toast.error(err?.response?.data?.message)
            setErrorMsg(true)
            setDynamicErrorMsg(err?.response?.data?.message)
        })
        .finally(() => SetLoaderCall(false))
    }

  return (
    <div className="auth-wrapper px-2" >
        <div className="my-2">
            <Card className="mb-0 card-login">
                <CardBody>
                    <Link className="mb-3" style={{display: 'flex', justifyContent:'center'}} to="/" onClick={(e) => e.preventDefault()}>
                        <img alt="logo" src={logo} />
                    </Link>
                    <CardText tag="h5" className="mb-1 text-center form-color">Welcome to ELEOS</CardText>
                    <CardText className="mb-2 text-center">
                        {isErrorMsg ? (<span className="text-danger form-color">{errorMsg}</span>) : (<span> Please sign-in to your account </span>) }
                    </CardText>
                    <Form className="auth-login-form mt-3" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <Label className="form-label form-color" for="login-email">Email</Label>
                            <Controller id='email' name='email' control={control}
                                rules={{
                                required: {value: true},
                                pattern: EmailPattern
                                }}
                                render={({ field }) => <Input autoFocus className='form-control' placeholder='john@example.com' invalid={errors.email && true}{...field}/>}
                            />
                            {errors.email && (<small className="text-danger ml-2">Invalid Email Address</small>)}
                        </div>
                        <div className="my-4">
                            <Label className="form-label form-color" for="login-password">Password</Label>
                            <Controller id='password' name='password' control={control}
                                rules={{required: {value: true}}}
                                render={({ field }) => <Input type='password' className='form-control' invalid={errors.password && true} {...field} onChange={(e) => { field.onChange(e.target.value); setErrorMsg(false) }} />}
                            />
                            {errors.password && (<small className="text-danger ml-2">Invalid password</small>)}
                        </div>
                        <div className='mb-2'>
                            <Button color="success" disabled={LoaderCall} block>
                                <> { LoaderCall ? <span> <Spinner size='sm' /> </span> : <span>Sign in</span>  } </>
                            </Button>
                        </div>
                    </Form>
                </CardBody>
            </Card>
        </div>
    </div>
  )
}

export default Login