import React from 'react'
import {Formik, Form, Field, ErrorMessage} from "formik";
import * as yup from 'yup';
import Axios from 'axios'
import {Link} from 'react-router-dom'

const Login = () => {

    let query = window.location.search.slice(1);
    let partes = query.split('&');
    let data = {};
    partes.forEach(function (parte) {
        let chaveValor = parte.split('=');
        let chave = chaveValor[0];
        let valor = chaveValor[1];
        data[chave] = valor;
    });

    const handleClickLogin = (values) =>{
        Axios.post("http://localhost:3001/login", {
            email: values.email,
            password: values.password
        }).then(response =>{

            if(response.data.msg === 'sucesso'){
              console.log(response.data.user)
              sessionStorage.setItem('SESSION_USER', JSON.stringify(response.data.user))
              window.location = "/"
            }else{
              const motivo = response.data.msg
              window.location = `/?account=${motivo}`
            }
            
        }).catch(err => console.log(err))
    }

    const validationLogin = yup.object().shape({
        email: yup.string().email('Não é um email').required('Este campo é obrigatório'),
        password: yup.string().required('Este campo é obrigatório')
    })

    return (
        <>
          <section className="h-100">
            <div className="container h-100">
              <div className="row justify-content-md-center h-100">
                <div className="card-wrapper">
                  <div className="brand">
                  </div>
                  <div className="card fat">
                    <div className="card-body">
                      <h4 className="card-title uppercase">Login</h4>
    
                      <Formik
                       initialValues = {{}}
                       onSubmit={handleClickLogin}
                       validationSchema={validationLogin}
                       >
    
                        <Form className="my-login-validation" noValidate>
                          <div className="form-group">
                            <label htmlFor="email">E-mail</label>
                            <Field id="email" type="email" className="form-control" name="email" required autofocus />

                            <ErrorMessage
                              component="span"
                              name='email'
                              className='form-error'
                            />
    
                          </div>
                          <div className="form-group">
                            <label htmlFor="password">Senha</label>
                            <Field id="password" type="password" className="form-control" name="password" required data-eye />
    
                            <ErrorMessage
                              component="span"
                              name='password'
                              className='form-error'
                            />
    
                          </div>

                          {data.register === 'success' &&
                            <p class="text-success">
                              Sua conta foi criada com sucesso!
                            </p>
                          }

                          {data.account === 'incorrect' &&
                            <p class="text-danger">
                              Senha incorreta!
                            </p>
                          }

                          {data.account === 'notfound' &&
                            <p class="text-danger">
                              Conta inexistente!
                            </p>
                          }

                          {data.account === 'successpass' &&
                              <p class="text-success">
                                  Senha alterada!
                              </p>
                          }

                          <div className="form-group">
                            <Link to="/forgot" className="float-left mb-3">
                                  Esqueceu sua senha?
                            </Link>
                          </div> 

                          <div className="form-group m-0">
                            <button type="submit" className="btn btn-primary btn-block">
                              Login
                            </button>
                          </div>
                          <div className="mt-4 text-center">
                            Não tem uma conta? <Link to="/register">Crie uma!</Link>
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
      );
}

export default Login