import React from 'react'
import {Formik, Form, Field, ErrorMessage} from "formik";
import * as yup from 'yup';
import Axios from 'axios'
import {Link} from 'react-router-dom'


const Forgot = () => {

    let query = window.location.search.slice(1);
    let partes = query.split('&');
    let data = {};
    partes.forEach(function (parte) {
        let chaveValor = parte.split('=');
        let chave = chaveValor[0];
        let valor = chaveValor[1];
        data[chave] = valor;
    });

    const handleClickForgot = (values) =>{

        document.getElementById('submit').setAttribute('disabled', '')

        Axios.post("http://localhost:3001/verify", {
            email: values.email,
        }).then(response =>{
            
            const motivo = response.data.msg

            if(motivo === 'requisitado'){
                if(response.data.url !== undefined){
                    alert('Entre nesse link: ' + response.data.url)
                    window.location = `/forgot?email=success`
                }else{
                    window.location = `/forgot?email=error`
                }  
            }else{
                window.location = `/forgot?email=${motivo}`
            }

            
        }).catch(err => console.log(err))
    }

    const validationForgot = yup.object().shape({
        email: yup.string().email('Não é um email').required('Este campo é obrigatório'),
    })

  return (
    <> 
        <section className="h-100">
            <div className="container h-100">
                <div className="row justify-content-md-center align-items-center h-100">
                <div className="card-wrapper">
                    <div className="brand">
                    </div>
                    <div className="card fat">
                    <div className="card-body">
                        <h4 className="card-title uppercase">Esqueceu?</h4>

                        <Formik
                        initialValues = {{}}
                        onSubmit={handleClickForgot}
                        validationSchema={validationForgot}
                        >

                            <Form className="my-login-validation" noValidate>
                                <div className="form-group">
                                    <label htmlFor="email">E-mail</label>
                                    <Field id="email" type="email" className="form-control mb-3" name="email" required autofocus />
                                    {/* <div className="invalid-feedback">
                                    Email is invalid
                                    </div> */}

                                    <ErrorMessage
                                        component="span"
                                        name='email'
                                        className='form-error'
                                    />

                                    {data.email === 'inexistent' &&
                                        <p class="text-danger">
                                            Conta com email inexistente!
                                        </p>
                                    }

                                    {data.email === 'error' &&
                                        <p class="text-danger">
                                            ERRO! Email não foi enviado.
                                        </p>
                                    }

                                    {data.email === 'success' &&
                                        <p class="text-success">
                                            Email enviado!
                                        </p>
                                    }

                                    <div className="form-text text-muted">
                                    Clicando em "Enviar e-mail" enviaremos um link em seu e-mail para alterar sua senha.
                                    </div>
                                </div>
                                <div className="form-group m-0">
                                    <button id='submit' type="submit" className="btn btn-primary btn-block">
                                    Enviar e-mail
                                    </button>
                                </div>

                                <div className="mt-4 text-center">
                                Já tem uma conta? <Link to="/">Faça login!</Link>
                                </div>
                            </Form>

                        </Formik>
                    </div>
                    </div>
                </div>
                </div>
            </div>
        </section>
    </>
  )
}

export default Forgot