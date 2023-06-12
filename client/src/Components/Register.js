import React from 'react'
import {Formik, Form, Field, ErrorMessage} from "formik";
import * as yup from 'yup';
import Axios from 'axios'
import {Link} from 'react-router-dom'

const Register = () => {

    let query = window.location.search.slice(1);
    let partes = query.split('&');
    let data = {};
    partes.forEach(function (parte) {
        let chaveValor = parte.split('=');
        let chave = chaveValor[0];
        let valor = chaveValor[1];
        data[chave] = valor;
    });

    const handleClickRegister = (values) =>{
        Axios.post("http://localhost:3001/register", {
          email: values.email,
          password: values.password,
          name: values.name
        }).then(response =>{
          if(response.data.msg === 'sucesso'){
            window.location = '/?register=success'
          }else{
            const motivo = response.data.msg
            window.location = `/register?register=${motivo}`
          }
        }).catch(err => console.log(err))
      }
      
      const validationRegister = yup.object().shape({
        email: yup.string().email('Não é um email').required('Este campo é obrigatório'),
        password: yup.string().min(8, "A senha deve ter mais de 8 caracteres").required('Este campo é obrigatório'),
        confirmPassword: yup.string().oneOf([yup.ref("password"), null], "As senhas não são iguais."),
        name: yup.string().max(30, "Limite de caracteres atingido (30).").required('Este campo é obrigatório')
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
                      <h4 className="card-title uppercase" >Registrar</h4>
    
                      <Formik
                       initialValues = {{}}
                       onSubmit={handleClickRegister}
                       validationSchema={validationRegister}
                       >
    
                        <Form className="my-login-validation" noValidate>
                          <div className="form-group">
                            <label htmlFor="name">Nome</label>
                            <Field id="name" type="text" className="form-control" name="name" required autofocus />
                            {/* <div className="invalid-feedback">
                              Email is invalid
                            </div> */}
    
                            <ErrorMessage
                              component="span"
                              name='name'
                              className='form-error'
                            />
                          </div>
                          <div className="form-group">
                            <label htmlFor="email">E-mail</label>
                            <Field id="email" type="email" className="form-control" name="email" required autofocus />
                            {/* <div className="invalid-feedback">
                              Email is invalid
                            </div> */}
    
                            <ErrorMessage
                              component="span"
                              name='email'
                              className='form-error'
                            />
    
                          </div>
                          <div className="form-group">
                            <label htmlFor="password">Senha</label>
                            <Field id="password" type="password" className="form-control" name="password" required data-eye />
    
                            {/* <div className="invalid-feedback">
                              Password is required
                            </div> */}
    
                            <ErrorMessage
                              component="span"
                              name='password'
                              className='form-error'
                            />
                          </div>
    
                          <div className="form-group">
                            <label htmlFor="confirmPassword">Repetir senha</label>
                            <Field id="confirmPassword" type="password" className="form-control" name="confirmPassword" required data-eye />
    
                            {/* <div className="invalid-feedback">
                              Password is required
                            </div> */}
    
                            <ErrorMessage
                              component="span"
                              name='confirmPassword'
                              className='form-error'
                            />
                          </div>

                          {data.register === 'existent' &&
                            <p class="text-danger">
                              Conta com email ja existente!
                            </p>
                          }
    
    
                          {/* <div className="form-group">
                            <div className="custom-checkbox custom-control">
                              <input type="checkbox" name="remember" id="remember" className="custom-control-input" />
                              <label htmlFor="remember" className="custom-control-label">Remember Me</label>
                            </div>
                          </div> */}

                          <div className="form-group mt-5">
                            <button type="submit" className="btn btn-primary btn-block">
                              Registrar
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
      );
}

export default Register