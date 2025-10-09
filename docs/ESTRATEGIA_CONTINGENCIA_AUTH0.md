# 🛡️ Estrategia de Contingencia para Falla de Auth0

## 🚨 Problema Identificado

**Riesgo actual**: Si Auth0 falla, ningún usuario puede hacer login, dejando el sistema completamente inaccesible.

```
Usuario intenta login → Auth0 caído ❌ → Sistema bloqueado 🚫
```

---

## 💡 Soluciones Propuestas

### **Opción 1: Sistema de Fallback a Credenciales Locales** ⭐ RECOMENDADO

**Cómo funciona:**
1. Usuario intenta login con Auth0 (método preferido)
2. Si Auth0 está caído → Sistema detecta el fallo
3. Automáticamente intenta autenticación con credenciales locales
4. Usuario accede con su contraseña local (almacenada en BD)

**Ventajas:**
- ✅ Continuidad del negocio garantizada
- ✅ Sin cambios significativos en la UX
- ✅ Mantiene beneficios de Auth0 cuando está disponible
- ✅ Fallback automático y transparente

**Desventajas:**
- ⚠️ Requiere mantener contraseñas locales (bcrypt)
- ⚠️ Mayor complejidad en la lógica de autenticación

---

### **Opción 2: Caché de Sesiones Activas**

**Cómo funciona:**
1. Cuando usuario se autentica con Auth0 → Sesión se guarda en Redis/caché local
2. Si Auth0 cae pero tienes sesión activa → Puedes seguir trabajando
3. Token local válido por 24-48 horas

**Ventajas:**
- ✅ Usuarios ya autenticados no se ven afectados
- ✅ Implementación relativamente simple
- ✅ No requiere credenciales duplicadas

**Desventajas:**
- ❌ Usuarios nuevos no pueden hacer login
- ❌ Sesiones expiradas = sin acceso
- ⚠️ Requiere infraestructura de caché (Redis)

---

### **Opción 3: Cuentas de Emergencia (Break-Glass)**

**Cómo funciona:**
1. Crear 1-3 cuentas especiales de administrador
2. Estas cuentas SOLO usan autenticación local (nunca Auth0)
3. Se activan únicamente en emergencias
4. Registro de auditoría estricto

**Ventajas:**
- ✅ Acceso garantizado para administradores
- ✅ Mínima complejidad adicional
- ✅ Auditoría clara de uso de emergencia

**Desventajas:**
- ❌ Solo para administradores (usuarios normales sin acceso)
- ⚠️ Riesgo de seguridad si no se gestiona bien
- ⚠️ No es solución completa

---

### **Opción 4: Monitoreo + Failover Automático**

**Cómo funciona:**
1. Health checks cada 30 segundos a Auth0
2. Si Auth0 falla → Alerta inmediata al equipo DevOps
3. Switch automático a proveedor de autenticación alternativo (AWS Cognito, Firebase Auth)

**Ventajas:**
- ✅ Alta disponibilidad
- ✅ Detección proactiva de problemas

**Desventajas:**
- ❌ Muy complejo de implementar
- ❌ Requiere mantener múltiples proveedores
- ❌ Costoso

---

## 🎯 Recomendación: Implementar Opción 1 + Opción 3

**Estrategia combinada:**

1. **Sistema de Fallback Automático** (Opción 1)
   - Para todos los usuarios
   - Fallback transparente a credenciales locales
   - Mantiene Auth0 como método principal

2. **+ Cuentas de Emergencia** (Opción 3)
   - 2 cuentas admin que SOLO usan autenticación local
   - Para casos críticos donde el fallback también falle

---

## 🔧 Implementación Propuesta

### **Flujo de Autenticación con Fallback**

```
┌─────────────────────────────────────────────────────────────┐
│                    Usuario intenta Login                     │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            ▼
            ┌───────────────────────────────┐
            │  Intentar Auth0 Login         │
            └───────────┬───────────────────┘
                        │
                ┌───────┴────────┐
                │                │
         ✅ Auth0 OK      ❌ Auth0 Falla
                │                │
                │                ▼
                │    ┌─────────────────────────┐
                │    │  Detectar fallo Auth0   │
                │    └──────────┬──────────────┘
                │               │
                │               ▼
                │    ┌─────────────────────────────────┐
                │    │  Fallback: Credenciales Locales │
                │    │  - Verificar email en BD        │
                │    │  - Comparar password (bcrypt)   │
                │    │  - Generar JWT local            │
                │    └──────────┬──────────────────────┘
                │               │
                │       ┌───────┴────────┐
                │       │                │
                │    ✅ OK          ❌ Fallo
                │       │                │
                ▼       ▼                ▼
         ┌──────────────────────────────────────┐
         │      Usuario Autenticado ✅          │
         │    - Token JWT válido                │
         │    - Permisos cargados desde BD      │
         └──────────────────────────────────────┘
                                          │
                                          ▼
                              ┌─────────────────────┐
                              │  Login Fallido ❌   │
                              │  Credenciales       │
                              │  incorrectas        │
                              └─────────────────────┘
```

---

### **Modelo de Datos - Usuario con Credenciales Duales**

```sql
-- Tabla: mom_usuarios
CREATE TABLE mom_usuarios (
  usuario_id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  
  -- ▼ Credenciales Auth0
  auth0_user_id VARCHAR(255) UNIQUE,  -- Si NULL = solo usa local
  auth0_enabled BOOLEAN DEFAULT TRUE, -- Permitir Auth0
  
  -- ▼ Credenciales Locales (Fallback)
  password_hash VARCHAR(255),         -- bcrypt hash
  local_auth_enabled BOOLEAN DEFAULT TRUE, -- Permitir fallback
  
  -- ▼ Auditoría
  last_auth_method VARCHAR(20),       -- 'auth0' o 'local'
  last_login_at TIMESTAMP,
  failed_login_attempts INT DEFAULT 0,
  
  rol_id INT REFERENCES mom_roles(rol_id),
  estado VARCHAR(20) DEFAULT 'activo'
);
```

---

### **Backend - Endpoint de Login Dual**

```typescript
// POST /api/auth/login
export const loginWithFallback = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // 1️⃣ Intentar Auth0 primero
    const auth0Result = await tryAuth0Login(email, password);
    
    if (auth0Result.success) {
      await updateLastLogin(email, 'auth0');
      return res.json({
        token: auth0Result.token,
        method: 'auth0',
        user: auth0Result.user
      });
    }

  } catch (auth0Error) {
    console.warn('⚠️ Auth0 falló, intentando fallback local...', auth0Error);

    // 2️⃣ Fallback a credenciales locales
    const localResult = await tryLocalLogin(email, password);
    
    if (localResult.success) {
      await updateLastLogin(email, 'local');
      return res.json({
        token: localResult.token,
        method: 'local-fallback',
        user: localResult.user,
        warning: 'Autenticado con credenciales locales (Auth0 no disponible)'
      });
    }

    // 3️⃣ Ambos métodos fallaron
    return res.status(401).json({
      error: 'Credenciales incorrectas'
    });
  }
};
```

---

### **Frontend - Cliente React con Fallback**

```typescript
// services/authService.ts
export const login = async (email: string, password: string) => {
  try {
    // Intentar login (backend maneja Auth0 + fallback)
    const response = await axios.post('/api/auth/login', {
      email,
      password
    });

    const { token, method, user, warning } = response.data;

    // Guardar token
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    // Mostrar advertencia si fue fallback
    if (method === 'local-fallback' && warning) {
      toast.warning(warning, {
        duration: 5000,
        icon: '⚠️'
      });
    }

    return { success: true, user, method };

  } catch (error) {
    return { success: false, error: error.response?.data?.error };
  }
};
```

---

## 🔐 Consideraciones de Seguridad

### **Gestión de Contraseñas Locales**

1. **Hash con bcrypt** (factor de costo 12+)
   ```typescript
   import bcrypt from 'bcrypt';
   const hash = await bcrypt.hash(password, 12);
   ```

2. **Rotación obligatoria cada 90 días**
   ```sql
   ALTER TABLE mom_usuarios ADD COLUMN password_changed_at TIMESTAMP;
   ```

3. **Política de complejidad**
   - Mínimo 8 caracteres
   - Al menos 1 mayúscula, 1 minúscula, 1 número, 1 símbolo

4. **Bloqueo por intentos fallidos**
   - 5 intentos fallidos → Bloqueo temporal 15 minutos
   - Registro en auditoría

---

## 📊 Monitoreo y Alertas

### **Health Check de Auth0**

```typescript
// Verificar cada 60 segundos
setInterval(async () => {
  try {
    const response = await axios.get('https://<tu-dominio>.auth0.com/test');
    
    if (response.status !== 200) {
      throw new Error('Auth0 unhealthy');
    }

    // Auth0 disponible
    metrics.auth0Status = 'healthy';
    metrics.lastCheck = new Date();

  } catch (error) {
    // Auth0 caído - Alerta
    metrics.auth0Status = 'down';
    await sendAlert({
      severity: 'critical',
      message: '🚨 Auth0 no responde - Fallback activado',
      channel: '#alerts-devops'
    });
  }
}, 60000);
```

---

## 🧪 Pruebas de Contingencia

### **Simulación de Falla de Auth0**

```typescript
// test/auth-fallback.test.ts
describe('Fallback Authentication', () => {
  it('debe usar credenciales locales cuando Auth0 falla', async () => {
    // Mock Auth0 failure
    nock('https://dev-auth0.auth0.com')
      .post('/oauth/token')
      .replyWithError('Network error');

    // Intentar login
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'Test1234!' });

    expect(response.status).toBe(200);
    expect(response.body.method).toBe('local-fallback');
    expect(response.body.warning).toContain('Auth0 no disponible');
  });
});
```

---

## 📋 Plan de Implementación

### **Fase 1: Preparación (Semana 1)**
- [ ] Agregar columna `password_hash` a `mom_usuarios`
- [ ] Implementar endpoint `/api/auth/set-local-password` para que usuarios configuren contraseña local
- [ ] Crear utilidades de bcrypt y validación de contraseñas

### **Fase 2: Desarrollo (Semana 2)**
- [ ] Implementar `tryLocalLogin()` en backend
- [ ] Modificar endpoint `/api/auth/login` para incluir fallback
- [ ] Agregar middleware de detección de método de autenticación

### **Fase 3: Testing (Semana 3)**
- [ ] Pruebas unitarias de fallback
- [ ] Pruebas de integración con Auth0 mockeado
- [ ] Simulación de caída de Auth0 en staging

### **Fase 4: Despliegue (Semana 4)**
- [ ] Desplegar en producción
- [ ] Monitorear logs de fallback
- [ ] Comunicar a usuarios sobre configurar contraseña local

---

## 🎯 Conclusión

**Sistema recomendado**: Autenticación híbrida con fallback automático

- **Normal**: Auth0 (SSO, seguridad robusta)
- **Contingencia**: Credenciales locales (continuidad del negocio)
- **Emergencia**: Cuentas break-glass (administradores)

**Resultado**: Sistema resiliente que mantiene 99.9% de disponibilidad incluso si Auth0 falla.

