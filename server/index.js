const express = require("express");
const app = express();
const mysql = require("mysql2")
const cors = require('cors');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const Axios = require("axios");
const nodemailer = require("nodemailer");
const createHash = require("hash-generator")
const moment = require('moment')
require('dotenv').config()

moment.locale('pt-br')

const fs = require('fs');
const path =  require('path');
const multer =  require('multer');

const db = mysql.createConnection({ //variaveis de ambiente, arquivo .env
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

app.use(express.json());
app.use(cors());
app.use('/arquivos', express.static('arquivos'))// com esse link aqui consigo ter acesso às fotos da pasta arquivos

app.post("/register", (req, res) => {

    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;

    db.query("SELECT * FROM usuarios WHERE email = ?", [email],
    (err, result) =>{
        if(err){
            res.send(err)
        }

        if(result.length == 0){ // ira verificar se tem algum email ou nao
            bcrypt.hash(password, saltRounds, (err, hash) =>{
                db.query("INSERT INTO usuarios (nome, email, password) VALUES (?, ?, ?)", [name, email, hash], (err, result) =>{
                    if(err){
                        res.send(err)
                    }
    
                    res.send({msg: "sucesso"})
    
                })
                
            })

        }else{
            res.send({msg: "existent"})
        }

    })

})

app.post("/login", (req, res) => {

    const email = req.body.email;
    const password = req.body.password;
    const hash = createHash(16);

    db.query("SELECT * FROM usuarios WHERE email = ?", [email],
    (err, result) =>{
        if(err){
            res.send(err)
        }

        if(result.length > 0){

            const nome = result[0].nome;
            const id_user = result[0].idusuarios
            bcrypt.compare(password, result[0].password, (error, result)=>{
                if(result){ //retorna true ou false
                    res.send({msg: "sucesso", user:{email, hash, nome, id_user}})
                }else{
                    res.send({msg: "incorrect"})
                }
            })
            
        }else{
            res.send({msg: "notfound"})
        }

        
    })

})


app.post("/verify", (req, res) => {

    const email = req.body.email;

    db.query("SELECT * FROM usuarios WHERE email = ?", [email],
    (err, result) =>{
        if(err){
            res.send(err)
        }
        if(result.length > 0){
            //tratativa smtp para enviar o email com um link do reset passando o parametro EMAIL
            Axios.post("http://localhost:3001/sendemail", {
                email: email,
            }).then(response =>{ 
                console.log(response.data.url)
                res.send({msg: "requisitado", url: response.data.url})
            }).catch(err => console.log(err))

        }else{
            res.send({msg: "inexistent"})
        }

        
    })

})

//Enviar um email com a lib nodemailer e utilizando um fake smtp do etheral email
//Periodicamente o SMTP expira e terá que trocar, https://ethereal.email/

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    secure: false,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    },

    tls: {
        rejectUnauthorized: false
    }
});


app.post("/sendemail", (req, res) => {

    const email = req.body.email;
    const hash = createHash(16);

    db.query(`UPDATE usuarios SET alterpassword = '${hash}' WHERE email = ?`, [email],
    (err, result) =>{
        if(err){
            console.log(err)
        }
    })

    const link = `http://localhost:3000/reset?email=${email}&validate=${hash}`

    const html = '<h1>Vimos uma solicitação para troca de senha!</h1> <hr> <h4>Se ainda tem desejo em trocar a senha da sua conta é só clicar no e-mail abaixo</h4>' + 
    `<p>Clique <a href="${link}">aqui</a> para alterar sua senha!</p>`

    console.log(email)

    transporter.sendMail({
        from: `"Leonardo Ferreira" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'ALTERAÇÃO DE SENHA',
        html: html
    }).then(info=>{
        const url = nodemailer.getTestMessageUrl(info)

        res.send({info, url})
    }).catch(error =>{
        console.log(error)
        res.send(error)
    })
})


app.post("/alter", (req, res) => {

    const password = req.body.password
    const email = req.body.email
    const validate = req.body.validate

    bcrypt.hash(password, saltRounds, (error, hash) =>{
        db.query(`UPDATE usuarios SET password = ? WHERE email = ? AND alterpassword = ?`, [hash, email, validate],
        (err, result) =>{
            if(err){
                res.send(err)
            }

            //alterar a hash para uma nova no db dps de trocar a senha

            if(result.changedRows > 0){ // vai verificar houve alguma alteração no banco de dados, se sim quer dizer que o validate bateu com o email e a senha foi trocada
                res.send({msg: 'successpass'})
            }else{
                res.send({msg: 'error'})
            }
        })
        
    })
    
})

//--------------------ENVIO DA FOTO--------------------

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, `${__dirname}/arquivos`);
  },
  filename: function(req, file, cb) {
    const formatos = ['.png', '.jpg', '.jpeg', '.jfif']
    const nome_arquivo = file.originalname
    let formato_arquivo = null

    for (let i = 0; i < formatos.length; i++) {
        if(nome_arquivo.indexOf(formatos[i]) != -1){
            formato_arquivo = formatos[i]
            break;
        }
    }

    if(formato_arquivo !== null){

        const arquivo = `PERFIL${formato_arquivo}`

        console.log(arquivo)

        cb(null, arquivo); // essa função aqui que salva o nome da imagem
    }else{
        console.log('Formato não aceito') //barra outros formatos caso o front-end seja burlado
        cb(null, file.originalname)
    }
  }
});

const upload = multer({ storage: storage });

app.post('/arquivo', upload.single('file'), (req, res) =>{

   const nome_arquivo = req.file.filename
   const user = req.body.user.substr(0,3).toUpperCase() //implementando o nome do user no arquivo porem somente os 3 primeiros digitos
   const id = req.body.id

   if(req.file.filename === req.file.originalname){ //mesmo o front barrando arquivos de formatos nao aceitos, fiz essa tratativa para remover arquivos de formatos diferentes
    fs.unlinkSync(`${__dirname}/arquivos/${nome_arquivo}`)
   }else{
    const imagem = `${id}-${user}-${nome_arquivo}`
    const imagem_sem_formato = `${id}-${user}-PERFIL`

    fs.renameSync(`${__dirname}/arquivos/${nome_arquivo}`, `${__dirname}/arquivos/${imagem}`, function(err){ //troca o nome implementando o nome e id do usuario atual, coloquei async para o readdir ler a pasta só dps do rename ser executado
        if(err){
            throw err;	
        }
    });

    fs.readdir(`${__dirname}/arquivos/`, (err, files) => { // vai ler os arquivos da pasta e remover a foto de perfil antiga do usuario quando ele foi adicionar uma nova
        if (err) {
            console.error(err);
            return;
        }
        files.forEach(file => {
            if(imagem != file && file.includes(imagem_sem_formato)){
                fs.unlinkSync(`${__dirname}/arquivos/${file}`)
            }
        });
    });
        

    db.query(`UPDATE usuarios SET img = ? WHERE idusuarios = ?`, [imagem, id],
    (err, result) =>{
        if(err){
            res.send(err)
        }
        
        if(result.changedRows > 0){ 
            res.send({msg: 'success'})
        }else{
            res.send({msg: 'error'})
        }

    })
   }
})


app.post('/getimg', (req, res) =>{
    const id = req.body.id

    db.query("SELECT img FROM usuarios WHERE idusuarios = ?", [id],
    (err, result) =>{
        if(err){
            res.send(err)
        }
        if(result.length > 0){
            res.send({routeimg: `http://localhost:3001/arquivos/${result[0].img}`})
        }else{
            res.send({routeimg: "inexistent"})
        }
    })
})



app.listen(3001, ()=>{
    console.log('Rodando na porta 3001')
})
