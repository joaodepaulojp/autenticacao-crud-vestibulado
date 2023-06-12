import React from 'react'
import Axios from 'axios'
import {useState} from 'react'

const User = (props) => {

  const [img, setImg] = useState()

  const deleteSession = () =>{
    sessionStorage.removeItem('SESSION_USER')
    window.location = '/'
  }

  let query = window.location.search.slice(1);
  let partes = query.split('&');
  let data = {};
  partes.forEach(function (parte) {
      let chaveValor = parte.split('=');
      let chave = chaveValor[0];
      let valor = chaveValor[1];
      data[chave] = valor;
  });

  const imagem = () => {

    const userId = JSON.parse(sessionStorage.getItem('SESSION_USER')).id_user

    Axios.post('http://localhost:3001/getimg', {
      id: userId
    }).then(response =>{
      setImg(response.data.routeimg)
    }).catch(err => console.log(err) )

  }

  const alterarFoto = () => {

    const tamanho = 3145728 //3MB  

    let file = document.getElementById("foto");
    const foto = file.files[0]

    if(foto !== undefined){
      let size = foto.size;
      console.log(foto)

      if(foto.type === 'image/png' || foto.type === 'image/jpg' || foto.type === 'image/jpeg'){
        if(size <= tamanho) {        
          const formData = new FormData(); //criando um formData implementando o arquivo e o nome do usuario para enviar para o back-end
          formData.append("file", foto);
          formData.append("user", props.user);
          formData.append("id", props.id);

          Axios.post("http://localhost:3001/arquivo", formData, {
            headers: {
            "Content-Type": `multipart/form-data; boundary=${formData._boundary}`, // isso aq pega o multipart/form-data, sem isso nao da pra reconhecer o file
            }})
          .then(response =>{
            console.log(response.data) // success
            window.location = "/"
          }).catch(err =>{
            console.log(err)
          })

        }else{           
          window.location = `/?file=maxtam`; //Acima do limite permitido
          // file.value = ""; //Limpa o campo          
        }
      }else{
        window.location = `/?file=notformat`
      }
    }else{
      window.location = `/?file=nofile`
    }
  }
 
  return ( 
    <>
      <section className="h-100">
        <div className="container h-100">
          <div className="row justify-content-center h-100">
            <div className="card-wrapper">
              <div className="brand">
              </div>
              <div className="card fat">
                <div className="card-body">
                  <h4 className="card-title uppercase">Bem vindo!</h4>

                  <div className='img-user row justify-content-center mb-4'>
                    <img onLoad={imagem()} src={img} width="150px" height="150px" style={{background: "#6C757D"}}/>
                  </div>

                  <div className='name-user row justify-content-center uppercase'>
                    {props.user}
                  </div>

                  <div className='user-buttons row justify-content-center mt-3' >

                    <input type="file" name="foto" id="foto" className='mt-4' accept=".jpeg,.jpg,.png,.jfif"/>

                    <p class="text-muted m-2">
                      Máximo 3MB, aceita somente PNG, JPG, JPEG e JFIF.
                    </p>

                    {data.file === 'maxtam' &&
                        <p class="text-danger">
                            Arquivo maior do que o tamanho permitido.
                        </p>
                    }

                    {data.file === 'notformat' &&
                      <p class="text-danger">
                          Formato de arquivo não permitido.
                      </p>
                    }

                    {data.file === 'nofile' &&
                        <p class="text-danger">
                            Nenhum arquivo foi selecionado.
                        </p>
                    }   

                    <button onClick={alterarFoto} type="button" className="btn btn-secondary btn-block mt-2">
                      Alterar foto
                    </button>
                    <button onClick={deleteSession} type="button" className="btn btn-primary btn-block mt-4">
                      Logoff
                    </button>
                  </div>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  );


}

export default User



