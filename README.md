# Trabajo práctico 03 — API HTTP con Express

## Descripción
API desarrollada con Node.js y Express para la gestión e inspección temporal del inventario de una tienda de instrumentos musicales. 

El sistema inicializa sus datos desde un archivo local en formato JSON (`datos/instrumentos.json`) antes de habilitar la recepción de solicitudes HTTP. Permite a los usuarios consultar la colección completa, aplicar filtros opcionales por familia, recuperar fichas individuales por su identificador único e incorporar nuevos instrumentos en la memoria volátil del servidor durante su ejecución.

### Función de express.json()
`express.json()` es un middleware integrado en Express que intercepta las peticiones que contienen un cuerpo en formato JSON (`Content-Type: application/json`), parsea la información recibida y la expone en la propiedad `req.body` para que los controladores del servidor puedan acceder y validar fácilmente los datos enviados por el cliente.

### Diferencia entre parámetro de ruta y parámetro de consulta
- **Parámetro de ruta (`req.params`):** Utilizado en `GET /api/instrumentos/:id`. Forma parte de la ruta estructural de la URL para identificar un recurso único de forma directa.
- **Parámetro de consulta / Query Param (`req.query`):** Utilizado en `GET /api/instrumentos?familia=Cordófonos`. Se agrega después del signo `?` y sirve para modificar o filtrar la presentación de un listado de recursos de forma opcional sin alterar la ruta base.

## Instalación
Para instalar las dependencias requeridas por el proyecto (como `express`), ejecute el siguiente comando en la terminal:

npm install

## Ejecución
Para iniciar la aplicación y encender el servidor HTTP
npm start

El servidor se ejecutará en http://localhost:3000.

Para detener el servidor en cualquier momento, presione Ctrl + C en la terminal.

Para comprobar la sintaxis de los archivos principales sin ejecutar el servidor:

npm run check

EndpointsMétodoEndpointDescripción GET/Punto de chequeo inicial (Health Check). Confirma que la API está disponible.
GET/api/instrumentosMuestra el listado completo o filtra por la query ?familia=....
GET/api/instrumentos/:idRecupera el detalle de un instrumento específico según su parámetro de ruta :id.
POST/api/instrumentosCrea y agrega un nuevo instrumento a la colección en memoria RAM.

Ejemplos de solicitudes
1. Bienvenida
Método: GET

URL: http://localhost:3000/

Respuesta esperada (200 OK):
{
  "mensaje": "API de instrumentos disponible"
}

2. Listar todos los instrumentos
Método: GET

URL: http://localhost:3000/api/instrumentos

Respuesta esperada (200 OK):
[
  {
    "id": 1,
    "nombre": "Guitarra Acústica",
    "familia": "Cordófonos",
    "origen": "civilizaciones de Asia Menor y Oriente Medio",
    "descripcion": "Usan cuerdas metálicas que entregan un tono fuerte y brillante.",
    "disponible": true
  }
]

3. Búsqueda filtrada por familia
Método: GET

URL: http://localhost:3000/api/instrumentos?familia=Cordófonos

Respuesta esperada (200 OK): Devuelve un arreglo filtrado con los instrumentos coincidentes. Si no hay coincidencias, devuelve [] con estado 200.

4. Consultar detalle por identificador (Existente)
Método: GET

URL: http://localhost:3000/api/instrumentos/1

Respuesta esperada (200 OK):
{
  "id": 1,
  "nombre": "Guitarra Acústica",
  "familia": "Cordófonos",
  "origen": "civilizaciones de Asia Menor y Oriente Medio",
  "descripcion": "Usan cuerdas metálicas que entregan un tono fuerte y brillante.",
  "disponible": true
}
5. Consultar detalle por identificador (Inexistente)
Método: GET

URL: http://localhost:3000/api/instrumentos/999

Respuesta esperada (404 Not Found):
{
  "error": "Instrumento no encontrado"
}
6. Creación de un nuevo recurso
Método: POST

URL: http://localhost:3000/api/instrumentos

Headers: Content-Type: application/json

Cuerpo (JSON):
{
  "nombre": "Ukelele Soprano",
  "familia": "Cordófonos",
  "origen": "Hawái",
  "descripcion": "Instrumento de cuerda pulsada de tamaño pequeño.",
  "disponible": false
}
Respuesta esperada (201 Created):

JSON
7. Creación inválida (faltan datos)
Método: POST

URL: http://localhost:3000/api/instrumentos

Headers: Content-Type: application/json

Cuerpo (JSON Incompleto):
{
  "nombre": "Ukelele"
}
Respuesta esperada (400 Bad Request):
{
  "error": "Todos los campos son obligatorios: nombre, familia, origen, descripcion y disponible."
}

Persistencia de los datos
La persistencia de los datos en esta API es temporal y volátil, residiendo exclusivamente en la memoria RAM durante el ciclo de vida del proceso de Node.js.

Los datos iniciales se cargan desde el archivo datos/instrumentos.json al encender el servidor. Cuando se realiza un POST exitoso, el nuevo instrumento se añade únicamente a la memoria en ejecución. Al reiniciar o detener el proceso (Ctrl + C) y ejecutar nuevamente npm start, los datos creados desaparecen debido a que no se sobrescribe el archivo JSON original ni se utiliza una base de datos persistente.
