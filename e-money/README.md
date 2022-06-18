# e-COIN

ECoin merupakan sistem e-money yang dapat digunakan untuk melakukan pembayaran pada marketplace, salah satunya adalah AyoLaundry. Fitur-fitur yang tersedia dalam ECoin meliputi Isi Ulang untuk melakukan Top Up Saldo ECoin, Cek Saldo untuk melihat saldo terakhir ECoin, Pembayaran untuk melakukan pembayaran pada berbagai platform dan dapat diakses karena menggunakan API Publik, Transfer untuk melakukan transfer ke sesama ECoin, atau e-money lain atau ke Bank, dan Riwayat Transaksi untuk mencatat segala historis transaksi yang telah dilakukan.

e-Coin ini kami deploy melalui idcloudhost dan dapat diakses pada [link berikut.](https://ecoin10.my.id/)

ENDPOINT:

`/api/daftar`

`/api/masuk`

`/api/saldo`

`/api/isiulang`

`/api/pembayaran`

`/api/transfer`

`/api/riwayat`

## 1. /api/daftar

API ini merupakan API untuk mendaftarkan akun pada e-money kami, yaitu e-COIN. Adapun data yang dimasukkan adalah berupa user_name, email, phone, password.

```json
{
  "user_name": "windy",
  "email" : "windy@gmail.com",
  "phone" : "08111197997",
  "password" : "123test"
}
```

Apabila request pada /api/daftar berhasil, maka berikut hasil yang akan ditampilkan

```json
{
  "message": "The user has been successfully inserted"
}
```

Dengan begitu, data baru telah ditambahkan pada database

Apabila data yang dimasukkan tidak lengkap, maka akan muncul suatu message mengenai data tersebut, berikut adalah contoh data yang tidak lengkap

```json
{
  "user_name": "windy",
  "email" : "windy@gmail.com"
}
```

Berikut adalah hasil dari input tersebut

 ```json
 {
    "errors": [
        {
            "msg": "Invalid phone number",
            "param": "phone",
            "location": "body"
        },
        {
            "msg": "The Password must be of minimum 4 characters length",
            "param": "password",
            "location": "body"
        },
        {
            "value": "",
            "msg": "The Password must be of minimum 4 characters length",
            "param": "password",
            "location": "body"
        }
    ]
}
 ```

Berikut adalah hasil screenshot dari postman.
![Hasil Test API Daftar](image/img1.png)

## 2. /api/masuk

 API ini merupakan API yang digunakan user untuk masuk ke dalam akun e-COIN yang sudah terdaftar di database e-COIN. Adapun data yang perlu dimasukkan adalahphone dan password. Berikut merupakan contoh data yang dimasukkan

 ```json
 {
  "phone" : "08111197997",
  "password" : "123test"
 }
 ```

 Setelah dimasukkan data yang benar, maka user akan mendapatkan token yang dapat digunakan untuk mengakses fitur lainnya

 ```json
 {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjoxMCwicGhvbmUiOiIwODExMTE5Nzk5NyIsInJvbGUiOiJtZW1iZXIiLCJpYXQiOjE2NTAzNzY3MzAsImV4cCI6MTY1MDM4MDMzMH0.IU5vEqpbYRPfjqOvgk040VOjevxqlEriXc67Kr2EMm8",
    "phone": "08111197997",
    "email": "windy@gmail.com"
}
 ```

 Jika data masuk yang dimasukkan tidak lengkap, seperti berikut ini

 ```json
 {
  "phone" : "08111197997"
}
 ```

 Maka output yang keluar merupakan peringatan mengenai data yang dimasukkan, yaitu mengenai password

 ```json
 {
    "errors": [
        {
            "msg": "The Password must be of minimum 4 characters length",
            "param": "password",
            "location": "body"
        },
        {
            "value": "",
            "msg": "The Password must be of minimum 4 characters length",
            "param": "password",
            "location": "body"
        }
    ]
}
 ```

 Jika data yang dimasukkan tidak sesuai database, seperti salah memasukkan password yang akan ditunjukkan pada setelah ini

 ```json
 {
  "phone" : "08111197997",
  "password": "123tes"
}
 ```

 Maka hasil dari request tersebut ialah

 ```json
 {
    "message": "Incorrect password"
}
 ```

Berikut adalah hasil screenshot dari postman.
![Hasil Test API Daftar](image/img2.png)

## 3. /api/saldo

 API ini digunakan untuk melihat saldo dari user tersebut, yaitu dengan cara memasukkan data nomor telepon yang menjadi identifier akun kita dibandingkan dengan akun lain. Sebelum memanggil API ini, perlu dimasukkan token yang didapatkan pada /api/masuk ke bearer token di bagian authentication. Berikut merupakan data yang dimasukkan untuk memanggil API tersebut

 ```json
 {
  "phone" : "08111197997"
}
 ```

 Berikut hasil yang diperoleh dari memanggil id yang sesuai dengan tokennya

 ```json
 {
    "saldo": {
        "id_user": 10,
        "phone": "08111197997",
        "credits": 0
    }
}
 ```

 Apabila phone number yang dimasukkan tidak sesuai dengan id yang ada pada JWT nya, maka akan keluar peringatan seperti berikut

 ```json
 {
    "message": "User ID is not matched! You are not allowed to access this information."
}
 ```

 Berikut adalah hasil screenshot dari postman.
![Hasil Test API Daftar](image/img3.png)

## 4. /api/isiulang

 API ini merupakan API yang digunakan user untuk mengisi ulang saldo yang dimiliki oleh user pada akunnya. Sebelum memanggil API ini, perlu dimasukkan token yang didapatkan pada /api/masuk ke bearer token di bagian authentication. Hanya admin saja yang bisa melakukan top-up ke semua user. Untuk user biasa tidak diijinkan melakukan top-up secara langsung karena alasan keamanan. Berikut adalah parameter untuk endpoint ini.

 ```json
{
    "phone": "081122334456",
    "amount": 50000,
    "description": "Pembayaran pertama"
}
 ```

Tidak lupa juga untuk menambahkan token jwt ke authorization. Jika token jwt tersebut merupakan token user biasa maka topup gagal. Sebaliknya, jika token jwt adalah admin maka topup berhasil dan saldo dari akun tersebut akan bertambah sesuai amount yang ingin ditambahkan

Berikut adalah hasil screenshot dari postman.

Screenshot jika topup berhasil
![Hasil Test API Daftar](image/img4a.png)

Screenshot jika topup gagal karena hak akses
![Hasil Test API Daftar](image/img4b.png)

## 5. /api/pembayaran

API ini dapat digunakan user untuk melakukan pembayaran dari suatu marketplace seperti AyoLaundry melalui e-COIN. Sebelum memanggil API ini, perlu dimasukkan token yang didapatkan pada /api/masuk ke bearer token di bagian authentication. Dalam melakukan pembayaran user perlu mengisi informasi data seperti sebagai berikut:

 ```json
 {
  "phone" : "082134567892",
  "password": "123test",
  "merchant": 1,
  "amount": 10000,
  "description": "Pembayaran Pertama"
}
 ```

Dalam hal ini, user dapat memilih merchant yang ingin dibayarkan dengan ketentuan memasukkan int `1` untuk AyoLaundry, sedangkan untuk antar merchant lainnya dengan int seterusnya.
Setelah request dengan ketentuan data seperti di atas dikirimkan, maka sistem akan merespon dengan message sebagai berikut yang menandakan pembayaran telah berhasil:

 ```json
 {
    "message": "Payment Successful"
}
 ```

Setelah pembayaran berhasil dilakukan, data mengenai saldo dari akun tersebut akan berkurang sesuai amount pembayaran yang dilakukan.

Apabila phone number yang dimasukkan tidak sesuai dengan id yang ada pada JWT nya, maka akan keluar peringatan seperti berikut

 ```json
 {
    "message": "User ID is not matched! You are not allowed to access this information."
}
 ```

Berikut adalah hasil screenshot dari postman.
![Hasil Test API Daftar](image/img5.png)

## 6. /api/transfer

API ini dapat digunakan user untuk melakukan transfer baik sesama e-money e-COIN atau antar e-money lainnya yang telah diintegrasikan. Sebelum memanggil API ini, perlu dimasukkan token yang didapatkan pada /api/masuk ke bearer token di bagian authentication. Dalam melakukan transfer user perlu mengisi informasi data seperti sebagai berikut:

 ```json
 {
  "phone" : "082134567892",
  "password": "123test",
  "tfmethod": 1,
  "amount": 10000,
  "phone2" : "082134567891",
  "description": "Transfer Pertama"
}
 ```

Dalam hal ini, jika user memilih metode transfer ke sesama e-COIN maka dapat memasukkan int `1`, sedangkan untuk antar e-money lain dengan int `2`. Lalu untuk penerima sendiri ditujukan melalui `phone2`.
Setelah request dengan ketentuan data seperti di atas dikirimkan, maka sistem akan merespon dengan message sebagai berikut yang menandakan transfer telah berhasil:

 ```json
 {
    "message": "Transfer Successful"
}
 ```

Setelah pembayaran berhasil dilakukan, data mengenai saldo dari akun pengirim akan berkurang sesuai amount transfer yang dilakukan.

Apabila phone number yang dimasukkan tidak sesuai dengan id yang ada pada JWT nya, maka akan keluar peringatan seperti berikut

 ```json
 {
    "message": "User ID is not matched! You are not allowed to access this information."
}
 ```

Berikut adalah hasil screenshot dari postman.
![Hasil Test API Daftar](image/img6.png)

## 7. /api/riwayat

API ini digunakan untuk melihat riwayat transaksi dari user tersebut, yaitu dengan cara memasukkan data nomor telepon yang menjadi identifier akun kita dibandingkan dengan akun lain. Sebelum memanggil API ini, perlu dimasukkan token yang didapatkan pada /api/masuk ke bearer token di bagian authentication. Berikut merupakan data yang dimasukkan untuk memanggil API tersebut

 ```json
 {
  "phone" : "082134567892"
}
 ```

Ketika request berhasil dikirimkan, sistem akan merespon dari memanggil id yang sesuai dengan tokennya dan ditampilkan informasi sesuai request yang diminta seperti sebagai berikut:

 ```json
 {
    "message": {
        "id_transaction": 8,
        "transmethod": "topup",
        "id_sender": "8",
        "id_receiver": "10",
        "merchant": "",
        "transfermethod": 0,
        "amount": "50000",
        "date": "2022-04-19 08:41:02.36"
    }
}
 ```

Apabila phone number yang dimasukkan tidak sesuai dengan id yang ada pada JWT nya, maka akan keluar peringatan seperti berikut

 ```json
{
    "message": "User ID is not matched! You are not allowed to access this information."
}
 ```

Berikut adalah hasil screenshot dari postman.
![Hasil Test API Daftar](image/img7.png)
