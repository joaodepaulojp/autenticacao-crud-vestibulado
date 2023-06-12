import React from 'react'
import {Formik, Form, Field, ErrorMessage} from "formik";
import * as yup from 'yup';
import Axios from 'axios'
import {Link} from 'react-router-dom'

const Reset = () => {

    let query = window.location.search.slice(1);
    let partes = query.split('&');
    let data = {};
    partes.forEach(function (parte) {
        let chaveValor = parte.split('=');
        let chave = chaveValor[0];
        let valor = chaveValor[1];
        data[chave] = valor;
    });

    const handleClickReset = (values) =>{
        
        document.getElementById('submit').setAttribute('disabled', '')

        Axios.post("http://localhost:3001/alter", {
          password: values.password,
          email: data.email,
          validate: data.validate
        }).then(response =>{ 
            const motivo = response.data.msg

            if(motivo === 'successpass'){
                window.location = `/?account=${motivo}`
            }else{
                window.location = `/reset?alter=${motivo}`
            }
        }).catch(err => console.log(err))
      }
      
    const validationReset = yup.object().shape({
        password: yup.string().min(8, "A senha deve ter mais de 8 caracteres").required('Este campo é obrigatório'),
        repeatPassword: yup.string().oneOf([yup.ref("password"), null], "As senhas não são iguais."),
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
                        <h4 className="card-title uppercase">resetar</h4>

                        <Formik
                        initialValues = {{}}
                        onSubmit={handleClickReset}
                        validationSchema={validationReset}
                        >

                            <Form className="my-login-validation" noValidate>
                                <div className="form-group">
                                    <label htmlFor="email">Nova senha</label>
                                    <Field id="password" type="password" className="form-control mb-3" name="password" required autofocus />
                                    {/* <div className="invalid-feedback">
                                    Email is invalid
                                    </div> */}

                                    <ErrorMessage
                                        component="span"
                                        name='password'
                                        className='form-error'
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">Repetir nova senha</label>
                                    <Field id="repeatPassword" type="password" className="form-control mb-3" name="repeatPassword" required autofocus />
                                    {/* <div className="invalid-feedback">
                                    Email is invalid
                                    </div> */}

                                    <ErrorMessage
                                        component="span"
                                        name='repeatPassword'
                                        className='form-error'
                                    />

                                    <div className="form-text text-muted">
                                    Tenha a certeza que sua nova senha é forte e fácil de lembrar.
                                    </div>
                                </div>

                                
                                {data.alter === 'error' &&
                                    <p class="text-danger">
                                        Erro! Por favor solicite um outro link para troca.
                                    </p>
                                }

                                <div className="form-group m-0">
                                    <button id='submit' type="submit" className="btn btn-primary btn-block">
                                    Resetar senha
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

export default Reset