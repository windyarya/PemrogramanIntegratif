# AyoLaundry
AyoLaundry merupakan sistem layanan laundry online dimana mengintegrasi berbagai toko jasa laundry dan pengguna dapat memilih pesanan dari toko-toko laundry yang tersedia. Adapun fitur yang melengkapi sistem AyoLaundry ini terdapat fungsi antar-jemput pakaian laundry dari berbagai pilihan jasa laundry yang tersedia sehingga pelanggan dapat melakukan pemesanan dari rumah dan melakukan pembayarannya menggunakan e-money, salah satunya dengan ECoin.


Transfer Antar E-Money dapat dilihat di -> Dokumentasi Postman dapat dilihat di [sini](https://documenter.getpostman.com/view/18376585/Uz5GoG8b)

AyoLaundry ini kami deploy melalui platform heroku dan dapat diakses pada [link berikut.](https://ayolaundry.masuk.id/)

ENDPOINT:

`https://ayolaundry.masuk.id/daftar`

`https://ayolaundry.masuk.id/masuk`

`https://ayolaundry.masuk.id/toko/tambah`

`https://ayolaundry.masuk.id/toko/edit`

`https://ayolaundry.masuk.id/toko/cari`

`https://ayolaundry.masuk.id/produk/tambah`

`https://ayolaundry.masuk.id/produk/edit`

`https://ayolaundry.masuk.id/produk/cari`

`https://ayolaundry.masuk.id/produk/hapus`

`https://ayolaundry.masuk.id/order/buat`

`https://ayolaundry.masuk.id/order/pembayaran`

`https://ayolaundry.masuk.id/order/seller/pickup`

`https://ayolaundry.masuk.id/order/seller/kirim`

`https://ayolaundry.masuk.id/order/terkirim`

`https://ayolaundry.masuk.id/order/riwayat`


# 1. https://ayolaundry.masuk.id/daftar
API ini merupakan API untuk mendaftarkan akun pada marketplace kami, yaitu AyoLaundry. Adapun data yang dimasukkan adalah berupa user_name, email, phone, password.
```json
{
  "phone" : "08111197997",
  "email" : "windy@gmail.com",
  "username": "windy",
  "password" : "123test"
}
```

Apabila request pada /api/daftar berhasil, maka berikut hasil yang akan ditampilkan

```json
{
  "message": "user was successfully registered"
}
```
Dengan begitu, data akun baru telah ditambahkan pada database.

# 2. https://ayolaundry.masuk.id/masuk
API ini merupakan API yang digunakan user untuk masuk ke dalam akun AyoLaundry yang sudah terdaftar di database marketlace. Adapun data yang perlu dimasukkan adalahphone dan password. Berikut merupakan contoh data yang dimasukkan 
 
```json
{
  "email" : "albert@gmail.com",
  "password" : "albert123"
}
```
Setelah dimasukkan data yang benar, maka user akan mendapatkan token yang dapat digunakan untuk mengakses fitur lainnya
 
```json
{
    "email" : "albert@gmail.com",
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjoxMCwicGhvbmUiOiIwODExMTE5Nzk5NyIsInJvbGUiOiJtZW1iZXIiLCJpYXQiOjE2NTAzNzY3MzAsImV4cCI6MTY1MDM4MDMzMH0.IU5vEqpbYRPfjqOvgk040VOjevxqlEriXc67Kr2EMm8"
}
```

# 3. https://ayolaundry.masuk.id/toko/tambah
API ini digunakan untuk menambahkan toko baru dalam marketplace AyoLaundry. Berikut merupakan data yang dimasukkan untuk memanggil API tersebut
 
```json
{
    "name" : "Albert Laundry",
    "address": "Jl. Sutorejo, Mulyorejo, Surabaya",
    "description": "Laundry yang hemat"
}
```
 
Berikut hasil yang diperoleh ketika toko berhasil terdaftar
 
 ```json
{
    "message": "Toko registered successfully!"
}
 ```

# 4. https://ayolaundry.masuk.id/toko/edit
API ini merupakan API yang digunakan user penjual untuk mengupdate data dari tokonya yaitu pada bagian alamat (address) dan status dari toko. Berikut adalah parameter untuk endpoint ini.

```json
{
    "address": "Jl. Sutorejo Utara No. 19, Mulyorejo, Surabaya"
}
```
```json
{
    "status": 1
}
 ```

Berikut hasil yang diperoleh setelah mengupdate informasi data toko
 
 ```json
 {
    "message": "Update address successfully!"
}
 ```

# 5. https://ayolaundry.masuk.id/toko/cari
API ini dapat digunakan user untuk melakukan pencarian dari suatu toko di marketplace AyoLaundry. Dalam melakukan pencarian, dapat dilakukan dengan method GET dan untuk pencarian seluruh toko tidak perlu mengisikan parameter. Sedangkan untuk mencari suatu toko yang spesifik user dapat mengisi informasi data seperti sebagai berikut:
 
 ```json
 {
  "name": "Albert Laundry"
}
 ```

Berikut hasil yang didapat dari pemanggilan API tersebut:
 
 ```json
{
    "id": "10",
    "id_owner": "7",
    "name": "Albert Laundry",
    "address": "Jl. Sutorejo Utara No. 19, Mulyorejo, Surabaya",
    "status": true,
    "amount": null,
    "description": "Laundry yang hemat",
    "createdAt": "2022-06-06T08:44:00.000Z",
    "updateAt": "2022-06-06T08:44:00.000Z",
}
 ```

# 6. https://ayolaundry.masuk.id/produk/tambah
API ini dapat digunakan user penjual untuk melakukan penambahan produk pada tokonya dengan mengisi informasi data seperti sebagai berikut:
 
```json
{
  "name": "Laundry Kiloan Express",
  "price" : 5000,
  "max_weight": 1,
  "description": "Laundry Kiloan Express per kilo 5000"
}
```
Maka sistem akan merespon dengan message sebagai berikut yang menandakan penambahan produk telah berhasil:
 
 ```json
{
    "message": "Product added successfully!"
}
 ```

# 7. https://ayolaundry.masuk.id/produk/edit
API ini digunakan untuk melakukan update data pada produk dalam suatu toko. Berikut merupakan data yang dimasukkan untuk memanggil API tersebut
 
```json
{
    "name": "Laundry Kiloan Express",
    "price" : 4000,
    "max_weight": 1,
    "description": "Laundry Kiloan Express per kilo 5000"
}
```
 
Maka sistem akan merespon dengan message sebagai berikut yang menandakan penambahan produk telah berhasil:
 
 ```json
{
    "message": "Update product successfully!"
}
 ```

# 8. https://ayolaundry.masuk.id/produk/cari
API ini digunakan untuk melakukan pencarian suatu produk. Berikut merupakan data yang dimasukkan untuk memanggil API tersebut
 
```json
{
    "product_name": "Laundry Kiloan Express"
}
```
 
Maka sistem akan menampilkan produk dengan message sebagai berikut:
 
 ```json
{
    "id": "5",
    "id_owner": "10",
    "name": "Laundry Kiloan Express",
    "price": 4000,
    "max_weight": 1,
    "amount": null,
    "description": "Laundry Kiloan Express per kilo 4000",
    "createdAt": "2022-06-06T08:44:00.000Z",
    "updateAt": "2022-06-06T08:59:50.000Z",
}
 ```

# 9. https://ayolaundry.masuk.id/produk/hapus
API ini digunakan untuk melakukan penghapusan suatu produk dari toko oleh penjual. Berikut merupakan data yang dimasukkan untuk memanggil API tersebut
 
```json
{
    "name": "Laundry Kiloan Express"
}
```
 
Maka sistem akan menampilkan produk dengan message sebagai berikut yang menandakan penghapusan produk telah berhasil:
 
 ```json
{
    "id": "Delete product successfully!",
}
 ```

# 10. https://ayolaundry.masuk.id/order/buat
API ini digunakan untuk melakukan pemesanan atau order suatu produk. Berikut merupakan data yang dimasukkan untuk memanggil API tersebut
 
```json
{
    "product_name": "Laundry Kiloan Express"
}
```
 
Maka sistem akan menampilkan produk dengan message sebagai berikut yang menandakan penambahan produk telah berhasil:
 
 ```json
{
    "id": "5",
    "id_owner": "10",
    "name": "Laundry Kiloan Express",
    "price": 4000,
    "max_weight": 1,
    "amount": null,
    "description": "Laundry Kiloan Express per kilo 4000",
    "createdAt": "2022-06-06T08:44:00.000Z",
    "updateAt": "2022-06-06T08:59:50.000Z",
}
 ```

# 11. https://ayolaundry.masuk.id/order/pembayaran
API ini digunakan untuk melakukan pembayaran atau payment dari suatu produk yang telah diorder melalui emoney. Berikut merupakan data yang dimasukkan untuk memanggil API tersebut
 
```json
{
    "username": "ecoin10",
    "password": "ecoin123"
}
```
 
Maka sistem akan menampilkan produk dengan message sebagai berikut yang menandakan penambahan produk telah berhasil:
 
 ```json
{
    "message": "Payment using Buski Coins Success!"
}
 ```

# 12. https://ayolaundry.masuk.id/order/seller/pickup
API ini digunakan untuk melakukan konfirmasi pick up pesanan yang telah dibayar. Berikut merupakan data yang dimasukkan untuk memanggil API tersebut
 
```json
{
    "status": "Picked Up"
}
```
 
Maka sistem akan menampilkan produk dengan message sebagai berikut:
 
 ```json
{
    "order_num": "6",
    "picked_from": "Jl. Keputih Tegal, Sukolilo, Surabaya",
    "message": "Order picked up and being processes."
}
 ```

# 13. https://ayolaundry.masuk.id/order/seller/kirim
API ini digunakan untuk melakukan konfirmasi pesanan yang telah dikirim. Berikut merupakan data yang dimasukkan untuk memanggil API tersebut
 
```json
{
    "status": "Shipping to Customer"
}
```
 
Maka sistem akan menampilkan produk dengan message sebagai berikut:
 
 ```json
{
    "order_num": "6",
    "picked_from": "Jl. Keputih Tegal, Sukolilo, Surabaya",
    "message": "Order is ready and sent to customer."
}
 ```

# 13. https://ayolaundry.masuk.id/order/terkirim
API ini digunakan untuk melakukan konfirmasi pesanan yang telah terkirim. Berikut merupakan data yang dimasukkan untuk memanggil API tersebut
 
```json
{
    "status": "Delivered"
}
```
 
Maka sistem akan menampilkan produk dengan message sebagai berikut:
 
 ```json
{
    "order_num": "6",
    "picked_from": "Jl. Keputih Tegal, Sukolilo, Surabaya",
    "message": "Order delivered."
}
 ```

# 14. https://ayolaundry.masuk.id/order/riwayat
API ini digunakan untuk melihat history atau riwayat yang telah dilakukan. Pada API ini tidak ada parameter, cukup memakai kode jwt saja. Maka sistem akan menampilkan produk dengan message sebagai berikut:
 
 ```json
{
    "id_seller": 0,
    "id_product": 5,
    "amount": 2,
    "total": 8000,
    "pickUp_address": "",
    "deliver_address": "",
    "paymentwith": "Buski Coins",
    "isPickedUp": false,
    "isPaid": true,
    "isShipped": false,
    "isDelievered": false,
    "createdAt": "2022-06-06T08:44:00.000Z",
    "updateAt": "2022-06-06T08:59:50.000Z",
}
 ```
