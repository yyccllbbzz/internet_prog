const express = require('express');
const app = express();
const port = 3000;
const bcrypt = require('bcrypt');


app.use(express.json());

const users = [{username:"admin",password:"123"}]; 



app.post('/add-user',async (req, res) => { //async  uzun sürecek işlemleri arka planda çalıştırarak, kullanıcının web sayfasının kilitlenmesini önlemek için kullanılır.
    
    const { username, password } = req.body; 

   
    if (!username || !password) {
        return res.status(400).send('Kullanıcı adı ve şifre gerekli.'); // 404 olan bu, istemcinin (örneğin, bir web tarayıcısı) sunucuya gönderdiği isteğin geçersiz veya hatalı olduğunu belirtir.
    }

    // password'ün bir string olduğunu kontrol et
    if (typeof password !== 'string') {
        return res.status(400).send('Şifre geçerli bir string olmalıdır.');
    }
    

    const hashedPassword = await bcrypt.hash(password, 10); // Parolayı hashledik 
    users.push({ username, password: hashedPassword });

    res.status(201).send( 'kullanıcı eklendi!' ); //202 olan Bu, sunucunun istemcinin isteğini başarıyla işlediğini ve yeni bir kaynağın oluşturulduğunu belirtir.
});

app.get('/get_users', (req, res) => {
    
     res.json(users);
});

app.get('/login',async(req, res) => {
    const { username, password } = req.query;

    const user = users.find(user => user.username === username && user.password === password); //find metodu, belirtilen koşulu sağlayan ilk öğeyi döndürür.

    if (user) {
        const isMatch = await bcrypt.compare(password, user.password); // Parolayı karşılaştırdık
        if (isMatch) {
            return res.send(true);
        }
    }
    return res.send(false);
});



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


//PASSWORDU YUKARIDA HASH OLARAK TUTMAM GEREK DOĞRULARKEN DE O ŞEKİL OLACAK 8.SATIRDAKİ