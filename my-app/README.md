## Event Management Frontend (Next.js)

Aplicación frontend para el taller individual: gestión de eventos con autenticación simple.

### Funcionalidades Implementadas
- Login y persistencia de token en LocalStorage.
- Creación de usuarios (un usuario autenticado crea a otro).
- CRUD de eventos (solo el creador puede editar/eliminar).
- Listado de eventos con filtros (ciudad, fecha desde/hasta) y número de participantes.
- Registro (inscripción) a eventos evitando duplicados.
- Perfil de usuario con eventos a los que se inscribió.
- Validaciones básicas de formularios y estados de carga/errores.

### Estructura Principal
```
app/
	(auth)/login/page.tsx      # Página de login
	events/                    # Listado, creación, detalle y edición
	profile/page.tsx           # Perfil del usuario
	users/new/page.tsx         # Crear usuario
	layout.tsx / globals.css   # Layout y estilos
components/                  # Componentes compartidos
lib/                         # API client, tipos y contexto de auth
```

### Variables de Entorno
Crear `.env.local` (ya creado) con:
```
NEXT_PUBLIC_API_BASE_URL=http://koc480gos8gwc0g4oscsgk00.200.3.193.11.sslip.io
```
Asegúrate de no poner `/` al final.

### Scripts
| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Entorno de desarrollo |
| `npm run build` | Build de producción |
| `npm start` | Servir build de producción |
| `npm run lint` | Linter |

### Flujo de Uso
1. Inicia la app: `npm run dev`.
2. Ve a `/login` y autentícate (usuario debe existir previamente en backend).
3. Crea nuevos usuarios en `/users/new` si ya estás autenticado.
4. Crea eventos en `/events/create`.
5. Consulta y filtra eventos en `/events`.
6. Inscríbete desde el detalle de un evento.
7. Revisa tu perfil y eventos inscritos en `/profile`.

### Notas Técnicas
- No se encriptan contraseñas (según enunciado educativo).
- El token se guarda con clave `eventapp_token`.
- Se intenta inferir conteo de participantes a partir de diferentes campos devueltos (`participantsCount`, `registrationsCount`, arrays, etc.).
- Se usa `date-fns` únicamente para formateo de fechas.

### Próximas Mejores Prácticas (No obligatorias)
- Reemplazar almacenamiento plano de token con cookies httpOnly.
- Manejo de refresco/expiración de token.
- Formularios con `react-hook-form` y validaciones más ricas.
- Paginación y ordenamiento de eventos.
- Internacionalización (i18n) y accesibilidad adicional.

### Licencia
Uso académico.
